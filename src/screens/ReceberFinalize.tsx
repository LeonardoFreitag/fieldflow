import { Image } from '@ui/image';
import { Center } from '@ui/center';
import { Link, LinkText } from '@ui/link';
import { Text } from '@ui/text';
import { HStack } from '@ui/hstack';
import { VStack } from '@ui/vstack';
import { Heading } from '@ui/heading';
import { Button, ButtonIcon } from '@ui/button';
import { useNavigation } from '@react-navigation/native';
import {
  CalendarClock,
  Camera,
  CheckCheck,
  ChevronLeft,
  CornerDownLeft,
  Plus,
  Trash,
} from 'lucide-react-native';
import { useAppSelector } from '../store/store';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, TouchableOpacity } from 'react-native';
import { ModalCamera } from '@components/ModalCamera';
import { InputNumber } from '@components/InputNumber';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { CustomerHeaderDelivery } from '@components/CustomerHeaderDelivery';
import { type PhotoFile } from 'react-native-vision-camera';
import { api } from '@services/api';
import { type RouteCollectionItemsPhotosModel } from '@models/RouteCollectionItemsPhotosModel';
import { type RouteCollectionItemsModel } from '@models/RouteCollectionItemsModel';
import { addRouteCollectionItemsEdit } from '@store/slice/routeCollection/routeCollectionItemsEditSlice';
import { updateRouteCollectionEdit } from '@store/slice/routeCollection/routeCollectionEditSlice';
import { type ReceberParcialModel } from '@models/ReceberParcial';
import { type PaymentFormModel } from '@models/PaymentFormModel';
import { Working } from '@components/Working';
import { SelectPicker } from '@components/SelectPicker';
import { useAuth } from '@hooks/useAuth';
import { returnNumber } from '@utils/returnNumber';
import { type ReceberModel } from '@models/ReceberModel';
import { type IUpdateRouteCollectionItems } from '@dtos/IUpdateRouteItemsCollectionDTO';
import { Input } from '@components/Input';
import { ModalCollection } from '@components/ModalCollection';
import { loadReasonList } from '@/store/slice/reason/reasonListSlice';

const PaymentSchema = yup.object().shape({
  paymentFormId: yup.string().required('Campo obrigatório'),
  paymentAmount: yup.string().required('Campo obrigatório'),
  notes: yup.string().optional(),
});

interface DataFormModel {
  paymentFormId: string;
  paymentAmount: string;
  notes?: string;
}

export function ReceberFinalize() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const routeCollectionEdit = useAppSelector(
    state => state.routeCollectionEdit,
  );
  const routeCollectionItemsEdit = useAppSelector(
    state => state.routeCollectionItemsEdit,
  );
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isModalScheduleOpen, setIsModalScheduleOpen] = useState(false);
  const clientEdit = useAppSelector(state => state.clientEdit);
  const [working, setWorking] = useState(false);
  const [paymentForms, setPaymentForms] = useState<
    PaymentFormModel[] | undefined
  >(undefined);

  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues: {
      paymentFormId: '',
      paymentAmount: '',
      notes: '',
    },
  });

  function handleShowModalSchedule() {
    setIsModalScheduleOpen(true);
  }

  function handleCloseModal() {
    setIsTakingPhoto(false);
  }

  const handleSendTakedPhotoHouse = async (photoFile: PhotoFile) => {
    if (!photoFile) return;

    try {
      setWorking(true);

      const data = new FormData();

      let newUriImage = '';

      if (Platform.OS === 'android') {
        newUriImage = `file:///${photoFile.path}`;
      } else {
        newUriImage = photoFile.path;
      }

      const newFileName = `${routeCollectionItemsEdit.id}_${Date.now()}.jpg`;

      data.append(
        'photoFile',
        JSON.parse(
          JSON.stringify({
            type: 'image/jpeg',
            name: newFileName,
            uri: newUriImage,
          }),
        ),
      );
      data.append('deliveryItemsId', String(routeCollectionItemsEdit.id ?? ''));
      data.append('fileName', newFileName);

      const response = await api.post<RouteCollectionItemsPhotosModel>(
        '/routeCollectionItemsPhotos/upload',
        data,
        {
          params: {
            routeCollectionItemsId: routeCollectionItemsEdit.id,
            fileName: newFileName,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const updateCollectionItem: RouteCollectionItemsModel = {
        ...routeCollectionItemsEdit,
        RouteCollectionItemsPhotos: [
          ...(routeCollectionItemsEdit.RouteCollectionItemsPhotos ?? []),
          {
            id: response.data.id,
            fileName: newFileName,
            fileUrl: response.data.fileUrl,
            fileSize: response.data.fileSize ?? '', // Ensure fileSize is provided
            routeCollectionItemsId: routeCollectionItemsEdit.id,
          },
        ],
      };

      const routeCollectionItemsUpdated =
        routeCollectionEdit.RouteCollectionItems.map(item => {
          if (item.id === routeCollectionItemsEdit.id) {
            return updateCollectionItem;
          }
          return item;
        });

      dispatch(addRouteCollectionItemsEdit(updateCollectionItem));
      dispatch(
        updateRouteCollectionEdit({
          ...routeCollectionEdit,
          RouteCollectionItems: routeCollectionItemsUpdated,
        }),
      );
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsTakingPhoto(false);
      setWorking(false);
    }
  };

  const totalPayments = useMemo(() => {
    return routeCollectionItemsEdit.Receber?.ReceberParcial?.reduce(
      (acc, payment) => {
        return Number(acc) + Number(payment.valorRecebido);
      },
      0,
    );
  }, [routeCollectionItemsEdit.Receber?.ReceberParcial]);

  const handleAddPayment = async (typedData: DataFormModel) => {
    // verifica se o pagamento é maior que o valor da duplicata
    if (
      totalPayments + Number(typedData.paymentAmount) >
      routeCollectionItemsEdit.Receber?.valorDuplicata
    ) {
      alert(
        'O valor do pagamento não pode ser maior que o valor da duplicata.',
      );
    }

    if (typedData.paymentAmount === '') {
      alert('O valor do pagamento é obrigatório.');
      return;
    }

    if (typedData.paymentFormId === null) {
      alert('A forma de pagamento é obrigatória.');
      return;
    }

    try {
      setWorking(true);
      const newPayment: ReceberParcialModel = {
        receberId: routeCollectionItemsEdit.Receber.id,
        paymentFormId: typedData.paymentFormId,
        valorRecebido: returnNumber(typedData.paymentAmount),
        dataRecebimento: new Date(),
        observacao: '',
      };

      const responsse = await api.post<ReceberParcialModel>(
        '/receberParcial',
        newPayment,
      );

      const updatedReceberParcial = [
        ...(routeCollectionItemsEdit.Receber.ReceberParcial ?? []),
        responsse.data,
      ];

      const updatedReceber = {
        ...routeCollectionItemsEdit.Receber,
        ReceberParcial: updatedReceberParcial,
      };

      const updatedRouteCollectionItem: RouteCollectionItemsModel = {
        ...routeCollectionItemsEdit,
        Receber: updatedReceber,
      };

      const routeCollectionItemsUpdated =
        routeCollectionEdit.RouteCollectionItems.map(item => {
          if (item.id === routeCollectionItemsEdit.id) {
            return updatedRouteCollectionItem;
          }
          return item;
        });

      dispatch(addRouteCollectionItemsEdit(updatedRouteCollectionItem));
      dispatch(
        updateRouteCollectionEdit({
          ...routeCollectionEdit,
          RouteCollectionItems: routeCollectionItemsUpdated,
        }),
      );
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Erro ao adicionar pagamento. Tente novamente.');
    } finally {
      setWorking(false);
      setValue('paymentAmount', '');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await api.delete(`/routeCollectionItemsPhotos`, {
        params: {
          routeCollectionItemsPhotosId: photoId,
        },
      });

      const updatedPhotos =
        routeCollectionItemsEdit.RouteCollectionItemsPhotos?.filter(
          photo => photo.id !== photoId,
        );
      const updatedRouteCollectionItem: RouteCollectionItemsModel = {
        ...routeCollectionItemsEdit,
        RouteCollectionItemsPhotos: updatedPhotos,
      };

      const routeCollectionItemsUpdated =
        routeCollectionEdit.RouteCollectionItems.map(item => {
          if (item.id === routeCollectionItemsEdit.id) {
            return updatedRouteCollectionItem;
          }
          return item;
        });

      dispatch(addRouteCollectionItemsEdit(updatedRouteCollectionItem));
      dispatch(
        updateRouteCollectionEdit({
          ...routeCollectionEdit,
          RouteCollectionItems: routeCollectionItemsUpdated,
        }),
      );
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const saldo = useMemo(() => {
    const valorDuplicata =
      Number(routeCollectionItemsEdit.Receber.valorDuplicata) || 0;
    const totalRecebido = Number(totalPayments) || 0;
    const saldoCents =
      Math.round(valorDuplicata * 100) - Math.round(totalRecebido * 100);
    return saldoCents / 100;
  }, [routeCollectionItemsEdit.Receber.valorDuplicata, totalPayments]);

  const handleImportValueFromOrder = () => {
    const value = saldo.toFixed(2).replace('.', ',');
    setValue('paymentAmount', value);
  };

  useEffect(() => {
    const fetchPaumentForms = async () => {
      try {
        setWorking(true);
        const response = await api.get('/paymentForm', {
          params: {
            customerId: user?.user.customerId,
          },
        });
        const paymentForms = response.data;
        setPaymentForms(paymentForms);
      } catch (error) {
        console.error('Error fetching payment forms:', error);
      } finally {
        setWorking(false);
      }
    };
    fetchPaumentForms();
  }, [clientEdit.id, routeCollectionItemsEdit, user?.user.customerId]);

  useEffect(() => {
    const fetchReasonList = async () => {
      try {
        setWorking(true);
        const response = await api.get('/reason/list-by-customerId', {
          params: {
            customerId: user?.user.customerId,
          },
        });
        const reasons = response.data;
        dispatch(loadReasonList(reasons));
      } catch (error) {
        console.error('Error fetching reasons:', error);
      } finally {
        setWorking(false);
      }
    };
    fetchReasonList();
  }, [dispatch, user?.user.customerId]);

  const getStatus = () => {
    // verificar se houve alguma pagamento na visita hoje
    const today = new Date();
    const hasPaymentToday =
      routeCollectionItemsEdit.Receber.ReceberParcial?.some(payment => {
        const paymentDate = new Date(payment.dataRecebimento);
        return (
          paymentDate.getDate() === today.getDate() &&
          paymentDate.getMonth() === today.getMonth() &&
          paymentDate.getFullYear() === today.getFullYear()
        );
      });
    if (hasPaymentToday) {
      return 'visited_received';
    } else {
      return 'visited';
    }
  };

  const handleRouteCollectionItemsFinish = async () => {
    let receberUpdated: ReceberModel = {
      ...routeCollectionItemsEdit.Receber,
    };
    const isFullyPaid = Math.round(saldo * 100) === 0;
    if (isFullyPaid) {
      receberUpdated = {
        ...receberUpdated,
        recebimento: new Date(),
        valorRecebido: totalPayments,
        status: 'R',
      };

      try {
        setWorking(true);

        await api.patch<ReceberModel>('/receber/status', {
          receberId: receberUpdated.id,
          recebimento: receberUpdated.recebimento,
          valorRecebido: receberUpdated.valorRecebido,
          status: receberUpdated.status,
        });
      } catch (error) {
        console.error('Error updating Receber:', error);
        alert('Erro ao finalizar cobrança. Tente novamente.');
        return;
      } finally {
        setWorking(false);
      }
    }

    const updatedRouteCollectionItem: RouteCollectionItemsModel = {
      ...routeCollectionItemsEdit,
      Receber: receberUpdated,
      status: getStatus(),
      notes: getValues('notes') ?? '',
    };
    try {
      const updateDataItem: IUpdateRouteCollectionItems = {
        id: routeCollectionItemsEdit.id,
        routeCollectionId: routeCollectionItemsEdit.routeCollectionId,
        customerId: routeCollectionItemsEdit.customerId,
        clientId: routeCollectionItemsEdit.clientId,
        clientCode: routeCollectionItemsEdit.clientCode,
        receberId: routeCollectionItemsEdit.receberId,
        orderId: routeCollectionItemsEdit.orderId,
        orderNumber: routeCollectionItemsEdit.orderNumber,
        orderDate: routeCollectionItemsEdit.orderDate,
        invoiceId: routeCollectionItemsEdit.invoiceId,
        notes: getValues('notes') ?? '',
        status: getStatus(),
        nfeNumber: routeCollectionItemsEdit.nfeNumber,
        nfeUrl: routeCollectionItemsEdit.nfeUrl,
        latitude: Number(routeCollectionItemsEdit.latitude),
        longitude: Number(routeCollectionItemsEdit.longitude),
        visitOrder: routeCollectionItemsEdit.visitOrder,
        checkInDate: routeCollectionItemsEdit.checkInDate,
        checkOutDate: new Date(), // Set the current date as check-out date
      };

      setWorking(true);
      await api.patch<RouteCollectionItemsModel>(
        '/routeCollectionItems',
        updateDataItem,
      );
    } catch (error) {
      console.error('Error updating RouteCollectionItems:', error);
      alert('Erro ao finalizar cobrança. Tente novamente.');
      return;
    } finally {
      setWorking(false);
    }

    const routeCollectionItemsUpdated =
      routeCollectionEdit.RouteCollectionItems.map(item => {
        if (item.id === routeCollectionItemsEdit.id) {
          return updatedRouteCollectionItem;
        }
        return item;
      });

    dispatch(addRouteCollectionItemsEdit(updatedRouteCollectionItem));
    dispatch(
      updateRouteCollectionEdit({
        ...routeCollectionEdit,
        RouteCollectionItems: routeCollectionItemsUpdated,
      }),
    );
    navigation.navigate('ReceberDrive');
  };

  return (
    <>
      {working && <Working visible={working} />}
      <VStack className="flex-1 relative">
        {isTakingPhoto && (
          <ModalCamera // captura foto da casa
            isVisible={isTakingPhoto}
            closeModal={handleCloseModal}
            updateUrlImage={handleSendTakedPhotoHouse}
          />
        )}
        {isModalScheduleOpen && (
          <ModalCollection
            visible={isModalScheduleOpen}
            handleCloseModal={() => {
              setIsModalScheduleOpen(false);
            }}
          />
        )}
        <CustomerHeaderDelivery data={clientEdit} showBackButton={false} />
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <VStack className="p-2 mb-48">
            <Heading
              size="sm"
              className="text-typography-700 w-full text-center"
            >
              Cobrança
            </Heading>
            <HStack className="w-full justify-between items-start mt-4">
              <VStack className="flex justify-center gap-2 mt-2">
                <Link
                  href={
                    routeCollectionItemsEdit.Receber.notaFiscalFileUrl ?? ''
                  }
                >
                  <LinkText size="lg">{`Nota fiscal: ${routeCollectionItemsEdit.Receber.notaFiscal?.padStart(
                    6,
                    '0',
                  )}`}</LinkText>
                </Link>
                <Link
                  href={routeCollectionItemsEdit.Receber.boletoFileUrl ?? ''}
                >
                  <LinkText size="lg">{`Boleto: ${routeCollectionItemsEdit.Receber.nossoNumero}`}</LinkText>
                </Link>
              </VStack>
              <VStack className="w-32 justify-end items-end mt-2  bg-background-200 opacity-90 rounded-md p-2">
                <Text size="sm" className="text-error-400 font-bold">
                  {Number(
                    routeCollectionItemsEdit.Receber.valorDuplicata,
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
                <Text size="sm" className="text-success-400 font-bold">
                  {Number(totalPayments).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
                <Text size="sm" className="text-tertiary-400 font-bold">
                  {Number(saldo).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </VStack>
            </HStack>

            <Center className="w-full h-24 bg-background-200 rounded-md mb-2 p-2 mt-2">
              <Button
                variant="outline"
                className="flex-1 items-center justify-center w-full h-full border-dashed border-2 border-tertiary-400 rounded-md"
                onPress={() => {
                  setIsTakingPhoto(true);
                }}
              >
                <VStack className="justify-center items-center">
                  <HStack className="justify-center items-center gap-2">
                    <ButtonIcon
                      as={Camera}
                      size="xl"
                      className="text-tertiary-400"
                    />

                    <Text className="text-tertiary-400">Adicionar foto</Text>
                  </HStack>
                  <Text size="xs" className="text-tertiary-400">
                    Preferencialmente horizontal
                  </Text>
                </VStack>
              </Button>
            </Center>
            <VStack className="mb-2">
              <Heading size="sm" className="text-typography-700 mb-2">
                Observações
              </Heading>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value ?? ''}
                    onChangeText={onChange}
                    placeholder="Digite uma observação"
                    autoCapitalize="none"
                    returnKeyType="done"
                  />
                )}
              />
            </VStack>
            <VStack className="mb-2">
              <Heading size="sm" className="text-typography-700 mb-2">
                Forma de pagamento
              </Heading>
              <Controller
                control={control}
                name="paymentFormId"
                render={({ field: { onChange, value } }) => (
                  <SelectPicker
                    value={value ?? ''}
                    onValueChange={onChange}
                    selectOptions={
                      paymentForms
                        ? paymentForms.map(paymentForm => ({
                            label: paymentForm.paymentForm,
                            value: paymentForm.id,
                          }))
                        : []
                    }
                  />
                )}
              />
            </VStack>

            <HStack className="w-full justify-between items-end gap-2">
              <VStack className="w-full flex-1">
                <Heading size="md" className="text-typography-700">
                  Valor do pagamento
                </Heading>
                <Controller
                  name="paymentAmount"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <InputNumber
                      placeholder="0,00"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </VStack>
              <Button
                onPress={handleImportValueFromOrder}
                className="w-12 h-12 rounded-md bg-info-400  active:bg-info-500"
              >
                <ButtonIcon
                  as={CornerDownLeft}
                  size="xl"
                  className="text-typography-700"
                />
              </Button>
              <Button
                size="lg"
                onPress={handleSubmit(handleAddPayment)}
                className="rounded-md w-12 h-12 bg-success-400  active:bg-success-500 gap-1"
              >
                <ButtonIcon
                  as={Plus}
                  size="xl"
                  className="text-typography-700"
                />
              </Button>
            </HStack>
            <Heading size="md" className="text-typography-700 mt-2">
              Pagamentos
            </Heading>
            {routeCollectionItemsEdit.Receber.ReceberParcial &&
              routeCollectionItemsEdit.Receber.ReceberParcial.length > 0 && (
                <VStack className="w-[100%] bg-green-700 p-2 rounded-md justify-center items-center mb-2">
                  {routeCollectionItemsEdit.Receber.ReceberParcial.map(
                    payment => (
                      <HStack
                        key={payment.id}
                        className="justify-between w-[100%] p-2 items-center gap-2"
                      >
                        <Text className="text-typography-700 w-[50%]">
                          {new Date(payment.dataRecebimento).toLocaleDateString(
                            'pt-BR',
                          )}
                        </Text>
                        <Text className="text-typography-700 w-[50%] text-right">
                          {Number(payment.valorRecebido).toLocaleString(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            },
                          )}
                        </Text>
                      </HStack>
                    ),
                  )}
                </VStack>
              )}
            {routeCollectionItemsEdit.Receber.ReceberParcial &&
              routeCollectionItemsEdit.Receber.ReceberParcial.length === 0 && (
                <Center className="w-full h-24 bg-trueGray-700 rounded-md">
                  <Text className="text-typography-700">
                    Nenhum pagamento realizado
                  </Text>
                </Center>
              )}
            <Center>
              <Heading size="md" className="text-typography-700">
                Lista de fotos
              </Heading>
              {routeCollectionItemsEdit.RouteCollectionItemsPhotos &&
              routeCollectionItemsEdit.RouteCollectionItemsPhotos?.length >
                0 ? (
                routeCollectionItemsEdit.RouteCollectionItemsPhotos.map(
                  photo => (
                    <HStack
                      // height="$48"
                      key={photo.id}
                      className="w-full bg-background-200 p-2 rounded-md mb-2 justify-between relative"
                    >
                      <Image
                        size="full"
                        resizeMode="contain"
                        source={{
                          uri: photo.fileUrl,
                        }}
                        alt="image"
                        className="w-full h-[200px]"
                      />
                      <Button
                        onPress={() => {
                          // Handle delete photo logic here
                          handleDeletePhoto(photo.id);
                        }}
                        aria-label="Delete photo"
                        className="absolute top-2 right-2 opacity-80 bg-error-400  active:bg-error-500"
                      >
                        <ButtonIcon
                          as={Trash}
                          size="xl"
                          className="text-typography-700"
                        />
                      </Button>
                    </HStack>
                  ),
                )
              ) : (
                <Text size="xs" className="text-typography-700">
                  Nenhuma foto adicionada.
                </Text>
              )}
            </Center>
          </VStack>
        </ScrollView>
        <HStack className="justify-between bottom-0 left-0 bg-background-200 w-[100%] h-24 p-2">
          <Button
            size="lg"
            onPress={() => {
              navigation.goBack();
            }}
            className="rounded-md w-32 h-12 bg-info-400  active:bg-info-500 gap-1"
          >
            <ButtonIcon
              as={ChevronLeft}
              size="xl"
              className="text-typography-700"
            />
            <Text size="xs" className="text-typography-700">
              Voltar
            </Text>
          </Button>
          <Button
            size="lg"
            onPress={handleShowModalSchedule}
            className="rounded-md w-32 h-12 bg-error-400  active:bg-error-500 gap-1"
          >
            <ButtonIcon
              as={CalendarClock}
              size="xl"
              className="text-typography-700"
            />

            <Text size="xs" className="text-typography-700">
              Reagendar
            </Text>
          </Button>
          <Button
            size="lg"
            onPress={handleRouteCollectionItemsFinish}
            className="rounded-md w-32 h-12 bg-success-400  active:bg-success-500 gap-1"
          >
            <ButtonIcon
              as={CheckCheck}
              size="xl"
              className="text-typography-700"
            />
            <Text size="xs" className="text-typography-700">
              Finalizar
            </Text>
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
