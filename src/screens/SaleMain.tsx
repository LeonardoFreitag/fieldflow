import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { HStack } from '@ui/hstack';
import { Button, ButtonIcon } from '@ui/button';
import { ClientRouteCard } from '@components/ClientRouteCard';
import { HomeHeader } from '@components/HomeHeader';
import { Input } from '@components/Input';
import { Working } from '@components/Working';
import { type IRequestClientOptimizeDTO } from '@dtos/IRequestClientOptimizeDTO';
import {
  type OrderedClient,
  type RouteOptimizationResult,
} from '@dtos/IResponseClientOptimizeDTO';
import { useAuth } from '@hooks/useAuth';
import { useHandleSaleRoute } from '@hooks/useHandleSaleRoute';
import polyline from '@mapbox/polyline';
import { type ClientModel } from '@models/ClientModel';
import { type TravelModel, type TravelClientsModel } from '@models/TravelModel';
import { useNavigation } from '@react-navigation/native';
import { api } from '@services/api';
import { loadAllClientList } from '@store/slice/client/allClientListSlice';
import { addClientEdit } from '@store/slice/client/clientEditSlice';
import {
  loadClientList,
  updateClientList,
} from '@store/slice/client/clientListSlice';
import {
  loadClientRouteList,
  updateClientRouteList,
} from '@store/slice/client/clientRouteListSlice';
import { addTravelClientEdit } from '@store/slice/travel/travelClientEditSlice';
import { updateTravelEdit } from '@store/slice/travel/travelEditSlice';
import { useAppSelector } from '@store/store';
import {
  BrushCleaning,
  ChevronLeft,
  MapIcon,
  Plus,
  PlusIcon,
  X,
} from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { ClientListHeader } from '@/components/ClientListHeader';
import { addExistsTravelEdit } from '@store/slice/travel/existsTravelEditSlice';
import { ClearTravel } from '@storage/travel/clearTravelRoute';

export type FilterType = 'suggested' | 'all';

export function SaleMain() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [textTyped, setTextTyped] = useState('');
  const clientRouteList = useAppSelector(state => state.clientRouteList);
  const clientList = useAppSelector(state => state.clientList);
  const clientAdHocList = useAppSelector(state => state.clientAdHocList);
  const travelEdit = useAppSelector(state => state.travelEdit);
  const existsTravelEdit = useAppSelector(state => state.existsTravelEdit);
  const [routeToday, setRouteToday] = useState(true);
  const [working, setWorking] = useState(false);
  const coordsEdit = useAppSelector(state => state.coordsEdit);
  // const canChangeRouteEdit = useAppSelector(state => state.canChangeRouteEdit);

  const { user } = useAuth();

  const {
    handleCreateAndSaveTravel,
    handleSaleRoute,
    routeInitialized,
    setRota,
    setRouteInitialized,
  } = useHandleSaleRoute();

  const handleCheckIn = async (
    clientForCheckIn: ClientModel,
    travelForCheckIn: TravelModel,
  ) => {
    try {
      const response = await api.get<ClientModel>('/client/details', {
        params: {
          clientId: clientForCheckIn.id,
        },
      });

      const clientCheckIn = travelForCheckIn.TravelClients?.find(
        c => c.clientId === clientForCheckIn.id,
      );
      if (!clientCheckIn) {
        Alert.alert('Erro', 'Cliente não encontrado na rota');
        return;
      }

      dispatch(addClientEdit(response.data));
      dispatch(addTravelClientEdit(clientCheckIn));
    } catch (error) {
      // console.error('Erro ao buscar detalhes do cliente:', error);
    }
  };

  function orderClientsByRoute(
    saleRouteList: ClientModel[],
    rotaGoogle: OrderedClient[],
  ): ClientModel[] {
    const listOrdenated: ClientModel[] = [];
    rotaGoogle.forEach((client, index) => {
      const clientData = saleRouteList.find(c => c.id === client.id);
      if (clientData) {
        const existsData = listOrdenated.find(c => c.id === clientData.id);
        if (!existsData) {
          listOrdenated.push({
            ...clientData,
            latitude: client.latitude ?? 0,
            longitude: client.longitude ?? 0,
          });
        }
      }
    });
    return listOrdenated;
  }

  const fetchRota = useCallback(
    async (listOfClients: ClientModel[]): Promise<ClientModel[]> => {
      if (
        existsTravelEdit.exists &&
        listOfClients.length > 0 &&
        !routeInitialized
      ) {
        const waypoints = listOfClients
          .filter(client => client.dataFrom !== 'ad_hoc')
          .map(client => ({
            id: client.id,
            latitude: client.latitude ?? 0,
            longitude: client.longitude ?? 0,
            address: `${client.streetName}, ${client.streetNumber}, ${client.city}, ${client.state}, ${client.zipCode}`,
          }));

        const destinationItem = listOfClients[listOfClients.length - 1];

        const dataRequest: IRequestClientOptimizeDTO = {
          origin: {
            latitude: coordsEdit.latitude,
            longitude: coordsEdit.longitude,
          },
          destination: {
            latitude: destinationItem.latitude ?? 0,
            longitude: destinationItem.longitude ?? 0,
            address: `${destinationItem.streetName}, ${destinationItem.streetNumber}, ${destinationItem.city}, ${destinationItem.state}, ${destinationItem.zipCode}`,
          },
          waypoints,
        };
        try {
          const response = await api.post<RouteOptimizationResult>(
            '/client/routeOptimize',
            dataRequest,
          );

          const { orderedClients } = response.data;

          const { optimizedRoute: rotaGoogle } = response.data;

          const pontos = polyline.decode(rotaGoogle.overview_polyline.points);

          const coordenadas = pontos.map((p: [number, number]) => ({
            latitude: p[0],
            longitude: p[1],
          }));

          setRota(coordenadas);

          const clientsAdHoc = clientAdHocList
            .filter(client => client.dataFrom === 'ad_hoc')
            .map(client => ({
              ...client,
              latitude: client.latitude ?? 0,
              longitude: client.longitude ?? 0,
            }));

          const clientesOrdenados = orderClientsByRoute(
            listOfClients,
            orderedClients,
          );

          dispatch(loadClientList(clientesOrdenados));
          dispatch(loadAllClientList([...clientesOrdenados, ...clientsAdHoc]));
          setRouteInitialized(true);
          return clientesOrdenados;
        } catch (error) {
          // console.error('Erro ao buscar rota otimizada:', error);
        }
      } else if (!existsTravelEdit.exists && !routeInitialized) {
        const waypoints = listOfClients
          .filter(client => client.dataFrom !== 'ad_hoc')
          .map(client => ({
            id: client.id,
            latitude: client.latitude ?? 0,
            longitude: client.longitude ?? 0,
            address: `${client.streetName}, ${client.streetNumber}, ${client.city}, ${client.state}, ${client.zipCode}`,
          }));

        const destinationItem = listOfClients[listOfClients.length - 1];

        const dataRequest: IRequestClientOptimizeDTO = {
          origin: {
            latitude: coordsEdit.latitude,
            longitude: coordsEdit.longitude,
          },
          destination: {
            latitude: destinationItem.latitude ?? 0,
            longitude: destinationItem.longitude ?? 0,
            address: `${destinationItem.streetName}, ${destinationItem.streetNumber}, ${destinationItem.city}, ${destinationItem.state}, ${destinationItem.zipCode}`,
          },
          waypoints,
        };

        try {
          const response = await api.post<RouteOptimizationResult>(
            '/client/routeOptimize',
            dataRequest,
          );

          const { orderedClients } = response.data;

          const { optimizedRoute: rotaGoogle } = response.data;

          const pontos = polyline.decode(rotaGoogle.overview_polyline.points);

          const coordenadas = pontos.map((p: [number, number]) => ({
            latitude: p[0],
            longitude: p[1],
          }));

          setRota(coordenadas);

          const clientsAdHoc = clientAdHocList
            .filter(client => client.dataFrom === 'ad_hoc')
            .map(client => ({
              ...client,
              latitude: client.latitude ?? 0,
              longitude: client.longitude ?? 0,
            }));

          const clientesOrdenados = orderClientsByRoute(
            listOfClients,
            orderedClients,
          );

          dispatch(loadClientList(clientesOrdenados));
          dispatch(loadAllClientList([...clientesOrdenados, ...clientsAdHoc]));
          setRouteInitialized(true);
          return clientesOrdenados;
        } catch (error) {
          // console.error('Erro ao buscar rota otimizada:', error);
        }
      }
      return listOfClients;
    },
    [
      clientAdHocList,
      coordsEdit.latitude,
      coordsEdit.longitude,
      dispatch,
      existsTravelEdit.exists,
      routeInitialized,
      setRota,
      setRouteInitialized,
    ],
  );

  const loadClientsByRoute = useCallback(async () => {
    try {
      setWorking(true);
      const response = await api.get<ClientModel[]>('/client/listByRoute', {
        params: {
          customerId: user?.user.customerId,
          routeId: user?.user.routeId,
        },
      });

      dispatch(loadClientRouteList(response.data));
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setWorking(false);
    }
  }, [dispatch, user?.user.customerId, user?.user.routeId]);

  const handleGetClientRoutToDay = useCallback(async () => {
    try {
      setWorking(true);
      const response = await api.get<ClientModel[]>('/client/routeToDay', {
        params: {
          customerId: user?.user.customerId,
          routeId: user?.user.routeId,
          day: new Date().toISOString().split('T')[0],
        },
      });
      const data = response.data;
      dispatch(loadClientRouteList(data));
    } catch (error) {
      console.error('Erro ao buscar rota do dia:', error);
    } finally {
      setWorking(false);
    }
  }, [dispatch, user?.user.customerId, user?.user.routeId]);

  useEffect(() => {
    if (routeToday) {
      handleGetClientRoutToDay();
      return;
    }
    loadClientsByRoute();
  }, [handleGetClientRoutToDay, loadClientsByRoute, routeToday]);

  const handleSelectCustomer = (clientItem: ClientModel) => {
    dispatch(
      updateClientRouteList({
        ...clientItem,
        isSelected: !clientItem.isSelected,
      }),
    );
  };

  // const handleSelectCustomer = useCallback(
  //   (clientItem: ClientModel) => {
  //     const selected = clientItem.isSelected ? clientItem.isSelected : false;
  //     dispatch(
  //       updateClientList({
  //         ...clientItem,
  //         isSelected: !selected,
  //       }),
  //     );
  //   },
  //   [dispatch],
  // );

  const handleAddToRoute = async () => {
    const selectedClients = clientRouteList.filter(client => client.isSelected);

    if (selectedClients.length === 0) {
      return;
    }

    if (!existsTravelEdit.exists) {
      const clientsWithStatus: ClientModel[] = selectedClients.map(client => ({
        ...client,
        status: client.status ? client.status : 'pending',
      }));

      await fetchRota(clientsWithStatus);

      await handleCreateAndSaveTravel(
        clientsWithStatus,
        routeToday ? 'route' : 'manual',
      );

      await handleSaleRoute();

      // navigation.navigate('SaleRoute');

      return;
    }

    try {
      setWorking(true);
      const responses = await Promise.all(
        selectedClients.map(async (clientItem, idx) => {
          const newClient: TravelClientsModel = {
            travelId: travelEdit.id ?? '',
            clientId: clientItem.id,
            clientCode: clientItem.code,
            orderInRoute: (travelEdit.TravelClients?.length ?? 0) + idx + 1,
            latitude: Number(clientItem.latitude),
            longitude: Number(clientItem.longitude),
            checkInDate: new Date(),
            checkOutDate: new Date(),
            notes: '',
            status: 'pending',
            dataFrom: routeToday ? 'route' : 'manual',
          };
          const response = await api.post('travel/travelClients', newClient);
          return response.data;
        }),
      );

      dispatch(
        updateTravelEdit({
          ...travelEdit,
          TravelClients: [...(travelEdit.TravelClients ?? []), ...responses],
        }),
      );

      await fetchRota([...clientList, ...selectedClients]);

      await handleSaleRoute();

      // navigation.navigate('SaleRoute');
    } catch (error) {
      console.error('Error adding clients to route:', error);
    } finally {
      setWorking(false);
    }
  };

  const handleAddNewSale = async (clientItem: ClientModel) => {
    dispatch(addClientEdit(clientItem));

    if (!existsTravelEdit.exists) {
      try {
        setWorking(true);
        const clientsWithStatus: ClientModel[] = [];
        clientsWithStatus.push({
          ...clientItem,
          dataFrom: 'ad_hoc',
          status: clientItem.status ? clientItem.status : 'pending',
        });

        const dataClients = await fetchRota(clientsWithStatus);

        await handleCreateAndSaveTravel(dataClients, 'ad_hoc');

        const dataTravel = await handleSaleRoute();

        // Usar o cliente específico ao invés do primeiro da lista
        const targetClient =
          dataClients.find(client => client.id === clientItem.id) ?? clientItem;

        await handleCheckIn(targetClient, dataTravel);

        navigation.navigate('SaleCheckIn');

        return;
      } catch (error) {
        console.error('Error adding clients to route:', error);
      } finally {
        setWorking(false);
      }
    }

    try {
      setWorking(true);
      const newClient: TravelClientsModel = {
        travelId: travelEdit.id ?? '',
        clientId: clientItem.id,
        clientCode: clientItem.code,
        orderInRoute: (travelEdit.TravelClients?.length ?? 0) + 1,
        latitude: Number(clientItem.latitude),
        longitude: Number(clientItem.longitude),
        checkInDate: new Date(),
        checkOutDate: new Date(),
        notes: '',
        status: 'pending',
        dataFrom: 'ad_hoc',
      };
      const response = await api.post('travel/travelClients', newClient);

      const clientForSale = response.data;

      dispatch(
        updateTravelEdit({
          ...travelEdit,
          TravelClients: [...(travelEdit.TravelClients ?? []), clientForSale],
        }),
      );

      // Incluir o cliente ad hoc na lista para buscar a rota otimizada
      const clientAsModel: ClientModel = {
        ...clientItem,
        dataFrom: 'ad_hoc',
      };

      const dataClients = await fetchRota([...clientList, clientAsModel]);

      const targetClient = dataClients.find(
        client => client.id === clientItem.id,
      );

      if (!targetClient) {
        // Se não encontrou na rota otimizada, usar o cliente original
        const dataTravel = await handleSaleRoute();
        await handleCheckIn(clientItem, dataTravel);
        navigation.navigate('SaleCheckIn');
        return;
      }

      const dataTravel = await handleSaleRoute();

      await handleCheckIn(targetClient, dataTravel);

      navigation.navigate('SaleCheckIn');
    } catch (error) {
      console.error('Error adding clients to route:', error);
    } finally {
      setWorking(false);
    }
  };

  const clientSelecteds = useMemo(() => {
    return clientRouteList.filter((client: ClientModel) => client.isSelected);
  }, [clientRouteList]);

  const handleStartSaleRouteDrive = useCallback(() => {
    if (!existsTravelEdit.exists) {
      const selectedClients = clientList.filter(client => client.isSelected);

      const clientsWithStatus: ClientModel[] = selectedClients.map(client => ({
        ...client,
        status: client.status ? client.status : 'pending',
      }));
      dispatch(loadClientList(clientsWithStatus));
    }

    navigation.navigate('SaleRouteDrive');
  }, [clientList, dispatch, existsTravelEdit.exists, navigation]);

  const handleClearSelection = useCallback(() => {
    if (existsTravelEdit.exists) {
      ClearTravel();
      dispatch(
        addExistsTravelEdit({
          exists: false,
        }),
      );
    }
    dispatch(
      loadClientList(
        clientList.map((client: ClientModel) => ({
          ...client,
          isSelected: false,
        })),
      ),
    );
  }, [existsTravelEdit.exists, dispatch, clientList]);

  const continueIsDisable = useMemo(() => {
    const minVisits = user?.user.customer.maxVisitsSales ?? 0;
    if (minVisits === 0) return false;
    return clientList.length < minVisits;
  }, [clientList.length, user?.user.customer.maxVisitsSales]);

  return (
    <>
      <Working visible={working} />
      <VStack className="flex-1">
        <HomeHeader />
        <VStack className="flex-1 px-2 py-2">
          <HStack className="mb-4 justify-between items-center flex-row">
            <ClientListHeader
              selectedFilter={routeToday ? 'suggested' : 'all'}
              onChangeFilter={filter => {
                if (filter === 'suggested') {
                  setRouteToday(true);
                  handleGetClientRoutToDay();
                } else {
                  setRouteToday(false);
                  loadClientsByRoute();
                }
              }}
              search={textTyped}
              onChangeSearch={setTextTyped}
            />
          </HStack>
          <HStack className="mb-2 justify-between items-center flex-row">
            <Text size="md" className="text-typography-700">
              {`Selecionados: ${clientSelecteds.length}`}
            </Text>
            <Text size="md" className="text-typography-700">
              {`Rota: ${clientList.length}`}
            </Text>
            <Text className="text-typography-700">{`${clientRouteList.length} clientes`}</Text>
          </HStack>

          <HStack className="mb-2 w-full p-2 rounded-md gap-2">
            <Input
              placeholder="Pesquise pelo cliente..."
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={setTextTyped}
              value={textTyped}
              // className="w-full"
            />
            <Button
              size="lg"
              onPress={() => {
                setTextTyped('');
              }}
              className="rounded-md w-12 h-12 gap-1 bg-error-500 active:bg-error-600"
            >
              <ButtonIcon as={X} size="xl" className="text-typography-900" />
            </Button>
          </HStack>

          {clientRouteList.length > 0 && (
            <FlatList
              data={clientRouteList.filter(client =>
                client.companyName
                  .toLowerCase()
                  .includes(textTyped.toLowerCase()),
              )}
              keyExtractor={(item: ClientModel) => item.id}
              renderItem={({ item }) => (
                <ClientRouteCard
                  data={item}
                  handleSelectCustomer={() => {
                    handleSelectCustomer(item);
                  }}
                  handleAddNewSale={async () => {
                    await handleAddNewSale(item);
                  }}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </VStack>
        <HStack className="justify-between absolute bottom-0 left-0 bg-background-50 w-[100%] h-24 p-2">
          <Button
            size="lg"
            onPress={() => {
              navigation.goBack();
            }}
            className="rounded-md w-24 h-12 bg-info-300  active:bg-info-300 gap-1"
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
            onPress={handleClearSelection}
            className="rounded-md h-12 w-12 bg-error-500 flex"
          >
            <ButtonIcon
              as={BrushCleaning}
              size="xl"
              className="text-typography-700"
            />
          </Button>

          <Button
            size="lg"
            onPress={handleAddToRoute}
            className="rounded-md h-12 w-12 bg-success-300 flex"
          >
            <ButtonIcon
              as={PlusIcon}
              size="xl"
              className="text-typography-700"
            />
          </Button>

          <Button
            size="lg"
            onPress={handleStartSaleRouteDrive}
            className="rounded-md w-24 h-12 bg-success-300  active:bg-success-500 gap-1"
            disabled={continueIsDisable}
          >
            <ButtonIcon
              as={MapIcon}
              size="lg"
              className="text-typography-700"
            />
            <Text
              size="xs"
              className="text-trueGray-100 text-typography-700 text-center"
            >
              Mapa
            </Text>
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
