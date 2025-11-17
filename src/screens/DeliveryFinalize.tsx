import { Image } from '@ui/image';
import { Center } from '@ui/center';
import { Link, LinkText } from '@ui/link';
import { Text } from '@ui/text';
import { HStack } from '@ui/hstack';
import { VStack } from '@ui/vstack';
import { Heading } from '@ui/heading';
import { Button, ButtonIcon, ButtonText } from '@ui/button';
import { useNavigation } from '@react-navigation/native';
import {
  CalendarClock,
  Camera,
  CheckCheck,
  ChevronLeft,
  Signature,
  Trash,
} from 'lucide-react-native';
import { useAppSelector } from '../store/store';
import React, { useState } from 'react';
// import { Camera, Signature, Trash } from 'phosphor-react-native';
import { Alert, Platform, ScrollView } from 'react-native';
import { Input } from '@components/Input';
import { SignatureModal } from '@components/SignatureModal';
import { ModalCamera } from '@components/ModalCamera';
import { ModalReschenduleDelivery } from '@components/ModalReschenduleDelivery';
import { CustomerHeaderDelivery } from '@components/CustomerHeaderDelivery';
import { api } from '@services/api';
import { type PhotoFile } from 'react-native-vision-camera';
import {
  addDeliveryItemEdit,
  updateDeliveryItemEdit,
} from '@store/slice/deliveryRoute/deliveryItemEditSlice';
import { useDispatch } from 'react-redux';
import { type DeliveryItemModel } from '@models/DeliveryItemModel';
import { type DeliveryItemPhotoModel } from '@models/DeliveryItemPhotoModel';
import { updateDeliveryRouteEdit } from '@store/slice/deliveryRoute/deliveryRouteEditSlice';
import { updateDeliveryQueueList } from '@store/slice/deliveryQueue/deliveryQueueListSlice';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Working } from '@components/Working';

const DeliveryFinalizeSchema = yup.object().shape({
  cnpj_f: yup
    .string()
    .required('CNPJ/CPF é obrigatório')
    .matches(/^\d{11}|\d{14}$/, 'CNPJ/CPF inválido'),
});

interface DeliverFinalizeForm {
  cnpj_f: string;
}

export function DeliveryFinalize() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const deliveryRouteEdit = useAppSelector(state => state.deliveryRouteEdit);
  const deliveryItemEdit = useAppSelector(state => state.deliveryItemEdit);
  const clientEdit = useAppSelector(state => state.clientEdit);

  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isModalScheduleOpen, setIsModalScheduleOpen] = useState(false);
  const [working, setWorking] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(DeliveryFinalizeSchema),
    defaultValues: {
      cnpj_f: '',
    },
  });

  const handleDeliveryFinish = async (data: DeliverFinalizeForm) => {
    try {
      setWorking(true);
      if (!deliveryItemEdit.signatureBase64) {
        Alert.alert(
          'Assinatura obrigatória',
          'Por favor, colete a assinatura do cliente antes de finalizar a entrega.',
          [{ text: 'OK' }],
        );
        return;
      }

      if (
        !Array.isArray(deliveryItemEdit.DeliveryItemsPhotos) ||
        deliveryItemEdit.DeliveryItemsPhotos.length < 1
      ) {
        Alert.alert(
          'Fotos insuficientes',
          'Por favor, adicione pelo menos 3 fotos do produto antes de finalizar a entrega.',
          [{ text: 'OK' }],
        );
        return;
      }

      const updatedDeliveryItem = {
        deliveryItemId: deliveryItemEdit.id,
        status: 'delivered',
        deliveryOrder: String(deliveryItemEdit.deliveryOrder) ?? '-',
        deliveryDate: new Date(),
        cnpj_f: data.cnpj_f,
      };

      await api.patch<DeliveryItemModel>(
        `/deliveryItems/set-delivered`,
        updatedDeliveryItem,
      );

      dispatch(
        updateDeliveryItemEdit({
          ...deliveryItemEdit,
          status: 'delivered',
          deliveryOrder: Number(updatedDeliveryItem.deliveryOrder),
          deliveryDate: updatedDeliveryItem.deliveryDate,
        }),
      );

      const updatedDeliveryItems = deliveryRouteEdit.DeliveryItems.map(item => {
        if (item.id === deliveryItemEdit.id) {
          return {
            ...item,
            status: 'delivered',
            deliveryOrder: Number(updatedDeliveryItem.deliveryOrder),
            deliveryDate: updatedDeliveryItem.deliveryDate,
          };
        }
        return item;
      });

      dispatch(
        updateDeliveryRouteEdit({
          ...deliveryRouteEdit,
          DeliveryItems: updatedDeliveryItems,
        }),
      );

      try {
        const responseQueue = await api.patch('/deliveryQueue/status', {
          orderId: deliveryItemEdit.orderId,
          status: 'delivered',
        });

        if (responseQueue.status !== 200) {
          Alert.alert(
            'Erro',
            'Não foi possível atualizar o status da fila de entregas.',
            [{ text: 'OK' }],
          );
          return;
        }

        dispatch(updateDeliveryQueueList(responseQueue.data));

        navigation.navigate('DeliveryDrive');
      } catch (error) {
        Alert.alert(
          'Erro',
          'Não foi possível atualizar o status da fila de entregas.',
          [{ text: 'OK' }],
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível atualizar o status da entrega. Tente novamente.',
        [{ text: 'OK' }],
      );
    } finally {
      setWorking(false);
    }
  };

  function handleShowSignature() {
    setSignatureModalOpen(true);
  }

  const handleSignatureOK = async (signature: string) => {
    try {
      setWorking(true);
      const dataSignature = {
        deliveryItemId: deliveryItemEdit.id,
        signature,
      };

      const response = await api.patch<DeliveryItemModel>(
        `/deliveryItems/signature`,
        dataSignature,
      );

      const updatedDeliveryItem: DeliveryItemModel = {
        ...deliveryItemEdit,
        signatureBase64: response.data.signatureBase64,
      };

      const deliveryItemsUpdated = deliveryRouteEdit.DeliveryItems.map(item => {
        if (item.id === deliveryItemEdit.id) {
          return updatedDeliveryItem;
        }
        return item;
      });

      dispatch(addDeliveryItemEdit(updatedDeliveryItem));

      dispatch(
        updateDeliveryRouteEdit({
          ...deliveryRouteEdit,
          DeliveryItems: deliveryItemsUpdated,
        }),
      );

      setSignatureModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar a assinatura. Tente novamente.',
        [{ text: 'OK' }],
      );
    } finally {
      setWorking(false);
    }
  };

  function handleSignatureClose() {
    setSignatureModalOpen(false);
  }

  function handleShowModalSchedule() {
    setIsModalScheduleOpen(true);
  }

  async function handleSendTakedPhotoProduct(photoFile: PhotoFile) {
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

      const newFileName = `${deliveryItemEdit.id}_${Date.now()}.jpg`;

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
      data.append('deliveryItemsId', String(deliveryItemEdit.id ?? ''));
      data.append('fileName', newFileName);

      const response = await api.post<DeliveryItemPhotoModel>(
        '/deliveryItemsPhotos/upload',
        data,
        {
          params: {
            deliveryItemsId: deliveryItemEdit.id,
            fileName: newFileName,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const deliveryItemUpdated: DeliveryItemModel = {
        ...deliveryItemEdit,
        DeliveryItemsPhotos: [
          ...(deliveryItemEdit.DeliveryItemsPhotos ?? []),
          {
            id: response.data.id,
            fileName: newFileName,
            fileUrl: response.data.fileUrl,
            fileSize: response.data.fileSize ?? '', // Ensure fileSize is provided
            deliveryItemsId: deliveryItemEdit.id,
          },
        ],
      };

      const deliveryItemsUpdated = deliveryRouteEdit.DeliveryItems.map(item => {
        if (item.id === deliveryItemEdit.id) {
          return deliveryItemUpdated;
        }
        return item;
      });

      dispatch(addDeliveryItemEdit(deliveryItemUpdated));
      dispatch(
        updateDeliveryRouteEdit({
          ...deliveryRouteEdit,
          DeliveryItems: deliveryItemsUpdated,
        }),
      );
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsTakingPhoto(false);
      setWorking(false);
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await api.delete(`/deliveryItemsPhotos`, {
        params: {
          deliveryItemsPhotosId: photoId,
        },
      });

      const updatedPhotos = deliveryItemEdit.DeliveryItemsPhotos?.filter(
        photo => photo.id !== photoId,
      );
      const updatedDeliveryItem: DeliveryItemModel = {
        ...deliveryItemEdit,
        DeliveryItemsPhotos: updatedPhotos,
      };

      const deliveryItemsUpdated = deliveryRouteEdit.DeliveryItems.map(item => {
        if (item.id === deliveryItemEdit.id) {
          return updatedDeliveryItem;
        }
        return item;
      });

      dispatch(addDeliveryItemEdit(updatedDeliveryItem));
      dispatch(
        updateDeliveryRouteEdit({
          ...deliveryRouteEdit,
          DeliveryItems: deliveryItemsUpdated,
        }),
      );
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  // const handlePrintCanhoto = () => {
  //   // Implement print canhoto logic here
  //   Alert.alert(
  //     'Imprimir Canhoto',
  //     'Funcionalidade de impressão ainda não implementada.',
  //   );
  // };

  // const handlePrintBoleto = () => {
  //   // Implement print boleto logic here
  //   Alert.alert(
  //     'Imprimir Boleto',
  //     'Funcionalidade de impressão ainda não implementada.',
  //   );
  // };

  return (
    <>
      {working && <Working visible={working} />}
      <VStack className="flex-1">
        <SignatureModal
          isOpen={signatureModalOpen}
          onClose={handleSignatureClose}
          onOK={handleSignatureOK}
        />
        <ModalCamera // captura foto dos produtos
          isVisible={isTakingPhoto}
          closeModal={() => {
            setIsTakingPhoto(false);
          }}
          updateUrlImage={handleSendTakedPhotoProduct}
        />
        <ModalReschenduleDelivery
          visible={isModalScheduleOpen}
          handleCloseModal={() => {
            setIsModalScheduleOpen(false);
          }}
        />
        <CustomerHeaderDelivery data={clientEdit} showBackButton={false} />
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <VStack className="p-2 mb-48">
            <Heading
              size="lg"
              className="text-typography-700 w-full mb-2 text-center"
            >
              Finalizar Entrega
            </Heading>
            <HStack className="w-full justify-between">
              <Link href={deliveryItemEdit.nfeUrl}>
                <LinkText size="md">{`Nota fiscal: ${deliveryItemEdit.nfeNumber}`}</LinkText>
              </Link>
              <Link href={deliveryItemEdit.orderUrl}>
                <LinkText size="md">{`Pedido: ${deliveryItemEdit.orderNumber}`}</LinkText>
              </Link>
            </HStack>
            <Center className="w-full h-24 bg-background-200 rounded-md mb-2 p-2 mt-2">
              <Button
                variant="outline"
                className="flex-1 items-center justify-center w-full h-full border-dashed border-2 border-tertiary-400 rounded-md"
                onPress={() => {
                  setIsTakingPhoto(true);
                }}
              >
                <ButtonIcon
                  as={Camera}
                  size="xl"
                  className="text-tertiary-400"
                />

                <Text className="text-tertiary-400">Adicionar foto</Text>
              </Button>
            </Center>
            <Heading size="md" className="text-typography-700">
              CPF/CNPJ
            </Heading>
            <Controller
              control={control}
              name="cnpj_f"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="CPF/CNPJ"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.cnpj_f && (
              <Text size="xs" className="text-error-400 mb-2">
                {errors.cnpj_f.message}
              </Text>
            )}
            <Center className="w-full h-48 bg-background-200 rounded-md mb-2 p-2 mt-2">
              {!deliveryItemEdit.signatureBase64 ? (
                <Button
                  className="flex-1 items-center justify-center w-full h-full border-dashed border-2 border-tertiary-400 rounded-md"
                  variant="outline"
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={handleShowSignature}
                >
                  <ButtonIcon
                    as={Signature}
                    size="xl"
                    className="text-tertiary-400"
                  />

                  <Text className="text-tertiary-400">Coletar assinatura</Text>
                </Button>
              ) : (
                <Center className="w-full h-full">
                  <Image
                    source={{ uri: deliveryItemEdit.signatureBase64 }}
                    // style={{ width: '100%', height: '100%' }}
                    size="2xl"
                    resizeMode="contain"
                    alt="Assinatura"
                  />
                </Center>
              )}
            </Center>
            <Center>
              <Heading size="md" className="text-typography-700">
                Lista de fotos
              </Heading>
              {deliveryItemEdit.DeliveryItemsPhotos &&
              deliveryItemEdit.DeliveryItemsPhotos?.length > 0 ? (
                deliveryItemEdit.DeliveryItemsPhotos.map(photo => (
                  <HStack
                    // height="$48"
                    key={photo.id}
                    className="w-full p-2 rounded-md mb-2 justify-between relative border border-background-400"
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
                      className="absolute top-2 right-2 bg-error-400  active:bg-error-500"
                    >
                      <ButtonIcon
                        as={Trash}
                        size="xl"
                        className="text-typography-900"
                      />
                    </Button>
                  </HStack>
                ))
              ) : (
                <Text size="xs" className="text-typography-700 mt-20">
                  Nenhuma foto adicionada.
                </Text>
              )}
            </Center>
          </VStack>
        </ScrollView>
        <HStack className="justify-between absolute bottom-0 left-0 bg-background-200 w-[100%] h-24 p-2">
          <Button
            onPress={() => {
              navigation.goBack();
            }}
            className="rounded-md w-32 h-12 bg-info-400  active:bg-info-600 gap-1"
          >
            <ButtonIcon as={ChevronLeft} className="text-typography-700" />
            <ButtonText size="xs" className="text-typography-700">
              Voltar
            </ButtonText>
          </Button>
          <Button
            // size="lg"
            onPress={handleShowModalSchedule}
            className="rounded-md w-32 h-12 bg-error-500  active:bg-error-700 gap-1"
          >
            <ButtonIcon as={CalendarClock} className="text-typography-700" />

            <ButtonText size="xs" className="text-typography-700">
              Não entregue
            </ButtonText>
          </Button>
          <Button
            // size="lg"
            onPress={handleSubmit(handleDeliveryFinish)}
            className="rounded-md w-32 h-12 bg-green-700  active:bg-green-500 gap-1"
          >
            <ButtonIcon as={CheckCheck} className="text-typography-700" />
            <ButtonText size="xs" className="text-typography-700">
              Finalizar
            </ButtonText>
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
