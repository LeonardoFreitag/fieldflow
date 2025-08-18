import {
  Button,
  ButtonIcon,
  Heading,
  VStack,
  HStack,
  Text,
  Link,
  LinkText,
  Center,
  Image,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import {
  CalendarClock,
  CheckCheck,
  ChevronLeft,
  CornerDownLeft,
  Plus,
} from 'lucide-react-native';
import { useAppSelector } from '../store/store';
import React, { useEffect, useMemo, useState } from 'react';
import { Camera, Trash } from 'phosphor-react-native';
import { Platform, ScrollView, TouchableOpacity } from 'react-native';
import { ModalCamera } from '@components/ModalCamera';
import { InputNumber } from '@components/InputNumber';
import { ModalSchendule } from '@components/ModalSchendule';
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
import { TextArea } from '@components/TextArea';
import { ModalCollection } from '@components/ModalCollection';

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
    const valorDuplicata = routeCollectionItemsEdit.Receber.valorDuplicata;
    const totalRecebido = totalPayments || 0;
    return valorDuplicata - totalRecebido;
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
    if (saldo === 0) {
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
      <VStack
        width="$32"
        justifyContent="flex-end"
        alignItems="flex-end"
        mt="$2"
        position="absolute"
        right="$2"
        top="$32"
        zIndex={9999}
        backgroundColor="$trueGray600"
        opacity={0.8}
        rounded="$md"
        p="$2"
      >
        <Text size="sm" color="$red300" fontWeight={'bold'}>
          {Number(
            routeCollectionItemsEdit.Receber.valorDuplicata,
          ).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
        <Text size="sm" color="$green300" fontWeight={'bold'}>
          {Number(totalPayments).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
        <Text size="sm" color="$orange300" fontWeight={'bold'}>
          {Number(saldo).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Text>
      </VStack>
      {working && <Working visible={working} />}
      <VStack flex={1}>
        <ModalCamera // captura foto da casa
          isVisible={isTakingPhoto}
          closeModal={handleCloseModal}
          updateUrlImage={handleSendTakedPhotoHouse}
        />
        <ModalCollection
          visible={isModalScheduleOpen}
          handleCloseModal={() => {
            setIsModalScheduleOpen(false);
          }}
        />
        <CustomerHeaderDelivery data={clientEdit} showBackButton={false} />
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <VStack p="$2" mb="$48">
            <Heading size="sm" color="$trueGray100">
              Cobrança
            </Heading>

            <HStack width="$full" justifyContent="space-between">
              <Link
                href={routeCollectionItemsEdit.Receber.notaFiscalFileUrl ?? ''}
              >
                <LinkText size="lg">{`Nota fiscal: ${routeCollectionItemsEdit.Receber.notaFiscal?.padStart(
                  6,
                  '0',
                )}`}</LinkText>
              </Link>
              <Link href={routeCollectionItemsEdit.Receber.boletoFileUrl ?? ''}>
                <LinkText size="lg">{`Boleto: ${routeCollectionItemsEdit.Receber.nossoNumero}`}</LinkText>
              </Link>
            </HStack>

            <Center
              w="$full"
              h="$24"
              bg="$trueGray700"
              rounded="$md"
              mb="$2"
              p="$2"
              mt="$2"
            >
              <Center
                w="$full"
                h="$full"
                borderStyle="dashed"
                borderColor="$trueGray400"
                borderWidth="$1"
                rounded="$md"
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setIsTakingPhoto(true);
                  }}
                >
                  <ButtonIcon as={Camera} size="xl" color="$amber400" />

                  <Text color="$amber400">Adicionar foto</Text>
                  <Text color="$amber400" size="xs">
                    Preferencialmente horizontal
                  </Text>
                </TouchableOpacity>
              </Center>
            </Center>
            <VStack mb="$2">
              <Heading size="sm" color="$trueGray100" mb="$2">
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
            <VStack mb="$2">
              <Heading size="sm" color="$trueGray100" mb="$2">
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

            <HStack
              width="$full"
              justifyContent="space-between"
              alignItems="flex-end"
              gap="$2"
            >
              <VStack w="$full" flex={1}>
                <Heading size="md" color="$trueGray100">
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
                width="$12"
                height="$12"
                rounded="$md"
                backgroundColor="$blue500"
                $active-bg="$blue700"
                onPress={handleImportValueFromOrder}
              >
                <ButtonIcon as={CornerDownLeft} size="xl" />
              </Button>
              <Button
                size="lg"
                rounded="$md"
                w="$12"
                h="$12"
                backgroundColor="$green700"
                $active-bg="$green500"
                gap="$1"
                onPress={handleSubmit(handleAddPayment)}
              >
                <ButtonIcon as={Plus} size="xl" />
              </Button>
            </HStack>
            <Heading size="md" color="$trueGray100" mt="$2">
              Pagamentos
            </Heading>
            {routeCollectionItemsEdit.Receber.ReceberParcial &&
              routeCollectionItemsEdit.Receber.ReceberParcial.length > 0 && (
                <VStack
                  w="100%"
                  backgroundColor="$green700"
                  p="$2"
                  rounded="$md"
                  justifyContent="center"
                  alignItems="center"
                  mb="$2"
                >
                  {routeCollectionItemsEdit.Receber.ReceberParcial.map(
                    payment => (
                      <HStack
                        key={payment.id}
                        justifyContent="space-between"
                        w="100%"
                        // mt="$2"
                        // mb="$2"
                        p="$2"
                        alignItems="center"
                        gap="$2"
                      >
                        <Text color="$trueGray100" w="50%">
                          {new Date(payment.dataRecebimento).toLocaleDateString(
                            'pt-BR',
                          )}
                        </Text>
                        <Text color="$trueGray100" w="50%" textAlign="right">
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
                <Center w="$full" h="$24" bg="$trueGray700" rounded="$md">
                  <Text color="$trueGray100">Nenhum pagamento realizado</Text>
                </Center>
              )}
            <Center>
              <Heading size="md" color="$trueGray100">
                Lista de fotos
              </Heading>
              {routeCollectionItemsEdit.RouteCollectionItemsPhotos &&
              routeCollectionItemsEdit.RouteCollectionItemsPhotos?.length >
                0 ? (
                routeCollectionItemsEdit.RouteCollectionItemsPhotos.map(
                  photo => (
                    <HStack
                      width="$full"
                      // height="$48"
                      key={photo.id}
                      bg="$trueGray700"
                      p="$2"
                      rounded="$md"
                      mb="$2"
                      justifyContent="space-between"
                      position="relative"
                    >
                      <Image
                        size="full"
                        w={'$full'}
                        h={200}
                        resizeMode="contain"
                        source={{
                          uri: photo.fileUrl,
                        }}
                        alt="image"
                      />
                      <Button
                        position="absolute"
                        top="$2"
                        right="$2"
                        // rounded="$full"
                        opacity={0.4}
                        backgroundColor="$red800"
                        $active-bg="$red600"
                        onPress={() => {
                          // Handle delete photo logic here
                          handleDeletePhoto(photo.id);
                        }}
                        aria-label="Delete photo"
                      >
                        <ButtonIcon as={Trash} size="xl" color="$trueGray300" />
                      </Button>
                    </HStack>
                  ),
                )
              ) : (
                <Text color="$trueGray400" size="xs">
                  Nenhuma foto adicionada.
                </Text>
              )}
            </Center>
          </VStack>
        </ScrollView>
        <HStack
          justifyContent="space-between"
          position="absolute"
          bottom="$0"
          left="$0"
          backgroundColor="$trueGray900"
          width="100%"
          height="$24"
          padding="$2"
        >
          <Button
            size="lg"
            rounded="$md"
            w="$24"
            h="$12"
            backgroundColor="$blue500"
            $active-bg="$blue700"
            onPress={() => {
              navigation.goBack();
            }}
            gap="$1"
          >
            <ButtonIcon as={ChevronLeft} size="xl" />
            <Text color="$trueGray100" size="xs">
              Voltar
            </Text>
          </Button>
          <Button
            size="lg"
            rounded="$md"
            w="$32"
            h="$12"
            backgroundColor="$red500"
            $active-bg="$red700"
            onPress={handleShowModalSchedule}
            gap="$1"
          >
            <ButtonIcon as={CalendarClock} size="xl" />

            <Text color="$trueGray100" size="xs">
              Reagendar
            </Text>
          </Button>
          <Button
            size="lg"
            rounded="$md"
            w="$24"
            h="$12"
            backgroundColor="$green700"
            $active-bg="$green500"
            onPress={handleRouteCollectionItemsFinish}
            gap="$1"
          >
            <ButtonIcon as={CheckCheck} size="lg" />
            <Text color="$trueGray100" size="xs">
              Finalizar
            </Text>
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
