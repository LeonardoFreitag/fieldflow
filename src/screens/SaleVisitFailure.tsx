import {
  Button,
  ButtonIcon,
  Center,
  Heading,
  HStack,
  VStack,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { Save, X } from 'lucide-react-native';
import { DateInput } from '@components/DateInput';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-native-date-picker';
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
import { Keyboard } from 'react-native';
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
  const [newDate] = useState(new Date());
  const clientEdit = useAppSelector(state => state.clientEdit);
  const travelEdit = useAppSelector(state => state.travelEdit);
  const clientList = useAppSelector(state => state.clientList);

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
    <VStack flex={1}>
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <Center mt="$4" mx="$2" minHeight="$1/3" px="$4">
        <Heading size="sm" color="$trueGray100" w="$full">
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
        <Heading size="sm" color="$trueGray100" w="$full" mt="$2">
          Agendamento
        </Heading>
        <Controller
          name="rescheduleDate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateInput
              readOnly={true}
              buttonPress={() => {
                setShowScheduling(true);
              }}
              value={value ? new Date(value).toLocaleDateString('pt-BR') : ''}
            />
          )}
        />
        <DatePicker
          modal
          confirmText="Confirmar"
          cancelText="Cancelar"
          title="Selecione a data"
          open={showScheduling}
          date={new Date(newDate)}
          locale="pt-BR"
          mode="date"
          onConfirm={date => {
            setShowScheduling(false);
            handleUpdateScheduling(date);
          }}
          onCancel={() => {
            setShowScheduling(false);
          }}
        />
      </Center>

      <HStack w="$full" justifyContent="space-between" px="$4" py="$2">
        <Button
          size="lg"
          rounded="$lg"
          w="$16"
          h="$16"
          backgroundColor="$red700"
          $active-bg="$red500"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ButtonIcon as={X} size="xl" />
        </Button>
        <Button
          size="lg"
          rounded="$lg"
          w="$16"
          h="$16"
          backgroundColor="$green700"
          $active-bg="$green500"
          onPress={handleSubmit(handleSubmitVisitFailure)}
        >
          <ButtonIcon as={Save} size="xl" />
        </Button>
      </HStack>
    </VStack>
  );
}
