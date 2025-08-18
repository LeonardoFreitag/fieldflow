import { type IRequestClientOptimizeDTO } from '@dtos/IRequestClientOptimizeDTO';
import {
  type OrderedClient,
  type RouteOptimizationResult,
} from '@dtos/IResponseClientOptimizeDTO';
import polyline from '@mapbox/polyline';
import { type CoordsModel } from '@models/CoordsModel';
import { type DeliveryItemModel } from '@models/DeliveryItemModel';
import { api } from '@services/api';
import { updateDeliveryRouteEdit } from '@store/slice/deliveryRoute/deliveryRouteEditSlice';
import { useAppSelector } from '@store/store';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export function useHandleDeliveryRoute() {
  const dispatch = useDispatch();
  const [routeInitialized, setRouteInitialized] = useState(false);
  const [rota, setRota] = useState<CoordsModel[]>([]);

  const existsDeliveryRouteEdit = useAppSelector(
    state => state.existsDeliveryRouteEdit,
  );
  const deliveryRouteEdit = useAppSelector(state => state.deliveryRouteEdit);
  const coordsEdit = useAppSelector(state => state.coordsEdit);

  function orderClientsByRoute(
    deliveryRoute: DeliveryItemModel[],
    rotaGoogle: OrderedClient[],
  ): DeliveryItemModel[] {
    const listOrdenated: DeliveryItemModel[] = [];
    rotaGoogle.forEach((deliveryItem, index) => {
      const clientData = deliveryRoute.find(c => c.id === deliveryItem.id);
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
      !existsDeliveryRouteEdit.exists &&
      deliveryRouteEdit.DeliveryItems?.length > 0 &&
      !routeInitialized
    ) {
      const waypoints =
        deliveryRouteEdit.DeliveryItems?.map(deliveryItem => ({
          id: deliveryItem.id ?? '',
          latitude: Number(deliveryItem.Client?.latitude) ?? 0,
          longitude: Number(deliveryItem.Client?.longitude) ?? 0,
          address: `${deliveryItem.Client?.streetName}, ${deliveryItem.Client?.streetNumber}, ${deliveryItem.Client?.city}, ${deliveryItem.Client?.state}, ${deliveryItem.Client?.zipCode}`,
        })) ?? [];

      const dataRequest: IRequestClientOptimizeDTO = {
        origin: {
          latitude: Number(coordsEdit.latitude),
          longitude: Number(coordsEdit.longitude),
        },
        destination: {
          latitude:
            deliveryRouteEdit.DeliveryItems &&
            deliveryRouteEdit.DeliveryItems.length > 0
              ? Number(
                  deliveryRouteEdit.DeliveryItems[
                    deliveryRouteEdit.DeliveryItems.length - 1
                  ].Client?.latitude ?? 0,
                )
              : 0,
          longitude:
            deliveryRouteEdit.DeliveryItems &&
            deliveryRouteEdit.DeliveryItems.length > 0
              ? Number(
                  deliveryRouteEdit.DeliveryItems[
                    deliveryRouteEdit.DeliveryItems.length - 1
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

        const orderedDelivery = orderClientsByRoute(
          deliveryRouteEdit.DeliveryItems ?? [],
          orderedClients,
        );

        dispatch(
          updateDeliveryRouteEdit({
            ...deliveryRouteEdit,
            DeliveryItems: orderedDelivery.map((item, index) => ({
              ...item,
              deliveryOrder: index + 1,
              latitude: Number(item.latitude) ?? 0,
              longitude: Number(item.longitude) ?? 0,
            })),
            DeliveryItemsCharge: orderedDelivery
              .slice()
              .reverse()
              .map((item, index) => ({
                ...item,
                deliveryOrder: index + 1,
                latitude: Number(item.latitude) ?? 0,
                longitude: Number(item.longitude) ?? 0,
              })),
            DeliveryRouteCoords: coordenadas,
          }),
        );
        setRouteInitialized(true);
      } catch (error) {
        // console.error('Erro ao buscar rota otimizada:', error);
      }
    } else if (existsDeliveryRouteEdit.exists && !routeInitialized) {
      // const waypoints =
      //   deliveryRouteEdit.DeliveryItems?.map(deliveryItem => ({
      //     id: deliveryItem.id,
      //     latitude: Number(deliveryItem.latitude) ?? 0,
      //     longitude: Number(deliveryItem.longitude) ?? 0,
      //     address: `${deliveryItem.Client?.streetName}, ${deliveryItem.Client?.streetNumber}, ${deliveryItem.Client?.city}, ${deliveryItem.Client?.state}, ${deliveryItem.Client?.zipCode}`,
      //   })) ?? [];

      // const dataRequest: IRequestClientOptimizeDTO = {
      //   origin: {
      //     latitude: Number(coordsEdit.latitude),
      //     longitude: Number(coordsEdit.longitude),
      //   },
      //   destination: {
      //     latitude:
      //       deliveryRouteEdit.DeliveryItems &&
      //       deliveryRouteEdit.DeliveryItems.length > 0
      //         ? Number(
      //             deliveryRouteEdit.DeliveryItems[
      //               deliveryRouteEdit.DeliveryItems.length - 1
      //             ].latitude ?? 0,
      //           )
      //         : 0,
      //     longitude:
      //       deliveryRouteEdit.DeliveryItems &&
      //       deliveryRouteEdit.DeliveryItems.length > 0
      //         ? Number(
      //             deliveryRouteEdit.DeliveryItems[
      //               deliveryRouteEdit.DeliveryItems.length - 1
      //             ].longitude ?? 0,
      //           )
      //         : 0,
      //   },
      //   waypoints,
      // };

      // try {
      //   const response = await api.post<RouteOptimizationResult>(
      //     '/client/routeOptimize',
      //     dataRequest,
      //   );

      //   const { orderedClients } = response.data;

      //   const { optimizedRoute: rotaGoogle } = response.data;

      //   const pontos = polyline.decode(rotaGoogle.overview_polyline.points);

      const coordenadas = deliveryRouteEdit.DeliveryRouteCoords.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }));
      setRota(coordenadas);

      // const orderedDelivery = orderClientsByRoute(
      //   deliveryRouteEdit.DeliveryItems ?? [],
      //   orderedClients,
      // );

      dispatch(
        updateDeliveryRouteEdit({
          ...deliveryRouteEdit,
          DeliveryItemsCharge:
            deliveryRouteEdit.DeliveryItems.slice().reverse(),
        }),
      );
      setRouteInitialized(true);
      // } catch (error) {
      //   // console.error('Erro ao buscar rota otimizada:', error);
      // }
    }
  }, [
    coordsEdit.latitude,
    coordsEdit.longitude,
    deliveryRouteEdit,
    dispatch,
    existsDeliveryRouteEdit.exists,
    routeInitialized,
  ]);

  return {
    fetchRota,
    routeInitialized,
    setRouteInitialized,
    rota,
  };
}
