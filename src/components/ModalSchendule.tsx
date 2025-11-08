import { Image } from '@ui/image';
import { Text } from '@ui/text';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@ui/modal';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
import { Center } from '@ui/center';
import { Button, ButtonIcon } from '@ui/button';
// import { useState } from 'react';
import { Camera, Save, X } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from './Input';
import { Platform, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ModalCamera } from './ModalCamera';
import { type PhotoFile } from 'react-native-vision-camera';
import { api } from '@services/api';
import { useAppSelector } from '@store/store';
import { useNavigation } from '@react-navigation/native';
import { type DeliveryItemModel } from '@models/DeliveryItemModel';
import { useDispatch } from 'react-redux';
import { updateDeliveryItemEdit } from '@store/slice/deliveryRoute/deliveryItemEditSlice';
import { updateDeliveryRouteEdit } from '@store/slice/deliveryRoute/deliveryRouteEditSlice';
import { Working } from './Working';

const SchenduleSchema = yup.object().shape({
  reason: yup.string().required('Campo obrigatório'),
});

interface ModalSchenduleProps {
  visible: boolean;
  handleCloseModal: () => void;
}

interface ModalSchenduleFormData {
  reason: string;
}

export function ModalSchendule({
  visible,
  handleCloseModal,
}: ModalSchenduleProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<PhotoFile | null>(null);
  const deliveryItemEdit = useAppSelector(state => state.deliveryItemEdit);
  const deliveryRouteEdit = useAppSelector(state => state.deliveryRouteEdit);
  const [working, setWorking] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(SchenduleSchema),
    defaultValues: {
      reason: '',
    },
  });

  const handleSave = async (formData: ModalSchenduleFormData) => {
    if (!pendingPhoto) return;
    try {
      setWorking(true);
      const data = new FormData();
      let newUriImage = '';
      if (Platform.OS === 'android') {
        newUriImage = `file:///${pendingPhoto.path}`;
      } else {
        newUriImage = pendingPhoto.path;
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

      const { reason } = formData;

      const response = await api.post('/notDeliveredItems/upload', data, {
        params: {
          deliveryItemsId: deliveryItemEdit.id,
          reason,
          fileName: newFileName,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedDeliveryitemEdit: DeliveryItemModel = {
        ...deliveryItemEdit,
        status: 'not_delivered',
        NotDeliveredItems: deliveryItemEdit.NotDeliveredItems
          ? [...deliveryItemEdit.NotDeliveredItems, response.data]
          : [response.data],
      };

      dispatch(updateDeliveryItemEdit(updatedDeliveryitemEdit));

      const newDeliveryItemsList: DeliveryItemModel[] =
        deliveryRouteEdit.DeliveryItems.map(item =>
          item.id === updatedDeliveryitemEdit.id
            ? updatedDeliveryitemEdit
            : item,
        );

      dispatch(
        updateDeliveryRouteEdit({
          ...deliveryRouteEdit,
          DeliveryItems: newDeliveryItemsList,
        }),
      );

      reset();

      setPendingPhoto(null);
      handleCloseModal();
      navigation.reset({
        index: 0,
        routes: [{ name: 'DeliveryDrive' }],
      });
    } catch (error) {
      console.error('Erro ao enviar foto e motivo:', error);
    } finally {
      setWorking(false);
    }
  };

  async function handleSendTakedPhotoProduct(photoFile: PhotoFile) {
    setPendingPhoto(photoFile);

    setIsTakingPhoto(false);
  }

  return (
    <>
      {working && <Working visible={working} />}
      <ModalCamera // captura foto dos produtos
        isVisible={isTakingPhoto}
        closeModal={() => {
          setIsTakingPhoto(false);
        }}
        updateUrlImage={handleSendTakedPhotoProduct}
      />
      <Modal isOpen={visible}>
        <ModalBackdrop />
        <ModalContent className="bg-trueGray-600 rounded-md w-80">
          <ModalHeader>
            <Heading size="sm" className="text-trueGray-100">
              Motivo da não entrega
            </Heading>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            <Text size="sm" className="text-trueGray-100 mt-2">
              Motivo
            </Text>
            <Controller
              control={control}
              name="reason"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="Descreva o motivo da não realização da visita..."
                  className="font-size-sm font-family-body placeholder-text-trueGray400"
                />
              )}
            />
            <Center className="w-full h-40 bg-trueGray-700 rounded-md mb-2 p-2 mt-2">
              <Center className="w-full h-full border-dashed border-trueGray-400 border-1 rounded-md relative">
                {pendingPhoto ? (
                  <>
                    <Button
                      onPress={() => {
                        setIsTakingPhoto(true);
                      }}
                      className="border-trueGray-400 rounded-md absolute bottom-2 right-2 z-1  active:bg-trueGray-500 bg-trueGray-600 opacity-80"
                    >
                      <ButtonIcon
                        as={Camera}
                        size="xl"
                        className="text-amber-400"
                      />
                      <Text className="text-amber-400">Trocar foto</Text>
                    </Button>
                    <Image
                      source={{ uri: pendingPhoto.path }}
                      style={{ width: '100%', height: '100%', borderRadius: 8 }}
                      resizeMode="cover"
                      alt="Foto do produto"
                    />
                  </>
                ) : (
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
                    <ButtonIcon
                      as={Camera}
                      size="xl"
                      className="text-amber-400"
                    />
                    <Text className="text-amber-400">Adicionar foto</Text>
                    <Text size="2xs" className="text-amber-400">
                      Preferencialmente horizontal
                    </Text>
                  </TouchableOpacity>
                )}
              </Center>
            </Center>
            <HStack className="mt-2 justify-end gap-2">
              <Button
                onPress={handleSubmit(handleSave)}
                className="w-20 h-10 rounded-md bg-green-700  active:bg-green-500"
              >
                <ButtonIcon as={Save} size="xl" />
              </Button>
              <Button
                onPress={handleCloseModal}
                className="w-20 h-10 rounded-md bg-red-700  active:bg-red-500"
              >
                <ButtonIcon as={X} size="xl" />
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
