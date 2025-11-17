import { Card } from '@ui/card';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
import { Center } from '@ui/center';
import { Button, ButtonIcon } from '@ui/button';
import { useNavigation } from '@react-navigation/native';
import { CustomerHeader } from '@components/CustomerHeader';
import { Calendar, ChevronLeft, Plus } from 'lucide-react-native';
import { FlatList } from 'react-native';
import { SaleCard } from '@components/SaleCard';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@store/store';
import { useMemo, useState } from 'react';
import { SliderMainPage } from '@components/SliderMainPage';
import { type TravelClientOrdersModel } from '@models/TravelClientOrdersModel';
import { addTravelClientOrderEdit } from '@store/slice/travel/travelClientOrderEditSlice';
import uuid from 'react-native-uuid';
import {
  addTravelEdit,
  updateTravelEdit,
} from '@/store/slice/travel/travelEditSlice';
import { loadClientList } from '@/store/slice/client/clientListSlice';
import { CreateTravel } from '@/storage/travel/createTravelRoute';
import { type TravelModel } from '@/models/TravelModel';
import { type ModalSchenduleFormDataModel } from '@/models/ModalShcenduleFormDataModel';
import { type ClientModel } from '@/models/ClientModel';
import { addExistsTravelEdit } from '@/store/slice/travel/existsTravelEditSlice';
import { type TravelClientVisitFailureModel } from '@/models/TravelClientVisitFailureModel';
import { api } from '@/services/api';
import { ModalReschenduleSale } from '@/components/ModalReschenduleSale';

export function SaleCheckIn() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const travelClientEdit = useAppSelector(state => state.travelClientEdit);
  const clientEdit = useAppSelector(state => state.clientEdit);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const travelEdit = useAppSelector(state => state.travelEdit);
  const clientList = useAppSelector(state => state.clientList);

  function handleSaleSelect(editOrder: TravelClientOrdersModel) {
    dispatch(addTravelClientOrderEdit(editOrder));
    navigation.navigate('SaleNew');
  }

  function handleSaleNew() {
    dispatch(
      addTravelClientOrderEdit({
        id: uuid.v4(),
        travelClientId: travelClientEdit.id,
      } as TravelClientOrdersModel),
    );
    navigation.navigate('SaleNew');
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const fotosList: string[] = useMemo(() => {
    return clientEdit.ClientPhotos?.map(photo => {
      return photo.fileUrl || '';
    });
  }, [clientEdit.ClientPhotos]);

  const handleReschedule = () => {
    setShowRescheduleModal(true);
  };

  const handleSubmitVisitFailure = async (
    data: ModalSchenduleFormDataModel,
  ) => {
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
        notes: data.notes,
        isRescheneduled: data.isRescheduled,
        reschenduleDate: data.rescheduleDate,
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
    <VStack className="flex-1 justify-start gap-2">
      <CustomerHeader data={clientEdit} showBackButton={false} />
      <VStack className="h-64 px-2 py-2">
        {fotosList && fotosList.length > 0 ? (
          <SliderMainPage photos={fotosList} />
        ) : (
          <Center className="h-full">
            <Text size="md" className="text-typography-300">
              Nenhuma foto encontrada
            </Text>
          </Center>
        )}
      </VStack>
      <VStack className="pt-2 gap-2 flex-1">
        <Card className="bg-background-100 h-72 mt-4 py-2">
          <Heading size="sm" className="text-typography-700 mb-2">
            Pedidos anteriores
          </Heading>
          <FlatList
            data={clientEdit.LastOrders}
            keyExtractor={item =>
              item.id ? item.id.toString() : Math.random().toString()
            }
            renderItem={({ item }) => (
              <SaleCard
                data={item}
                handleSaleRepeat={() => {
                  handleSaleSelect(item);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <VStack className="mt-1 justify-center items-center">
                <Text size="md" className="text-typography-300">
                  Nenhum pedido encontrado
                </Text>
              </VStack>
            )}
          />
        </Card>
      </VStack>
      <HStack className="justify-between absolute bottom-0 left-0 bg-background-100 w-[100%] h-24 p-2">
        <Button
          size="lg"
          onPress={handleBack}
          className="rounded-md w-32 h-12 bg-info-300  active:bg-info-700 gap-2"
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
          onPress={handleReschedule}
          className="rounded-md w-32 h-12 bg-error-300  active:bg-error-700 gap-2"
        >
          <ButtonIcon as={Calendar} size="xl" className="text-typography-700" />
          <Text size="xs" className="text-typography-700">
            Reagendar
          </Text>
        </Button>
        <Button
          size="lg"
          onPress={handleSaleNew}
          className="rounded-md w-32 h-12 bg-success-300  active:bg-success-500 gap-2"
        >
          <ButtonIcon as={Plus} size="xl" className="text-typography-700" />
          <Text size="xs" className="text-typography-700">
            Pedido
          </Text>
        </Button>
      </HStack>
      {showRescheduleModal && (
        <ModalReschenduleSale
          visible={showRescheduleModal}
          handleCloseModal={() => {
            setShowRescheduleModal(false);
          }}
        />
      )}
    </VStack>
  );
}
