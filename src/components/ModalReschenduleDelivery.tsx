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
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
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
import { VStack } from '@ui/vstack';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@ui/select';
import { CheckIcon, ChevronDownIcon } from '@ui/icon';
import { loadReasonList } from '@/store/slice/reason/reasonListSlice';
import { type ReasonModel } from '@/models/ReasonModel';
import { useAuth } from '@/hooks/useAuth';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@ui/checkbox';
import { DateInput } from './DateInput';
import { ModalDate } from './ModalDate';

const SchenduleSchema = yup.object().shape({
  reason: yup.string().required('Campo obrigatório'),
  notes: yup.string(),
  isRescheduled: yup.boolean(),
  rescheduleDate: yup.date().nullable(),
});

interface ModalSchenduleProps {
  visible: boolean;
  handleCloseModal: () => void;
}

interface ModalSchenduleFormData {
  reason: string;
  notes: string;
  isRescheduled: boolean;
  rescheduleDate: Date | null;
}

export function ModalReschenduleDelivery({
  visible,
  handleCloseModal,
}: ModalSchenduleProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<PhotoFile | null>(null);
  const deliveryItemEdit = useAppSelector(state => state.deliveryItemEdit);
  const deliveryRouteEdit = useAppSelector(state => state.deliveryRouteEdit);
  const reasonList = useAppSelector(state => state.reasonList);
  const [working, setWorking] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(new Date());
  const [showScheduling, setShowScheduling] = useState(false);

  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(SchenduleSchema),
    defaultValues: {
      reason: '',
      notes: '',
      isRescheduled: false,
      rescheduleDate: null,
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

      const { reason, notes, isRescheduled, rescheduleDate } = formData;

      console.log('Reschedule Date:', rescheduleDate);
      console.log('Is Rescheduled:', isRescheduled);
      console.log('Notes:', notes);
      console.log('Reason:', reason);

      const response = await api.post('/notDeliveredItems', data, {
        params: {
          deliveryItemsId: deliveryItemEdit.id,
          reason,
          notes,
          isRescheduled,
          rescheduleDate,
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

  useEffect(() => {
    const fetchReasonList = async () => {
      try {
        setWorking(true);
        const response = await api.get<ReasonModel[]>(
          '/reason/list-by-customerId',
          {
            params: {
              customerId: user?.user.customerId,
            },
          },
        );
        const reasons = response.data.filter(
          reason => reason.category === 'entregas',
        );
        dispatch(loadReasonList(reasons));
      } catch (error) {
        console.error('Error fetching reasons:', error);
      } finally {
        setWorking(false);
      }
    };
    fetchReasonList();
  }, [dispatch, user?.user.customerId]);

  const handleUpdateScheduling = (schedulingDate: Date) => {
    setValue('rescheduleDate', schedulingDate as never);
  };

  return (
    <>
      {working && <Working visible={working} />}
      {isTakingPhoto && (
        <ModalCamera // captura foto dos produtos
          isVisible={isTakingPhoto}
          closeModal={() => {
            setIsTakingPhoto(false);
          }}
          updateUrlImage={handleSendTakedPhotoProduct}
        />
      )}
      <Modal isOpen={visible}>
        <ModalBackdrop />
        <ModalContent className="bg-background-200 rounded-md w-96">
          <ModalHeader>
            <Heading size="sm" className="text-typography-700">
              Motivo da não realização da entrega
            </Heading>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            <Text size="sm" className="text-typography-700">
              Motivo
            </Text>
            <Controller
              control={control}
              name="reason"
              render={({ field: { onChange, value } }) => (
                // ...dentro do render do Controller...
                <Select selectedValue={value} onValueChange={onChange}>
                  <SelectTrigger
                    variant="outline"
                    size="md"
                    className="mt-2 mb-1 items-center relative" // relative para posicionar o ícone
                  >
                    <SelectInput
                      placeholder="Selecione o motivo..."
                      className="flex-1 min-w-0 pr-8 text-ellipsis" // ocupa o restante e reserva espaço p/ ícone
                      numberOfLines={1} // trunca em 1 linha
                      // ellipsizeMode="tail" // reticências no fim
                    />
                    <SelectIcon
                      as={ChevronDownIcon}
                      className="absolute right-3"
                    />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {reasonList.map(reason => (
                        <SelectItem
                          key={reason.id}
                          label={reason.description}
                          value={reason.description}
                          className="text-typography-800"
                        />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              )}
            />
            <Center className="w-full h-48 bg-background-200 rounded-md mb-2 p-2 mt-2">
              {pendingPhoto ? (
                <>
                  <Button
                    onPress={() => {
                      setIsTakingPhoto(true);
                    }}
                    className="absolute top-3 right-3 bg-background-600 items-center justify-center w-32 h-10 border-dashed border-2 border-tertiary-400 rounded-md z-10 opacity-90"
                  >
                    <ButtonIcon
                      as={Camera}
                      size="xl"
                      className="text-tertiary-400"
                    />
                    <Text className="text-tertiary-400">Trocar foto</Text>
                  </Button>
                  <Image
                    source={{ uri: pendingPhoto.path }}
                    size="xl"
                    resizeMode="cover"
                    alt="Foto do produto"
                    className="w-full h-full rounded-md"
                  />
                </>
              ) : (
                <Button
                  className="flex-1 bg-backgrond-200 items-center justify-center w-full h-full border-dashed border-2 border-tertiary-400 rounded-md"
                  onPress={() => {
                    setIsTakingPhoto(true);
                  }}
                >
                  <VStack className="items-center gap-1">
                    <HStack className="items-center gap-2">
                      <ButtonIcon
                        as={Camera}
                        size="xl"
                        className="text-tertiary-400"
                      />
                      <Text className="text-tertiary-400">Adicionar foto</Text>
                    </HStack>
                    <Text size="2xs" className="text-tertiary-400">
                      Preferencialmente horizontal
                    </Text>
                  </VStack>
                </Button>
              )}
            </Center>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Observações (opcional)"
                  textAlignVertical="top"
                  className="h-24"
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
            />
            <Controller
              name="isRescheduled"
              control={control}
              render={({ field }) => (
                <Checkbox
                  size="md"
                  isInvalid={false}
                  isDisabled={false}
                  value={field.value?.toString() ?? 'false'}
                  onChange={field.onChange}
                  className="mt-4"
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Reagendado</CheckboxLabel>
                </Checkbox>
              )}
            />
            <Controller
              name="rescheduleDate"
              control={control}
              render={({ field }) => (
                <Controller
                  name="rescheduleDate"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DateInput
                      readOnly={true}
                      buttonPress={() => {
                        setPickerDate(value ?? new Date());
                        setShowScheduling(true);
                      }}
                      value={
                        value ? new Date(value).toLocaleDateString('pt-BR') : ''
                      }
                    />
                  )}
                />
              )}
            />
            {showScheduling && (
              <ModalDate
                showScheduling={showScheduling}
                setShowScheduling={setShowScheduling}
                handleUpdateScheduling={handleUpdateScheduling}
                pickerDate={pickerDate}
                setPickerDate={setPickerDate}
              />
            )}
            <HStack className="mt-2 justify-end gap-2">
              <Button
                onPress={handleCloseModal}
                className="w-20 h-14 rounded-md bg-error-400  active:bg-error-500"
              >
                <ButtonIcon as={X} size="xl" className="text-typography-700" />
              </Button>
              <Button
                onPress={handleSubmit(handleSave)}
                className="w-20 h-14 rounded-md bg-success-400  active:bg-success-500"
              >
                <ButtonIcon
                  as={Save}
                  size="xl"
                  className="text-typography-700"
                />
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
