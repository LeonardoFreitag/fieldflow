import { HStack } from '@ui/hstack';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { Heading } from '@ui/heading';
import { Button, ButtonIcon } from '@ui/button';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@ui/alert-dialog';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Dimensions, Linking, Alert, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {
  LocationAccuracy,
  type LocationSubscription,
  useForegroundPermissions,
  watchPositionAsync,
} from 'expo-location';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@store/store';
import { addCoordsEdit } from '@store/slice/coords/coordsEditSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Binoculars,
  ChevronLeft,
  Contact,
  DoorClosed,
  ListCheck,
  SaveAll,
} from 'lucide-react-native';
import { api } from '@services/api';
import { type RouteCollectionItemsModel } from '@models/RouteCollectionItemsModel';
import { type DeliveryRouteModel } from '@models/DeliveryRouteModel';
import { addClientEdit } from '@store/slice/client/clientEditSlice';
import { Working } from '@components/Working';
import { addRouteCollectionItemsEdit } from '@store/slice/routeCollection/routeCollectionItemsEditSlice';
import {
  deleteRouteCollectionEdit,
  updateRouteCollectionEdit,
} from '@store/slice/routeCollection/routeCollectionEditSlice';
import { type ICreateRouteCollectionDTO } from '@dtos/ICreateRouteCollectionDTO';
import { type RouteCollectionModel } from '@models/RouteCollectionModel';
import { addExistsRouteCollectionEdit } from '@store/slice/routeCollection/existsRouteCollectionEditSlice';
import { useHandleRouteCollection } from '@hooks/useHandleRouteCollection';
import { CarMarker } from '@/components/CarMarker';
import { ReceberMarker } from '@/components/ReceberMarker';

const { width, height } = Dimensions.get('window');

export const ReceberDrive: React.FC = () => {
  const mapRef = useRef<MapView | null>(null);
  const dispatch = useDispatch();
  const [locationForegroundPermission, requestForegroundPermission] =
    useForegroundPermissions();
  const coordsEdit = useAppSelector(state => state.coordsEdit);
  const navigation = useNavigation();
  const routeCollectionEdit = useAppSelector(
    state => state.routeCollectionEdit,
  );
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const { rota, fetchRota, routeInitialized, setRouteInitialized } =
    useHandleRouteCollection();
  const [working, setWorking] = useState(false);

  useEffect(() => {
    requestForegroundPermission();

    return () => {};
  }, [requestForegroundPermission]);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }
    let subscription: LocationSubscription | null = null;
    const startWatching = async () => {
      subscription = await watchPositionAsync(
        {
          accuracy: LocationAccuracy.High,
          timeInterval: 5000,
          distanceInterval: 20,
        },
        location => {
          dispatch(addCoordsEdit(location.coords));
        },
      );
    };
    startWatching();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [dispatch, locationForegroundPermission?.granted]);

  useFocusEffect(
    useCallback(() => {
      if (mapRef.current && rota && rota.length > 0) {
        mapRef.current.fitToCoordinates(rota, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }, [rota]),
  );

  // Executa handleSaveTravel automaticamente após reabrir a aplicação com viagem existente

  const getMarkerColor = useCallback((status: string | undefined) => {
    switch (status) {
      case 'visited':
        return 'orange';
      case 'visited_received':
        return 'green';
      case 'open':
        return 'blue';
      case 'not_visited':
        return 'red';
      default:
        return 'blue';
    }
  }, []);

  const getButtonStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'visited':
        return 'bg-tertiary-400';
      case 'not_visited':
        return 'bg-error-400';
      case 'open':
        return 'bg-info-300';
      case 'visited_received':
        return 'bg-success-400';
      default:
        return 'bg-info-300';
    }
  }, []);

  const iniciarNavegacao = useCallback(
    (routeCollectionItem: RouteCollectionItemsModel) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${routeCollectionItem.latitude},${routeCollectionItem.longitude}&travelmode=driving`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o Google Maps');
      });
    },
    [],
  );

  const handleClose = useCallback(() => {
    setShowAlertDialog(false);
  }, []);

  const handleBackToDeliveryRoute = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'ReceberRoute' }],
    });
  };

  const handleCallCheckIn = useCallback(
    async (routeCollectionItem: RouteCollectionItemsModel) => {
      const client = routeCollectionItem.Client;
      if (!client) {
        Alert.alert(
          'Erro',
          'Cliente não encontrado para este item de entrega.',
        );
        return;
      }

      if (routeCollectionEdit.status === 'created') {
        // Salva a rota antes de ir para o check-in
        Alert.alert(
          'Salvar Rota',
          'Você precisa salvar a rota antes de iniciar o check-in.',
        );
        return;
      }

      dispatch(addClientEdit(client));

      dispatch(
        addRouteCollectionItemsEdit({
          ...routeCollectionItem,
          checkInDate: new Date(),
        }),
      );

      setShowAlertDialog(false);

      navigation.navigate('ReceberFinalize');
    },
    [dispatch, navigation, routeCollectionEdit.status],
  );

  const listIsCompleted = useMemo(() => {
    if (!routeCollectionEdit.RouteCollectionItems) {
      return false;
    }
    const existsPending = routeCollectionEdit.RouteCollectionItems.some(
      item => item.status === 'pending',
    );
    return !existsPending;
  }, [routeCollectionEdit.RouteCollectionItems]);

  const handleCompleteRouteCollection = useCallback(async () => {
    if (!listIsCompleted) {
      Alert.alert(
        'Lista incompleta',
        'Não é possível completar a cobrança com itens pendentes.',
      );
      return;
    }

    try {
      setWorking(true);
      const response = await api.patch<DeliveryRouteModel>(
        '/routeCollection/set-closed',
        {
          routeCollectionId: routeCollectionEdit.id,
          endDate: new Date(),
        },
      );

      if (response.status !== 200) {
        Alert.alert('Erro', 'Não foi possível completar a rota de cobrança.');
        return;
      }

      dispatch(deleteRouteCollectionEdit());

      setRouteInitialized(false);

      navigation.reset({
        index: 0,
        routes: [{ name: 'ReceberRoute' }],
      });
    } catch (error) {
      console.error('Erro ao completar rota de entrega:', error);
      Alert.alert('Erro', 'Não foi possível completar a rota de entrega.');
      return;
    } finally {
      setWorking(false);
    }
  }, [
    dispatch,
    listIsCompleted,
    navigation,
    routeCollectionEdit.id,
    setRouteInitialized,
  ]);

  const handleSaveRouteCollection = useCallback(async () => {
    const newRouteCollection: ICreateRouteCollectionDTO = {
      customerId: routeCollectionEdit.customerId,
      routeId: routeCollectionEdit.routeId,
      sellerId: routeCollectionEdit.sellerId,
      startDate: routeCollectionEdit.startDate,
      endDate: new Date(),
      status: 'open',
      RouteCollectionCoords: routeCollectionEdit.RouteCollectionCoords ?? [],
      RouteCollectionItems: routeCollectionEdit.RouteCollectionItems.map(
        item => ({
          customerId: item.customerId,
          clientId: item.clientId,
          clientCode: item.clientCode,
          receberId: item.receberId,
          orderId: item.orderId,
          orderNumber: item.orderNumber,
          orderDate: item.orderDate,
          invoiceId: item.invoiceId,
          notes: item.notes,
          status: item.status,
          nfeNumber: item.nfeNumber,
          nfeUrl: item.nfeUrl,
          latitude: item.latitude,
          longitude: item.longitude,
          visitOrder: item.visitOrder,
        }),
      ),
    };

    try {
      const response = await api.post<RouteCollectionModel>(
        '/routeCollection',
        newRouteCollection,
      );

      dispatch(
        updateRouteCollectionEdit({
          ...newRouteCollection,
          id: response.data.id,
          status: 'open',
          RouteCollectionItems: response.data.RouteCollectionItems,
        }),
      );
      dispatch(addExistsRouteCollectionEdit({ exists: true }));
    } catch (error) {
      console.error('Erro ao salvar rota de cobrança:', error);
    }
  }, [
    dispatch,
    routeCollectionEdit.RouteCollectionCoords,
    routeCollectionEdit.RouteCollectionItems,
    routeCollectionEdit.customerId,
    routeCollectionEdit.routeId,
    routeCollectionEdit.sellerId,
    routeCollectionEdit.startDate,
  ]);

  useEffect(() => {
    fetchRota();
  }, [fetchRota]);

  return (
    <>
      {working && <Working visible={working} />}
      <VStack className="flex relative flex-1">
        {coordsEdit && (
          <MapView
            ref={mapRef}
            style={styles.map}
            zoomEnabled={true}
            initialRegion={{
              latitude: coordsEdit.latitude,
              longitude: coordsEdit.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {routeInitialized &&
              routeCollectionEdit.RouteCollectionItems &&
              routeCollectionEdit.RouteCollectionItems.map((receber, idx) => (
                <Marker
                  key={idx}
                  coordinate={{
                    latitude: Number(receber.latitude),
                    longitude: Number(receber.longitude),
                  }}
                  // pinColor={getMarkerColor(receber.status)}
                  title={`${idx + 1}. ${receber.Client?.companyName}`}
                  onCalloutPress={() => {
                    iniciarNavegacao(receber);
                  }}
                >
                  <ReceberMarker
                    markerStatus={receber.status ? receber.status : 'pending'}
                  />
                </Marker>
              ))}
            {routeInitialized && rota && rota.length > 0 && (
              <Polyline
                coordinates={rota}
                strokeColor="#f35221"
                strokeWidth={3}
              />
            )}
            {coordsEdit && (
              <Marker coordinate={coordsEdit} title="Minha posição">
                <CarMarker />
              </Marker>
            )}
          </MapView>
        )}
        <Button
          onPress={handleBackToDeliveryRoute}
          className="absolute top-12 left-4 rounded-md opacity-40"
        >
          <ButtonIcon
            as={ChevronLeft}
            size="xl"
            className="text-typography-0"
          />
        </Button>
        <Button
          variant="solid"
          onPress={() => {
            // Encontra o próximo cliente com status "pending"
            const nextPendingClient =
              routeCollectionEdit.RouteCollectionItems.find(
                routeCollectionItem => routeCollectionItem.status === 'pending',
              );

            if (nextPendingClient && mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude: Number(nextPendingClient.latitude),
                  longitude: Number(nextPendingClient.longitude),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000,
              ); // duração em ms
            } else if (
              routeCollectionEdit.RouteCollectionItems.length > 0 &&
              mapRef.current
            ) {
              // Fallback: se não há clientes pendentes, vai para o primeiro cliente
              mapRef.current.animateToRegion(
                {
                  latitude: Number(
                    routeCollectionEdit.RouteCollectionItems[0].latitude,
                  ),
                  longitude: Number(
                    routeCollectionEdit.RouteCollectionItems[0].longitude,
                  ),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000,
              );
            }
          }}
          className="bg-success-400  active:bg-success-500 absolute top-12 right-4 rounded-md opacity-70"
        >
          <ButtonIcon as={Binoculars} size="xl" className="text-typography-0" />
        </Button>

        <Button
          onPress={() => {
            setShowAlertDialog(true);
          }}
          className="bg-tertiary-400  active:bg-tertiary-500 absolute bottom-12 right-4 rounded-md opacity-70"
        >
          <ButtonIcon as={Contact} size="xl" className="text-typography-0" />
        </Button>
      </VStack>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="lg">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <VStack className="gap-2">
              <Heading size="md">{`Rota de visita`}</Heading>
              <Text>Selecione para informar a visita</Text>
            </VStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            {routeCollectionEdit.RouteCollectionItems &&
              routeCollectionEdit.RouteCollectionItems.length > 0 &&
              routeCollectionEdit.RouteCollectionItems.map((item, index) => (
                <VStack style={styles.itemContainer} key={item.id}>
                  <Button
                    onPress={async () => {
                      await handleCallCheckIn(item);
                    }}
                    className={`${getButtonStatusColor(item.status)} w-[100%] relative `}
                  >
                    {item.RouteCollectionNotFoundClient.length > 0 && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'red',
                          borderRadius: 8,
                          width: 16,
                          height: 16,
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 1,
                        }}
                      >
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold',
                          }}
                        >
                          {item.RouteCollectionNotFoundClient.length}
                        </Text>
                      </View>
                    )}
                    <Text
                      numberOfLines={1}
                      size="md"
                      style={styles.buttonText}
                      className="text-center text-white"
                    >
                      {index + 1}. {item.Client?.companyName}
                    </Text>
                  </Button>
                </VStack>
              ))}
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack className="gap-4 justify-between items-center flex-wrap">
              {listIsCompleted && (
                <Button
                  onPress={handleCompleteRouteCollection}
                  className="bg-info-400  active:bg-info-500 rounded-md opacity-70"
                >
                  <ButtonIcon
                    as={ListCheck}
                    size="xl"
                    className="text-typography-0"
                  />
                </Button>
              )}
              {routeCollectionEdit.status === 'created' && (
                <Button
                  onPress={async () => {
                    await handleSaveRouteCollection();
                  }}
                  className="bg-success-400  active:bg-success-500 rounded-md opacity-70"
                >
                  <ButtonIcon
                    as={SaveAll}
                    size="xl"
                    className="text-typography-900"
                  />
                </Button>
              )}
              <Button
                onPress={handleClose}
                className="bg-error-400 active:bg-error-400 rounded-md opacity-60"
              >
                <ButtonIcon
                  as={DoorClosed}
                  size="xl"
                  className="text-typography-900"
                />
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  containerBottomSheet: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
    width: '100%',
  },
  list: {
    flexGrow: 1,
    padding: 2,
    alignItems: 'center',
  },
  itemContainer: {
    flex: 1,
    margin: 8,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    width: 250,
    margin: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 10,
  },
});
