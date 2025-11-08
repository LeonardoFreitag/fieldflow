import { Image } from "@/components/ui/image";
import { Center } from "@/components/ui/center";
import { Link, LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonIcon } from "@/components/ui/button";
import { useNavigation } from '@react-navigation/native';
import { CalendarClock, CheckCheck, ChevronLeft } from 'lucide-react-native';
import { useAppSelector } from '../store/store';
import React, { useState } from 'react';
import { Camera, Printer, Signature, Trash } from 'phosphor-react-native';
import { Alert, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '@components/Input';
import { SignatureModal } from '@components/SignatureModal';
import { ModalCamera } from '@components/ModalCamera';
import { ModalSchendule } from '@components/ModalSchendule';
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
        <ModalSchendule
          visible={isModalScheduleOpen}
          handleCloseModal={() => {
            setIsModalScheduleOpen(false);
          }}
        />
        <CustomerHeaderDelivery data={clientEdit} showBackButton={false} />
        {/* <HStack gap="$4" justifyContent="center" alignItems="center" mt="$4">
          <Button
            backgroundColor="$blue700"
            $active-bg="$blue900"
            onPress={handlePrintCanhoto}
            gap="$2"
          >
            <ButtonIcon as={Printer} size="md" color="$white" />
            <Text color="$white">Imprimir Canhoto</Text>
          </Button>
          <Button
            backgroundColor="$green700"
            $active-bg="$green900"
            onPress={handlePrintBoleto}
            gap="$2"
          >
            <ButtonIcon as={Printer} size="md" color="$white" />
            <Text color="$white">Imprimir Boleto</Text>
          </Button>
        </HStack> */}
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <VStack className="p-2 mb-48">
            <Heading size="lg" className="text-trueGray-100">
              Fechamento entrega
            </Heading>
            <HStack className="w-full justify-between">
              <Link href={deliveryItemEdit.nfeUrl}>
                <LinkText size="md">{`Nota fiscal: ${deliveryItemEdit.nfeNumber}`}</LinkText>
              </Link>
              <Link href={deliveryItemEdit.orderUrl}>
                <LinkText size="md">{`Pedido: ${deliveryItemEdit.orderNumber}`}</LinkText>
              </Link>
            </HStack>
            <Center className="w-full h-24 bg-trueGray-700 rounded-md mb-2 p-2 mt-2">
              <Center
                className="w-full h-full border-dashed border-trueGray-400 border-1 rounded-md">
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
                  <ButtonIcon as={Camera} size="xl" className="text-amber-400" />

                  <Text className="text-amber-400">Adicionar foto</Text>
                </TouchableOpacity>
              </Center>
            </Center>
            <Heading size="md" className="text-trueGray-100">
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
              <Text size="xs" className="text-red-400 mb-2">
                {errors.cnpj_f.message}
              </Text>
            )}
            <Center className="w-full h-48 bg-trueGray-700 rounded-md mb-2 p-2 mt-2">
              <Center
                className="w-full h-full border-dashed border-trueGray-400 border-1 rounded-md">
                {!deliveryItemEdit.signatureBase64 ? (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={handleShowSignature}
                  >
                    <ButtonIcon as={Signature} size="xl" className="text-amber-400" />

                    <Text className="text-amber-400">Coletar assinatura</Text>
                  </TouchableOpacity>
                ) : (
                  <Image
                    source={{ uri: deliveryItemEdit.signatureBase64 }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                    alt="Assinatura"
                  />
                )}
              </Center>
            </Center>
            <Center>
              <Heading size="md" className="text-trueGray-100">
                Lista de fotos
              </Heading>
              {deliveryItemEdit.DeliveryItemsPhotos &&
              deliveryItemEdit.DeliveryItemsPhotos?.length > 0 ? (
                deliveryItemEdit.DeliveryItemsPhotos.map(photo => (
                  <HStack
                    // height="$48"
                    key={photo.id}
                    className="w-full bg-trueGray-700 p-2 rounded-md mb-2 justify-between relative">
                    <Image
                      size="full"
                      resizeMode="contain"
                      source={{
                        uri: photo.fileUrl,
                      }}
                      alt="image"
                      className="w-full h-[200px]" />
                    <Button
                      onPress={() => {
                        // Handle delete photo logic here
                        handleDeletePhoto(photo.id);
                      }}
                      aria-label="Delete photo"
                      className="absolute top-2 right-2 opacity-40 bg-red-800  active:bg-red-600">
                      <ButtonIcon as={Trash} size="xl" className="text-trueGray-300" />
                    </Button>
                  </HStack>
                ))
              ) : (
                <Text size="xs" className="text-trueGray-400">
                  Nenhuma foto adicionada.
                </Text>
              )}
            </Center>
          </VStack>
        </ScrollView>
        <HStack
          className="justify-between absolute bottom-0 left-0 bg-trueGray-900 w-[100%] h-24 p-2">
          <Button
            size="lg"
            onPress={() => {
              navigation.goBack();
            }}
            className="rounded-md w-24 h-12 bg-blue-500  active:bg-blue-700 gap-1">
            <ButtonIcon as={ChevronLeft} size="xl" />
            <Text size="xs" className="text-trueGray-100">
              Voltar
            </Text>
          </Button>
          <Button
            size="lg"
            onPress={handleShowModalSchedule}
            className="rounded-md w-32 h-12 bg-red-500  active:bg-red-700 gap-1">
            <ButtonIcon as={CalendarClock} size="xl" />

            <Text size="xs" className="text-trueGray-100">
              Não entregue
            </Text>
          </Button>
          <Button
            size="lg"
            onPress={handleSubmit(handleDeliveryFinish)}
            className="rounded-md w-24 h-12 bg-green-700  active:bg-green-500 gap-1">
            <ButtonIcon as={CheckCheck} size="lg" />
            <Text size="xs" className="text-trueGray-100">
              Finalizar
            </Text>
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
