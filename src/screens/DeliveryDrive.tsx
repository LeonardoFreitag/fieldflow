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
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonIcon,
  Heading,
  VStack,
  Text,
  HStack,
} from '@gluestack-ui/themed';
import { CaretLeft, RoadHorizon, Truck, UserList } from 'phosphor-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DoorClosed, ListCheck, Car, SaveAll } from 'lucide-react-native';
import { api } from '@services/api';
import { type DeliveryItemModel } from '@models/DeliveryItemModel';
import {
  addDeliveryRouteEdit,
  deleteDeliveryRouteEdit,
  updateDeliveryRouteEdit,
} from '@store/slice/deliveryRoute/deliveryRouteEditSlice';
import { addExistsDeliveryRouteEdit } from '@store/slice/deliveryRoute/existsDeliveryRouteEditSlice';
import { type DeliveryRouteModel } from '@models/DeliveryRouteModel';
import { type ICreateDeliveryRouteDTO } from '@dtos/ICreateDeliveryRouteDTO';
import { useHandleDeliveryRoute } from '@hooks/useHandleDeliveryRoute';
import { type IUpdateDeliveryRouteDTO } from '@dtos/IUpdateDeliveryRouteDTO';
import { addClientEdit } from '@store/slice/client/clientEditSlice';
import { addDeliveryItemEdit } from '@store/slice/deliveryRoute/deliveryItemEditSlice';
import { Working } from '@components/Working';

const { width, height } = Dimensions.get('window');

// Componente customizado para o ícone do carro
const CarMarker = () => (
  <View
    style={{
      backgroundColor: '#1E3A8A',
      borderRadius: 20,
      padding: 8,
      borderWidth: 3,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    }}
  >
    <Car size={24} color="#FFFFFF" />
  </View>
);

export const DeliveryDrive: React.FC = () => {
  const mapRef = useRef<MapView | null>(null);
  const dispatch = useDispatch();
  const [locationForegroundPermission, requestForegroundPermission] =
    useForegroundPermissions();
  const coordsEdit = useAppSelector(state => state.coordsEdit);
  const navigation = useNavigation();
  const deliveryRouteEdit = useAppSelector(state => state.deliveryRouteEdit);
  const existsDeliveryRouteEdit = useAppSelector(
    state => state.existsDeliveryRouteEdit,
  );
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showChargeDialog, setShowChargeDialog] = useState(false);

  const { rota, fetchRota, routeInitialized, setRouteInitialized } =
    useHandleDeliveryRoute();
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

  // useEffect(() => {
  //   if (mapRef.current && rota.length > 0) {
  //     mapRef.current.fitToCoordinates(rota, {
  //       edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  //       animated: true,
  //     });
  //   }
  // }, [rota]);
  useFocusEffect(
    useCallback(() => {
      if (mapRef.current && rota.length > 0) {
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
      case 'delivered':
        return 'green';
      case 'canceled':
        return 'red';
      case 'charged':
        return 'blue';
      case 'pending':
        return 'yellow';
      case 'not_delivered':
        return 'orange';
      default:
        return 'blue';
    }
  }, []);

  const getButtonStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'delivered':
        return '$green600';
      case 'canceled':
        return '$red600';
      case 'charged':
        return '$blue600';
      case 'pending':
        return '$yellow600';
      case 'not_delivered':
        return '$orange600';
      default:
        return '$blue600';
    }
  }, []);

  const iniciarNavegacao = useCallback((deliveryItem: DeliveryItemModel) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${deliveryItem.latitude},${deliveryItem.longitude}&travelmode=driving`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps');
    });
  }, []);

  const handleClose = useCallback(() => {
    setShowAlertDialog(false);
  }, []);

  const handleBackToDeliveryRoute = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'DeliveryRoute' }],
    });
  };

  const handleCallCheckIn = useCallback(
    async (deliveryItem: DeliveryItemModel) => {
      const client = deliveryItem.Client;
      if (!client) {
        Alert.alert(
          'Erro',
          'Cliente não encontrado para este item de entrega.',
        );
        return;
      }

      dispatch(addClientEdit(client));

      dispatch(addDeliveryItemEdit(deliveryItem));

      setShowAlertDialog(false);

      navigation.navigate('DeliveryFinalize');
    },
    [dispatch, navigation],
  );

  const listIsCompleted = useMemo(() => {
    if (!deliveryRouteEdit.DeliveryItems) {
      return false;
    }
    const existsPending = deliveryRouteEdit.DeliveryItems.some(
      item => item.status === 'pending' || item.status === 'charged',
    );
    return !existsPending;
  }, [deliveryRouteEdit.DeliveryItems]);

  const handleCompleteDeliveryRoute = useCallback(async () => {
    console.log('está chamando a função handleCompleteDeliveryRoute');
    if (!listIsCompleted) {
      Alert.alert(
        'Lista incompleta',
        'Não é possível completar a entrega com itens pendentes.',
      );
      return;
    }

    try {
      setWorking(true);
      const response = await api.patch<DeliveryRouteModel>(
        '/deliveryRoute/set-closed',
        {
          deliveryRouteId: deliveryRouteEdit.id,
          status: 'closed',
          endDate: new Date(),
        },
      );

      if (response.status !== 200) {
        Alert.alert('Erro', 'Não foi possível completar a rota de entrega.');
        return;
      }

      dispatch(deleteDeliveryRouteEdit());

      setRouteInitialized(false);

      navigation.reset({
        index: 0,
        routes: [{ name: 'DeliveryRoute' }],
      });
    } catch (error) {
      console.error('Erro ao completar rota de entrega:', error);
      Alert.alert('Erro', 'Não foi possível completar a rota de entrega.');
      return;
    } finally {
      setWorking(false);
    }

    console.log('completa viagem');
  }, [
    deliveryRouteEdit.id,
    dispatch,
    listIsCompleted,
    navigation,
    setRouteInitialized,
  ]);

  useEffect(() => {
    fetchRota();
  }, [fetchRota]);

  const handleCloseChargeDialog = useCallback(() => {
    setShowChargeDialog(false);
  }, []);

  const handleShowDialogCharge = useCallback(() => {
    setShowChargeDialog(true);
  }, []);

  const canFinishCharge = useMemo(() => {
    if (!deliveryRouteEdit.DeliveryItemsCharge) {
      return false;
    }

    const hasNotChargedItems = deliveryRouteEdit.DeliveryItemsCharge.some(
      item => item.status === 'pending',
    );
    return !hasNotChargedItems;
  }, [deliveryRouteEdit.DeliveryItemsCharge]);

  const handleSaveDeliveryRoute = useCallback(async () => {
    console.log(deliveryRouteEdit.DeliveryRouteCoords);
    const newDeliverRoute: ICreateDeliveryRouteDTO = {
      customerId: deliveryRouteEdit.customerId,
      routeId: deliveryRouteEdit.routeId,
      sellerId: deliveryRouteEdit.sellerId,
      startDate: deliveryRouteEdit.startDate,
      endDate: new Date(),
      status: 'open',
      completedCharge: false,
      DeliveryRouteCoords: deliveryRouteEdit.DeliveryRouteCoords,
      DeliveryItems: deliveryRouteEdit.DeliveryItems.map(item => ({
        customerId: item.customerId,
        clientId: item.clientId,
        clientCode: item.clientCode,
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
        deliveryOrder: item.deliveryOrder.toString(),
      })),
    };

    // console.log(newDeliverRoute);

    try {
      const response = await api.post<DeliveryRouteModel>(
        '/deliveryRoute',
        newDeliverRoute,
      );

      dispatch(
        updateDeliveryRouteEdit({
          ...deliveryRouteEdit,
          id: response.data.id,
          status: 'open',
          DeliveryItems: response.data.DeliveryItems,
          DeliveryItemsCharge: response.data.DeliveryItems.slice().reverse(),
          // route: coordenadas,
        }),
      );
      dispatch(addExistsDeliveryRouteEdit({ exists: true }));
    } catch (error) {
      console.error('Erro ao salvar rota de entrega:', error);
    }
  }, [deliveryRouteEdit, dispatch]);

  const handleCompleteCharge = useCallback(async () => {
    if (!deliveryRouteEdit.completedCharge) {
      if (!canFinishCharge) {
        Alert.alert(
          'Carregamento Incompleto',
          'Não é possível finalizar a rota com itens pendentes.',
        );
        return;
      }
      const updateDeliveryRoute: IUpdateDeliveryRouteDTO = {
        id: deliveryRouteEdit.id,
        customerId: deliveryRouteEdit.customerId,
        routeId: deliveryRouteEdit.routeId,
        sellerId: deliveryRouteEdit.sellerId,
        startDate: deliveryRouteEdit.startDate,
        endDate: deliveryRouteEdit.endDate,
        status: deliveryRouteEdit.status,
        completedCharge: true,
        dateTimeCoompletedCharge: new Date(),
      };

      try {
        const response = await api.patch<DeliveryRouteModel>(
          '/deliveryRoute',
          updateDeliveryRoute,
        );

        if (response.status !== 200) {
          Alert.alert('Erro', 'Não foi possível atualizar a rota de entrega.');
          return;
        }

        dispatch(
          updateDeliveryRouteEdit({
            ...deliveryRouteEdit,
            completedCharge: true,
            dateTimeCoompletedCharge:
              updateDeliveryRoute.dateTimeCoompletedCharge,
          }),
        );
      } catch (error) {
        console.error('Erro ao atualizar rota de entrega:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a rota de entrega.');
      }
    }
  }, [canFinishCharge, deliveryRouteEdit, dispatch]);

  const handleChargeConfirm = useCallback(
    async (deliveryItem: DeliveryItemModel) => {
      if (deliveryRouteEdit.status !== 'open') {
        Alert.alert(
          'Rota não iniciada',
          'Clique em Confirmar lista para iniciar a rota de entrega.',
        );
        return;
      }

      if (deliveryItem.status !== 'pending') {
        Alert.alert(
          'Atenção',
          'Este item já foi confirmado. Selecione outro item.',
        );
        return;
      }

      const updatedDeliveryItem = {
        ...deliveryItem,
        status: 'charged',
      };

      // console.log('id', deliveryItem.id);
      // console.log('status', updatedDeliveryItem.status);
      // console.log('data', new Date().toISOString());
      try {
        const response = await api.patch<DeliveryItemModel>(
          '/deliveryItems/status',
          {
            deliveryItemId: deliveryItem.id,
            status: 'charged',
            dateTimeCharged: new Date(),
          },
        );

        if (response.status !== 200) {
          Alert.alert('Erro', 'Não foi possível atualizar o status do item.');
          return;
        }

        const updatedDeliveryItemsCharge =
          deliveryRouteEdit.DeliveryItemsCharge.map(item =>
            item.id === deliveryItem.id ? updatedDeliveryItem : item,
          );

        const updatedDeliveryItems = deliveryRouteEdit.DeliveryItems.map(
          item => (item.id === deliveryItem.id ? updatedDeliveryItem : item),
        );

        dispatch(
          updateDeliveryRouteEdit({
            ...deliveryRouteEdit,
            DeliveryItems: updatedDeliveryItems,
            DeliveryItemsCharge: updatedDeliveryItemsCharge,
          }),
        );
      } catch (error) {
        console.error('Erro ao atualizar status do item:', error);
      }
    },
    [deliveryRouteEdit, dispatch],
  );

  return (
    <>
      {working && <Working visible={working} />}

      <VStack display="flex" position="relative" flex={1}>
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
              deliveryRouteEdit.DeliveryItems.map((deliveryItem, idx) => (
                <Marker
                  key={idx}
                  coordinate={{
                    latitude: Number(deliveryItem.latitude),
                    longitude: Number(deliveryItem.longitude),
                  }}
                  pinColor={getMarkerColor(deliveryItem.status)}
                  title={`${idx + 1}. ${deliveryItem.Client?.companyName}`}
                  onCalloutPress={() => {
                    iniciarNavegacao(deliveryItem);
                  }}
                />
              ))}
            {routeInitialized && rota.length > 0 && (
              <Polyline
                coordinates={rota}
                strokeColor="#2196F3"
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
          position="absolute"
          top="$12"
          left="$4"
          rounded="$md"
          opacity={0.4}
          onPress={handleBackToDeliveryRoute}
        >
          <ButtonIcon as={CaretLeft} size="xl" />
        </Button>
        {!deliveryRouteEdit.completedCharge && (
          <Button
            position="absolute"
            bottom="$12"
            left="$4"
            rounded="$md"
            opacity={0.4}
            onPress={handleShowDialogCharge}
          >
            <ButtonIcon as={Truck} size="xl" />
          </Button>
        )}
        <Button
          bg="$green600"
          $active-bg="$green700"
          variant="solid"
          position="absolute"
          top="$12"
          right="$4"
          rounded="$md"
          opacity={0.5}
          onPress={() => {
            // Encontra o próximo cliente com status "pending"
            const nextPendingClient = deliveryRouteEdit.DeliveryItems.find(
              deliveryItem => deliveryItem.status === 'pending',
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
              deliveryRouteEdit.DeliveryItems.length > 0 &&
              mapRef.current
            ) {
              // Fallback: se não há clientes pendentes, vai para o primeiro cliente
              mapRef.current.animateToRegion(
                {
                  latitude: Number(deliveryRouteEdit.DeliveryItems[0].latitude),
                  longitude: Number(
                    deliveryRouteEdit.DeliveryItems[0].longitude,
                  ),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000,
              );
            }
          }}
        >
          <ButtonIcon as={RoadHorizon} size="xl" />
        </Button>

        {existsDeliveryRouteEdit.exists &&
          deliveryRouteEdit.completedCharge && (
            <Button
              bg="$orange600"
              $active-bg="$orange800"
              position="absolute"
              bottom="$12"
              right="$4"
              rounded="$md"
              opacity={0.4}
              onPress={() => {
                setShowAlertDialog(true);
              }}
            >
              <ButtonIcon as={UserList} size="xl" />
            </Button>
          )}
      </VStack>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="lg">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <VStack gap="$2">
              <Heading size="md">{`Lista em ordem de entrega`}</Heading>
              <Text>Selecione para realizar a entrega</Text>
            </VStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            {deliveryRouteEdit.DeliveryItems.length > 0 &&
              deliveryRouteEdit.DeliveryItems.map((item, index) => (
                <VStack style={styles.itemContainer} key={item.id}>
                  <Button
                    width="100%"
                    bg={getButtonStatusColor(item.status)}
                    onPress={async () => {
                      await handleCallCheckIn(item);
                    }}
                    position="relative"
                  >
                    {(item.NotDeliveredItems?.length ?? 0) > 0 && (
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
                          {item.NotDeliveredItems?.length ?? 0}
                        </Text>
                      </View>
                    )}
                    <Text
                      numberOfLines={1}
                      textAlign="center"
                      color="$white"
                      size="md"
                      style={styles.buttonText}
                    >
                      {index + 1}. {item.Client?.companyName}
                    </Text>
                  </Button>
                </VStack>
              ))}
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack
              gap="$4"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              {listIsCompleted && (
                <Button
                  bg="$blue600"
                  $active-bg="$blue800"
                  rounded="$md"
                  opacity={0.6}
                  onPress={handleCompleteDeliveryRoute}
                >
                  <ButtonIcon as={ListCheck} size="xl" />
                </Button>
              )}

              <Button
                bg="$red600"
                $active-bg="$red800"
                rounded="$md"
                opacity={0.6}
                onPress={handleClose}
              >
                <ButtonIcon as={DoorClosed} size="xl" />
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        isOpen={showChargeDialog}
        onClose={handleCloseChargeDialog}
        size="lg"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <VStack gap="$2">
              <Heading size="md">{`Ordem de carregamento`}</Heading>
              <Text>Selecione confirmar o carregamento</Text>
            </VStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            {routeInitialized &&
              deliveryRouteEdit.DeliveryItemsCharge?.length > 0 &&
              deliveryRouteEdit.DeliveryItemsCharge?.map((item, index) => (
                <VStack style={styles.itemContainer} key={item.id}>
                  <Button
                    width="100%"
                    bg={
                      item.status === 'pending'
                        ? '$yellow600'
                        : item.status === 'charged'
                          ? '$blue600'
                          : '$blue600'
                    }
                    onPress={async () => {
                      await handleChargeConfirm(item);
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      textAlign="center"
                      color="$white"
                      size="md"
                      style={styles.buttonText}
                    >
                      {index + 1}. {item.Client?.companyName}
                    </Text>
                  </Button>
                </VStack>
              ))}
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack
              gap="$4"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              {deliveryRouteEdit.status === 'created' && (
                <Button
                  bg="$green600"
                  $active-bg="$green800"
                  rounded="$md"
                  justifyContent="center"
                  gap="$2"
                  onPress={async () => {
                    await handleSaveDeliveryRoute();
                  }}
                >
                  <ButtonIcon as={SaveAll} size="xl" />
                  <Text color="$white" size="sm">
                    Confirmar lista
                  </Text>
                </Button>
              )}
              {deliveryRouteEdit.status === 'open' &&
                !deliveryRouteEdit.completedCharge && (
                  <Button
                    bg="$green600"
                    $active-bg="$green800"
                    rounded="$md"
                    justifyContent="center"
                    gap="$2"
                    onPress={async () => {
                      await handleCompleteCharge();
                    }}
                  >
                    <ButtonIcon as={SaveAll} size="xl" />
                    <Text color="$white" size="sm">
                      Finalizar carregamento
                    </Text>
                  </Button>
                )}
              <Button
                bg="$red600"
                $active-bg="$red800"
                rounded="$md"
                opacity={0.6}
                onPress={handleCloseChargeDialog}
              >
                <ButtonIcon as={DoorClosed} size="xl" />
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
