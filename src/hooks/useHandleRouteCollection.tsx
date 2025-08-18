import { type IRequestClientOptimizeDTO } from '@dtos/IRequestClientOptimizeDTO';
import {
  type OrderedClient,
  type RouteOptimizationResult,
} from '@dtos/IResponseClientOptimizeDTO';
import polyline from '@mapbox/polyline';
import { type CoordsModel } from '@models/CoordsModel';
import { type RouteCollectionItemsModel } from '@models/RouteCollectionItemsModel';
import { api } from '@services/api';
import { updateRouteCollectionEdit } from '@store/slice/routeCollection/routeCollectionEditSlice';
import { useAppSelector } from '@store/store';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export function useHandleRouteCollection() {
  const dispatch = useDispatch();
  const [routeInitialized, setRouteInitialized] = useState(false);
  const [rota, setRota] = useState<CoordsModel[]>([]);

  const existsRouteCollectionEdit = useAppSelector(
    state => state.existsRouteCollectionEdit,
  );
  const routeCollectionEdit = useAppSelector(
    state => state.routeCollectionEdit,
  );
  const coordsEdit = useAppSelector(state => state.coordsEdit);

  function orderClientsByRoute(
    routeCollection: RouteCollectionItemsModel[],
    rotaGoogle: OrderedClient[],
  ): RouteCollectionItemsModel[] {
    const listOrdenated: RouteCollectionItemsModel[] = [];
    rotaGoogle.forEach((deliveryItem, index) => {
      const clientData = routeCollection.find(c => c.id === deliveryItem.id);
      if (clientData) {
        const existsData = listOrdenated.find(c => c.id === clientData.id);
        if (!existsData) {
          listOrdenated.push({
            ...clientData,
            latitude: Number(deliveryItem?.latitude) ?? 0,
            longitude: Number(deliveryItem?.longitude) ?? 0,
          });
        }
      }
    });
    return listOrdenated;
  }

  const fetchRota = useCallback(async () => {
    if (
      !existsRouteCollectionEdit.exists &&
      routeCollectionEdit.RouteCollectionItems?.length > 0 &&
      !routeInitialized
    ) {
      const waypoints =
        routeCollectionEdit.RouteCollectionItems?.map(routeCollectionItem => ({
          id: routeCollectionItem.id,
          latitude: Number(routeCollectionItem.Client?.latitude) ?? 0,
          longitude: Number(routeCollectionItem.Client?.longitude) ?? 0,
          address: `${routeCollectionItem.Client?.streetName}, ${routeCollectionItem.Client?.streetNumber}, ${routeCollectionItem.Client?.city}, ${routeCollectionItem.Client?.state}, ${routeCollectionItem.Client?.zipCode}`,
        })) ?? [];

      const dataRequest: IRequestClientOptimizeDTO = {
        origin: {
          latitude: Number(coordsEdit.latitude),
          longitude: Number(coordsEdit.longitude),
        },
        destination: {
          latitude:
            routeCollectionEdit.RouteCollectionItems &&
            routeCollectionEdit.RouteCollectionItems.length > 0
              ? Number(
                  routeCollectionEdit.RouteCollectionItems[
                    routeCollectionEdit.RouteCollectionItems.length - 1
                  ].Client?.latitude ?? 0,
                )
              : 0,
          longitude:
            routeCollectionEdit.RouteCollectionItems &&
            routeCollectionEdit.RouteCollectionItems.length > 0
              ? Number(
                  routeCollectionEdit.RouteCollectionItems[
                    routeCollectionEdit.RouteCollectionItems.length - 1
                  ].Client?.longitude ?? 0,
                )
              : 0,
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

        const orderedColletionItems = orderClientsByRoute(
          routeCollectionEdit.RouteCollectionItems ?? [],
          orderedClients,
        );

        dispatch(
          updateRouteCollectionEdit({
            ...routeCollectionEdit,
            RouteCollectionItems: orderedColletionItems.map((item, index) => ({
              ...item,
              visitOrder: index + 1,
              latitude: Number(item.latitude) ?? 0,
              longitude: Number(item.longitude) ?? 0,
            })),
            RouteCollectionCoords: coordenadas,
          }),
        );
        setRouteInitialized(true);
      } catch (error) {
        // console.error('Erro ao buscar rota otimizada:', error);
      }
    } else if (existsRouteCollectionEdit.exists && !routeInitialized) {
      const coordenadas = routeCollectionEdit.RouteCollectionCoords?.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }));

      setRota(coordenadas);

      dispatch(
        updateRouteCollectionEdit({
          ...routeCollectionEdit,
        }),
      );
      setRouteInitialized(true);
    }
  }, [
    coordsEdit.latitude,
    coordsEdit.longitude,
    routeCollectionEdit,
    dispatch,
    existsRouteCollectionEdit.exists,
    routeInitialized,
  ]);

  return {
    fetchRota,
    routeInitialized,
    setRouteInitialized,
    rota,
  };
}
