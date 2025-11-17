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
import { Platform, useColorScheme } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { ModalCamera } from './ModalCamera';
import { type PhotoFile } from 'react-native-vision-camera';
import { api } from '@services/api';
import { useAppSelector } from '@store/store';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Working } from './Working';
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
import { VStack } from '@ui/vstack';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@ui/checkbox';
import { DateInput } from '@components/DateInput';
import { ModalDate } from './ModalDate';
import { type ClientModel } from '@/models/ClientModel';
import { type TravelModel } from '@/models/TravelModel';
import { CreateTravel } from '@/storage/travel/createTravelRoute';
import {
  addTravelEdit,
  updateTravelEdit,
} from '@/store/slice/travel/travelEditSlice';
import { addExistsTravelEdit } from '@/store/slice/travel/existsTravelEditSlice';
import { loadClientList } from '@/store/slice/client/clientListSlice';
import { useAuth } from '@/hooks/useAuth';
import { loadReasonList } from '@/store/slice/reason/reasonListSlice';
import { type ReasonModel } from '@/models/ReasonModel';
import { loadAllClientList } from '@/store/slice/client/allClientListSlice';

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

export function ModalReschenduleSale({
  visible,
  handleCloseModal,
}: ModalSchenduleProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<PhotoFile | null>(null);
  const reasonList = useAppSelector(state => state.reasonList);
  const travelEdit = useAppSelector(state => state.travelEdit);
  const clientEdit = useAppSelector(state => state.clientEdit);
  const clientList = useAppSelector(state => state.clientList);
  const [working, setWorking] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(new Date());
  const allClientList = useAppSelector(state => state.allClientList);

  const { user } = useAuth();

  const colorScheme = useColorScheme();
  const iosThemeProps =
    Platform.OS === 'ios'
      ? ({ themeVariant: colorScheme === 'dark' ? 'dark' : 'light' } as const)
      : ({} as const);

  const {
    control,
    handleSubmit,
    formState: { errors },
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

    const travelClientId = travelEdit.TravelClients?.find(
      travelClient => travelClient.clientId === clientEdit.id,
    )?.id;

    if (!travelClientId) {
      return;
    }
    try {
      setWorking(true);
      // Validar se os dados necessários existem
      if (!travelEdit.orderedClients || !travelEdit.TravelClients) {
        // Reconstrói orderedClients a partir de TravelClients se não existir
        const reconstructedOrderedClients =
          travelEdit.TravelClients?.map(travelClient => {
            if (travelClient.Client) {
              return {
                ...travelClient.Client,
                isSelected: true,
                status: travelClient.status || 'pending',
                latitude: travelClient.latitude ?? travelClient.Client.latitude,
                longitude:
                  travelClient.longitude ?? travelClient.Client.longitude,
              } as ClientModel;
            }
            return null;
          }).filter((client): client is ClientModel => client !== null) ?? [];

        const travelLocalSaved: TravelModel = {
          ...travelEdit,
          orderedClients:
            reconstructedOrderedClients.length > 0
              ? reconstructedOrderedClients
              : clientList,
          route: travelEdit.route,
        };

        await CreateTravel(travelLocalSaved);
        dispatch(addTravelEdit(travelLocalSaved));
        dispatch(addExistsTravelEdit({ exists: true }));
      }

      // salvar na api
      const data = new FormData();
      let newUriImage = '';
      if (Platform.OS === 'android') {
        newUriImage = `file:///${pendingPhoto.path}`;
      } else {
        newUriImage = pendingPhoto.path;
      }
      const newFileName = `${travelClientId}_${Date.now()}.jpg`;

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
      const { reason, notes, rescheduleDate, isRescheduled } = formData;

      const response = await api.post(
        '/travel/travelClientsVisitFailure',
        data,
        {
          params: {
            travelClientId,
            reason,
            notes,
            isRescheduled,
            rescheduleDate,
            fileName: newFileName,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const updatedTravelEdit: TravelModel = {
        ...travelEdit,
        orderedClients: clientList.map(client => {
          if (client.id === clientEdit.id) {
            return {
              ...client,
              status: 'not_visited', // Marca o cliente como não visitado
            };
          }
          return client;
        }),
        TravelClients: travelEdit.TravelClients?.map(travelClient => {
          if (travelClient.clientId === clientEdit.id) {
            return {
              ...travelClient,
              status: 'not_visited', // Marca o cliente como não visitado
              TravelClientVisitFailures: [
                ...(travelClient.TravelClientVisitFailures ?? []),
                response.data,
              ], // Adiciona o registro de visita não realizada
            };
          }
          return travelClient;
        }),
      };

      dispatch(updateTravelEdit(updatedTravelEdit));

      const updatedClientList = clientList.map(client => {
        if (client.id === clientEdit.id) {
          return {
            ...client,
            status: 'not_visited', // Marca o cliente como não visitado
          };
        }
        return client;
      });
      dispatch(loadClientList(updatedClientList ?? []));
      dispatch(loadAllClientList(updatedClientList ?? []));

      await CreateTravel(updatedTravelEdit);

      navigation.navigate('SaleRouteDrive');
    } catch (error) {
      console.error('Error submitting visit failure:', error);
    } finally {
      setWorking(false);
    }
  };

  async function handleSendTakedPhotoProduct(photoFile: PhotoFile) {
    setPendingPhoto(photoFile);

    setIsTakingPhoto(false);
  }

  const takePhoto = () => {
    setPendingPhoto(null);
    setIsTakingPhoto(true);
  };

  const handleUpdateScheduling = (schedulingDate: Date) => {
    setValue('rescheduleDate', schedulingDate as never);
  };

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
          reason => reason.category === 'vendas',
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
              Motivo da não realização da visita
            </Heading>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            <Text size="sm" className="text-typography-700 mt-2">
              Motivo
            </Text>
            <Controller
              control={control}
              name="reason"
              render={({ field: { onChange, value } }) => (
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
            <Center className="w-full h-40 bg-background-200 rounded-md mb-2 p-2 mt-2">
              {pendingPhoto ? (
                <>
                  <Button
                    onPress={() => {
                      takePhoto();
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
                  className="flex-1 items-center justify-center w-full h-full border-dashed border-2 border-tertiary-400 rounded-md bg-background-200"
                  onPress={() => {
                    takePhoto();
                  }}
                >
                  <VStack>
                    <HStack className="items-center gap-2 mb-1">
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
                className="w-32 h-14 rounded-md bg-error-400  active:bg-error-500"
              >
                <ButtonIcon as={X} className="text-typography-900 w-7 h-7" />
              </Button>
              <Button
                onPress={handleSubmit(handleSave)}
                className="w-32 h-14 rounded-md bg-success-400  active:bg-success-500"
              >
                <ButtonIcon as={Save} className="text-typography-900 w-7 h-7" />
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
