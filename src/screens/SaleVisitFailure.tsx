import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { Button, ButtonIcon } from "@/components/ui/button";
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { Save, X } from 'lucide-react-native';
import { DateInput } from '@components/DateInput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAppSelector } from '@store/store';
import { Input } from '@components/Input';
import { type TravelModel } from '@models/TravelModel';
import { type TravelClientVisitFailureModel } from '@models/TravelClientVisitFailureModel';
import { type ClientModel } from '@models/ClientModel';
import { api } from '@services/api';
import { CreateTravel } from '@storage/travel/createTravelRoute';
import { loadClientList } from '@store/slice/client/clientListSlice';
import { useDispatch } from 'react-redux';
import {
  addTravelEdit,
  updateTravelEdit,
} from '@store/slice/travel/travelEditSlice';
import { Keyboard, Platform, Modal, useColorScheme } from 'react-native';
import { addExistsTravelEdit } from '@store/slice/travel/existsTravelEditSlice';

const SaleVisitFailureSchema = yup.object().shape({
  reason: yup.string().required('Campo obrigatório'),
  rescheduleDate: yup
    .date()
    .typeError('Data inválida')
    .required('Campo obrigatório'),
});

interface DataFormVisitFailure {
  reason: string;
  rescheduleDate: Date;
}

export function SaleVisitFailure() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showScheduling, setShowScheduling] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(new Date());
  const clientEdit = useAppSelector(state => state.clientEdit);
  const travelEdit = useAppSelector(state => state.travelEdit);
  const clientList = useAppSelector(state => state.clientList);
  const colorScheme = useColorScheme();

  // iOS-only visual theme for DateTimePicker to match app color scheme
  const iosThemeProps =
    Platform.OS === 'ios'
      ? ({ themeVariant: colorScheme === 'dark' ? 'dark' : 'light' } as const)
      : ({} as const);

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(SaleVisitFailureSchema),
    defaultValues: {
      reason: '',
      rescheduleDate: new Date(),
    },
  });

  const handleUpdateScheduling = (schedulingDate: Date) => {
    setValue('rescheduleDate', schedulingDate as never);
  };

  const handleSubmitVisitFailure = async (data: DataFormVisitFailure) => {
    const travelClientId = travelEdit.TravelClients?.find(
      travelClient => travelClient.clientId === clientEdit.id,
    )?.id;

    if (!travelClientId) {
      return;
    }
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
    try {
      const newTravelClientVisitFailure: TravelClientVisitFailureModel = {
        travelClientId,
        reason: data.reason,
        rescheduleDate: data.rescheduleDate,
      };

      const response = await api.post(
        '/travel/travelClientsVisitFailure',
        newTravelClientVisitFailure,
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
      console.log('Updated Client List:', updatedClientList);
      dispatch(loadClientList(updatedClientList ?? []));

      await CreateTravel(updatedTravelEdit);

      navigation.navigate('SaleRouteDrive');
    } catch (error) {
      const isHttpError = (
        err: any,
      ): err is { response: { status: number } } => {
        return err && err.response && typeof err.response.status === 'number';
      };

      if (isHttpError(error) && error.response.status === 404) {
        const updatedTravelEdit: TravelModel = {
          ...travelEdit,
          orderedClients: travelEdit.orderedClients?.map(client => {
            if (client.id === clientEdit.id) {
              return {
                ...client,
                status: 'not_visited',
              };
            }
            return client;
          }),
          TravelClients: travelEdit.TravelClients?.map(travelClient => {
            if (travelClient.clientId === clientEdit.id) {
              return {
                ...travelClient,
                status: 'not_visited',
              };
            }
            return travelClient;
          }),
        };

        dispatch(updateTravelEdit(updatedTravelEdit));

        const updatedClientList = updatedTravelEdit.orderedClients ?? [];
        dispatch(loadClientList(updatedClientList));

        await CreateTravel(updatedTravelEdit);

        navigation.navigate('SaleRouteDrive');
      } else {
        navigation.navigate('SaleRouteDrive');
      }
    }
  };

  return (
    <VStack className="flex-1">
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <Center className="mt-4 mx-2 min-h-1/3 px-4">
        <Heading size="sm" className="text-trueGray-100 w-full">
          Motivo da não realização da visita
        </Heading>
        <Controller
          control={control}
          name="reason"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Observações sobre o pedido..."
              keyboardType="default"
              autoCapitalize="none"
              numberOfLines={4}
              multiline
              rounded="$md"
              padding="$2"
              value={value}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              blurOnSubmit={true}
              onChangeText={onChange}
            />
          )}
        />
        <Heading size="sm" className="text-trueGray-100 w-full mt-2">
          Agendamento
        </Heading>
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
              value={value ? new Date(value).toLocaleDateString('pt-BR') : ''}
            />
          )}
        />
        <Modal
          visible={showScheduling}
          animationType="slide"
          transparent
          onRequestClose={() => {
            setShowScheduling(false);
          }}
        >
          <Box
            className="absolute left-0 right-0 top-0 bottom-0 bg-rgba(0,0,0,0.5) justify-center items-center">
            <Box
              className={` ${colorScheme === 'dark' ? "bg-trueGray-900" : "bg-white"} w-[90%] max-w-[420px] rounded-lg p-4 `}>
              <DateTimePicker
                {...iosThemeProps}
                value={pickerDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                locale="pt-BR"
                onChange={(event, date) => {
                  if ((event as any)?.type === 'dismissed') {
                    return;
                  }
                  const selectedDate = date ?? pickerDate;
                  setPickerDate(selectedDate);
                }}
              />
              <HStack className="w-full justify-end mt-3 gap-[8px]">
                <Button
                  variant="outline"
                  onPress={() => {
                    setShowScheduling(false);
                  }}
                >
                  <ButtonIcon as={X} size="lg" />
                </Button>
                <Button
                  onPress={() => {
                    handleUpdateScheduling(pickerDate);
                    setShowScheduling(false);
                  }}
                >
                  <ButtonIcon as={Save} size="lg" />
                </Button>
              </HStack>
            </Box>
          </Box>
        </Modal>
      </Center>
      <HStack className="w-full justify-between px-4 py-2">
        <Button
          size="lg"
          onPress={() => {
            navigation.goBack();
          }}
          className="rounded-lg w-16 h-16 bg-red-700  active:bg-red-500">
          <ButtonIcon as={X} size="xl" />
        </Button>
        <Button
          size="lg"
          onPress={handleSubmit(handleSubmitVisitFailure)}
          className="rounded-lg w-16 h-16 bg-green-700  active:bg-green-500">
          <ButtonIcon as={Save} size="xl" />
        </Button>
      </HStack>
    </VStack>
  );
}

// Removed StyleSheet styles in favor of themed Box components
