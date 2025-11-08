import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon } from "@/components/ui/button";
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
import { loadClientList } from '@store/slice/client/clientListSlice';
import {
  loadClientRouteList,
  updateClientRouteList,
} from '@store/slice/client/clientRouteListSlice';
import { addTravelClientEdit } from '@store/slice/travel/travelClientEditSlice';
import { updateTravelEdit } from '@store/slice/travel/travelEditSlice';
import { useAppSelector } from '@store/store';
import { ChevronLeft, Plus, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';

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
  const [routeToday, setRouteToday] = useState(false);
  const [working, setWorking] = useState(false);
  const coordsEdit = useAppSelector(state => state.coordsEdit);

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

        const dataRequest: IRequestClientOptimizeDTO = {
          origin: {
            latitude: coordsEdit.latitude,
            longitude: coordsEdit.longitude,
          },
          destination: {
            latitude: listOfClients[listOfClients.length - 1].latitude ?? 0,
            longitude: listOfClients[listOfClients.length - 1].longitude ?? 0,
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

        const dataRequest: IRequestClientOptimizeDTO = {
          origin: {
            latitude: coordsEdit.latitude,
            longitude: coordsEdit.longitude,
          },
          destination: {
            latitude: listOfClients[listOfClients.length - 1].latitude ?? 0,
            longitude: listOfClients[listOfClients.length - 1].longitude ?? 0,
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
    loadClientsByRoute();
  }, [loadClientsByRoute]);

  const handleSelectCustomer = (clientItem: ClientModel) => {
    dispatch(
      updateClientRouteList({
        ...clientItem,
        isSelected: !clientItem.isSelected,
      }),
    );
  };

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

      navigation.navigate('SaleRoute');

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

      navigation.navigate('SaleRoute');
    } catch (error) {
      console.error('Error adding clients to route:', error);
    } finally {
      setWorking(false);
    }
  };

  const handleAddNewSale = async (clientItem: ClientModel) => {
    // const selectedClients = clientRouteList.filter(client => client.isSelected);

    // if (selectedClients.length === 0) {
    //   return;
    // }

    // if (selectedClients.length > 1) {
    //   Alert.alert(
    //     'Atenção',
    //     'Por favor, selecione apenas um cliente para iniciar um novo pedido.',
    //   );
    //   return;
    // }

    // const clientSelectedForSale = selectedClients[0];

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
        console.log(
          'Cliente não encontrado na rota otimizada, usando cliente original',
        );
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

  return (
    <>
      <Working visible={working} />
      <VStack className="flex-1">
        <HomeHeader />
        <VStack className="flex-1 px-2 py-2">
          <HStack className="mb-2 justify-between items-center flex-row">
            <Heading size="sm" className="text-trueGray-100">
              {`Selecionados (${clientSelecteds.length})`}
            </Heading>
            <Text className="text-trueGray-400">{`${clientRouteList.length} clientes`}</Text>
          </HStack>

          <HStack className="mb-2 w-full bg-trueGray-600 p-2 rounded-md gap-2">
            <Input
              placeholder="Pesquise pelo cliente..."
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={setTextTyped}
              value={textTyped}
              w="$full"
            />
            <Button
              size="lg"
              onPress={() => {
                setTextTyped('');
              }}
              className="rounded-md w-12 h-12 gap-1">
              <ButtonIcon as={X} size="xl" />
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
            onPress={handleAddToRoute}
            className="rounded-md w-24 h-12 bg-green-700  active:bg-green-500 gap-1">
            <ButtonIcon as={Plus} size="lg" />
            <Text size="xs" className="text-trueGray-100">
              Rota
            </Text>
          </Button>
        </HStack>
      </VStack>
    </>
  );
}
