import {
  Button,
  ButtonIcon,
  Center,
  Heading,
  HStack,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
  Text,
  Image,
} from '@gluestack-ui/themed';
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
        <ModalContent bg="$trueGray600" rounded="$md" width="$80">
          <ModalHeader>
            <Heading color="$trueGray100" size="sm">
              Motivo da não entrega
            </Heading>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            <Text color="$trueGray100" size="sm" mt="$2">
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
                  fontSize="$sm"
                  fontFamily="$body"
                  placeholderTextColor="$trueGray400"
                />
              )}
            />
            <Center
              w="$full"
              h="$40"
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
                position="relative"
              >
                {pendingPhoto ? (
                  <>
                    <Button
                      borderColor="$trueGray400"
                      rounded="$md"
                      position="absolute"
                      bottom="$2"
                      right="$2"
                      zIndex={1}
                      $active-bg="$trueGray500"
                      backgroundColor="$trueGray600"
                      opacity={0.8}
                      onPress={() => {
                        setIsTakingPhoto(true);
                      }}
                    >
                      <ButtonIcon as={Camera} size="xl" color="$amber400" />
                      <Text color="$amber400">Trocar foto</Text>
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
                    <ButtonIcon as={Camera} size="xl" color="$amber400" />
                    <Text color="$amber400">Adicionar foto</Text>
                    <Text color="$amber400" size="2xs">
                      Preferencialmente horizontal
                    </Text>
                  </TouchableOpacity>
                )}
              </Center>
            </Center>
            <HStack mt="$2" justifyContent="flex-end" gap="$2">
              <Button
                width="$20"
                height="$10"
                rounded="$md"
                backgroundColor="$green700"
                $active-bg="$green500"
                onPress={handleSubmit(handleSave)}
              >
                <ButtonIcon as={Save} size="xl" />
              </Button>
              <Button
                width="$20"
                height="$10"
                rounded="$md"
                backgroundColor="$red700"
                $active-bg="$red500"
                onPress={handleCloseModal}
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
