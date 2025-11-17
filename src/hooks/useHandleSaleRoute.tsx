import { useDispatch } from 'react-redux';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { addCanChangeRouteEdit } from '@store/slice/travel/canChangeRouteEditSlice';
import { addExistsTravelEdit } from '@store/slice/travel/existsTravelEditSlice';
import { addTravelEdit } from '@store/slice/travel/travelEditSlice';
import { type ClientModel } from '@models/ClientModel';
import { type TravelModel, type TravelClientsModel } from '@models/TravelModel';
import { loadClientList } from '@store/slice/client/clientListSlice';
import { CreateTravel } from '@storage/travel/createTravelRoute';
import { useAppSelector } from '@store/store';
import { useCallback, useState } from 'react';
import { type IRequestClientOptimizeDTO } from '@dtos/IRequestClientOptimizeDTO';
import {
  type OrderedClient,
  type RouteOptimizationResult,
} from '@dtos/IResponseClientOptimizeDTO';
import polyline from '@mapbox/polyline';
import { addClientEdit } from '@store/slice/client/clientEditSlice';
import { addTravelClientEdit } from '@store/slice/travel/travelClientEditSlice';
import { Alert } from 'react-native';
import { loadAllClientList } from '@store/slice/client/allClientListSlice';
import { loadClientAdHocList } from '@store/slice/client/clientAdHocListSlice';

export function useHandleSaleRoute() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [rota, setRota] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);
  const canChangeRouteEdit = useAppSelector(state => state.canChangeRouteEdit);
  const existsTravelEdit = useAppSelector(state => state.existsTravelEdit);
  const travelEdit = useAppSelector(state => state.travelEdit);
  const clientList = useAppSelector(state => state.clientList);
  const clientAdHocList = useAppSelector(state => state.clientAdHocList);
  const [routeInitialized, setRouteInitialized] = useState(false);
  const coordsEdit = useAppSelector(state => state.coordsEdit);
  const [shouldAutoSaveAfterReopen, setShouldAutoSaveAfterReopen] =
    useState(false);

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
  const handleSaleRoute = useCallback(async (): Promise<TravelModel> => {
    try {
      const response = await api.get<TravelModel>('/travel/current', {
        params: {
          customerId: user?.user.customerId,
          routeId: user?.user.routeId,
        },
      });
      if (response.data) {
        dispatch(addExistsTravelEdit({ exists: true }));
        dispatch(addCanChangeRouteEdit({ canChangeRoute: false }));
        dispatch(addTravelEdit(response.data));
        const recoveryClientList: ClientModel[] = (
          response.data.TravelClients ?? []
        )
          .filter((client: TravelClientsModel) => client.Client)
          .map((client: TravelClientsModel) => {
            if (!client.Client) {
              throw new Error('Client is undefined after filtering');
            }
            const clientData = client.Client;
            return {
              id: clientData.id,
              customerId: clientData.customerId,
              code: clientData.code,
              companyName: clientData.companyName,
              comercialName: clientData.comercialName,
              zipCode: clientData.zipCode,
              streetName: clientData.streetName,
              streetNumber: clientData.streetNumber,
              neighborhood: clientData.neighborhood,
              complement: clientData.complement,
              cnpj: clientData.cnpj,
              ie: clientData.ie,
              cityCode: clientData.cityCode,
              city: clientData.city,
              stateCode: clientData.stateCode,
              state: clientData.state,
              financialPendency: clientData.financialPendency,
              isNew: clientData.isNew,
              isActivated: clientData.isActivated,
              sellerId: clientData.sellerId,
              phone: clientData.phone,
              cellphone: clientData.cellphone,
              email: clientData.email,
              latitude: client.latitude ?? clientData.latitude,
              longitude: client.longitude ?? clientData.longitude,
              aproximateCoordenates: clientData.aproximateCoordenates,
              riscoCredito: clientData.riscoCredito,
              scoreInterno: clientData.scoreInterno,
              prazoPagamentoDias: clientData.prazoPagamentoDias,
              routeId: clientData.routeId,
              frequenciaVisitaId: clientData.frequenciaVisitaId,
              diaSemana: clientData.diaSemana,
              paymentFormId: clientData.paymentFormId,
              lastVisitDate: clientData.lastVisitDate,
              lastSaleDate: clientData.lastSaleDate,
              tableCode: clientData.tableCode,
              createdAt: clientData.createdAt,
              updatedAt: clientData.updatedAt,
              isSelected: true,
              status: client.status,
              dataFrom: client.dataFrom,
              ClientContact: clientData.ClientContact ?? [],
              ClientPaymentForm: clientData.ClientPaymentForm ?? [],
              LastOrders: clientData.LastOrders ?? [],
              ClientPhotos: clientData.ClientPhotos ?? [],
            };
          });
        dispatch(
          loadClientAdHocList(
            recoveryClientList.filter(client => client.dataFrom === 'ad_hoc'),
          ),
        );
        dispatch(loadClientList(recoveryClientList));
        return response.data;
      }
    } catch (error) {
      dispatch(addExistsTravelEdit({ exists: false }));
      dispatch(addCanChangeRouteEdit({ canChangeRoute: true }));
    }
    dispatch(addExistsTravelEdit({ exists: false }));
    dispatch(addCanChangeRouteEdit({ canChangeRoute: true }));
    return {} as TravelModel;
  }, [dispatch, user?.user.customerId, user?.user.routeId]);

  const handleCreateAndSaveTravel = useCallback(
    async (
      listOfClients: ClientModel[],
      dataFrom: 'route' | 'manual' | 'ad_hoc' | undefined,
    ): Promise<TravelModel> => {
      if (canChangeRouteEdit.canChangeRoute) {
        const newTravel: TravelModel = {
          customerId: user?.user.customerId ?? '',
          userId: user?.user.id ?? '',
          routeId: user?.user.routeId ?? '',
          startDate: new Date(),
          endDate: new Date(),
          notes: '',
          status: 'open',
          TravelClients: listOfClients.map((cliente, index) => ({
            clientId: cliente.id,
            clientCode: cliente.code,
            orderInRoute: index + 1,
            latitude: cliente.latitude ?? 0,
            longitude: cliente.longitude ?? 0,
            checkInDate: new Date(),
            checkOutDate: new Date(),
            notes: '',
            status: cliente.status ?? 'pending',
            dataFrom: dataFrom ?? 'route',
          })),
        };

        console.log('New Travel to be created:', newTravel);

        try {
          const response = await api.post<TravelModel>('/travel', newTravel);

          const travelLocalSaved: TravelModel = {
            ...response.data,
            orderedClients: listOfClients,
            route: rota.map(coord => ({
              latitude: coord.latitude,
              longitude: coord.longitude,
            })),
          };

          await CreateTravel(travelLocalSaved);
          dispatch(addTravelEdit(travelLocalSaved));
          dispatch(addExistsTravelEdit({ exists: true }));
          dispatch(addCanChangeRouteEdit({ canChangeRoute: false }));

          return travelLocalSaved;
        } catch (error) {
          console.error('Erro ao criar viagem:', error);
        }
      } else {
        const travelLocalSaved: TravelModel = {
          ...travelEdit,
          orderedClients: listOfClients,
          route: rota.map(coord => ({
            latitude: coord.latitude,
            longitude: coord.longitude,
          })),
          TravelClients: listOfClients.map((cliente, index) => ({
            clientId: cliente.id,
            clientCode: cliente.code,
            orderInRoute: index + 1,
            latitude: cliente.latitude ?? null,
            longitude: cliente.longitude ?? null,
            checkInDate: new Date(),
            checkOutDate: new Date(),
            notes: '',
            status: cliente.status ?? 'pending',
            dataFrom: cliente.dataFrom ?? 'route',
          })),
        };

        await CreateTravel(travelLocalSaved);
        dispatch(addTravelEdit(travelLocalSaved));
        dispatch(addExistsTravelEdit({ exists: true }));
        dispatch(addCanChangeRouteEdit({ canChangeRoute: false }));

        return travelLocalSaved;
      }
      return travelEdit;
    },
    [
      canChangeRouteEdit.canChangeRoute,
      user?.user.customerId,
      user?.user.id,
      user?.user.routeId,
      rota,
      travelEdit,
      dispatch,
    ],
  );

  const fetchRota = async () => {
    if (existsTravelEdit.exists && clientList.length > 0 && !routeInitialized) {
      const waypoints = clientList
        .filter(client => client.dataFrom !== 'ad_hoc')
        .map(client => ({
          id: client.id,
          latitude: client.latitude ?? 0,
          longitude: client.longitude ?? 0,
          address: `${client.streetName}, ${client.streetNumber}, ${client.city}, ${client.state}, ${client.zipCode}`,
        }));

      const destinationItem = clientList[clientList.length - 1];

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
      if (waypoints.length === 0) {
        return;
      }
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
          clientList,
          orderedClients,
        );

        dispatch(loadClientList(clientesOrdenados));
        dispatch(loadAllClientList([...clientesOrdenados, ...clientsAdHoc]));
        setRouteInitialized(true);
      } catch (error) {
        // console.error('Erro ao buscar rota otimizada:', error);
      }
    } else if (!existsTravelEdit.exists && !routeInitialized) {
      const waypoints = clientList
        .filter(client => client.dataFrom !== 'ad_hoc')
        .map(client => ({
          id: client.id,
          latitude: client.latitude ?? 0,
          longitude: client.longitude ?? 0,
          address: `${client.streetName}, ${client.streetNumber}, ${client.city}, ${client.state}, ${client.zipCode}`,
        }));

      if (waypoints.length === 0) {
        return;
      }

      const destinationItem = clientList[clientList.length - 1];

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
          clientList,
          orderedClients,
        );

        dispatch(loadClientList(clientesOrdenados));
        dispatch(loadAllClientList([...clientesOrdenados, ...clientsAdHoc]));
        setRouteInitialized(true);
      } catch (error) {
        // console.error('Erro ao buscar rota otimizada:', error);
      }
    }
  };

  const handleCheckIn = async (cliente: ClientModel) => {
    try {
      const response = await api.get<ClientModel>('/client/details', {
        params: {
          clientId: cliente.id,
        },
      });

      const clientCheckIn = travelEdit.TravelClients?.find(
        c => c.clientId === cliente.id,
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

  return {
    handleSaleRoute,
    handleCreateAndSaveTravel,
    fetchRota,
    shouldAutoSaveAfterReopen,
    setShouldAutoSaveAfterReopen,
    routeInitialized,
    setRouteInitialized,
    rota,
    setRota,
    handleCheckIn,
  };
}
