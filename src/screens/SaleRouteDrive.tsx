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
// import { RoadHorizon, UserList } from 'phosphor-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { type ClientModel } from '@models/ClientModel';
import { api } from '@services/api';
import { type TravelModel } from '@models/TravelModel';
import { resetTravelEdit } from '@store/slice/travel/travelEditSlice';
import {
  DoorClosed,
  ListCheck,
  SaveAll,
  Car,
  ChevronLeft,
  UserPlus2,
  Home,
  Binoculars,
  Contact,
} from 'lucide-react-native';
import { addExistsTravelEdit } from '@store/slice/travel/existsTravelEditSlice';
import { resetClientEdit } from '@store/slice/client/clientEditSlice';
import { resetClientList } from '@store/slice/client/clientListSlice';
import { resetTravelClientEdit } from '@store/slice/travel/travelClientEditSlice';
import { ClearTravel } from '@storage/travel/clearTravelRoute';
import { resetTravelClientOrderEdit } from '@store/slice/travel/travelClientOrderEditSlice';
import { resetTravelClientOrderItemsEdit } from '@store/slice/travel/travelClientOrderItemEditSlice';
import { resetTravelList } from '@store/slice/travel/travelListSlice';
import { addCanChangeRouteEdit } from '@store/slice/travel/canChangeRouteEditSlice';
import { useHandleSaleRoute } from '@hooks/useHandleSaleRoute';
import { HouseMarker } from '@/components/HouseMarker';
import { CarMarker } from '@/components/CarMarker';

const { width, height } = Dimensions.get('window');

// Componente customizado para o ícone do carro
// const CarMarker = () => (
//   <View
//     style={{
//       backgroundColor: '#1E3A8A',
//       borderRadius: 20,
//       padding: 8,
//       borderWidth: 3,
//       borderColor: '#FFFFFF',
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.3,
//       shadowRadius: 4,
//       elevation: 5,
//     }}
//   >
//     <Car size={15} color="#FFFFFF" />
//   </View>
// );

// // Componente customizado para o ícone de cliente (casinha)
// const HouseMarker: React.FC<{ status?: string }> = ({ status }) => {
//   let bg = '#2563EB'; // azul (pending)
//   if (status === 'visited') bg = '#16A34A'; // verde
//   if (status === 'not_visited') bg = '#DC2626'; // vermelho

//   return (
//     <View
//       style={{
//         backgroundColor: bg,
//         borderRadius: 12,
//         padding: 6,
//         borderWidth: 2,
//         borderColor: '#FFFFFF',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.25,
//         shadowRadius: 2,
//         elevation: 3,
//       }}
//     >
//       <Home size={15} color="#FFFFFF" />
//     </View>
//   );
// };

export const SaleRouteDrive: React.FC = () => {
  const mapRef = useRef<MapView | null>(null);
  const dispatch = useDispatch();
  const [locationForegroundPermission, requestForegroundPermission] =
    useForegroundPermissions();
  const coordsEdit = useAppSelector(state => state.coordsEdit);
  const navigation = useNavigation();

  // const [clientesOrdenados, setClientesOrdenados] = useState<ClientModel[]>([]);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const canChangeRouteEdit = useAppSelector(state => state.canChangeRouteEdit);

  const clientList = useAppSelector(state => state.clientList);
  const allClientList = useAppSelector(state => state.allClientList);
  const travelEdit = useAppSelector(state => state.travelEdit);
  const existsTravelEdit = useAppSelector(state => state.existsTravelEdit);

  const {
    fetchRota,
    shouldAutoSaveAfterReopen,
    setShouldAutoSaveAfterReopen,
    rota,
    routeInitialized,
    handleCreateAndSaveTravel,
    handleCheckIn,
  } = useHandleSaleRoute();

  useEffect(() => {
    // Solicita permissão de localização ao montar o componente
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

  useEffect(() => {
    fetchRota();
  }, [fetchRota]);

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
  useEffect(() => {
    if (
      !canChangeRouteEdit.canChangeRoute &&
      shouldAutoSaveAfterReopen &&
      routeInitialized &&
      rota.length > 0 &&
      clientList.length > 0
    ) {
      setShouldAutoSaveAfterReopen(false);
      handleCreateAndSaveTravel(clientList, 'route');
      dispatch(addCanChangeRouteEdit({ canChangeRoute: false }));
    }
  }, [
    shouldAutoSaveAfterReopen,
    rota.length,
    clientList.length,
    canChangeRouteEdit.canChangeRoute,
    dispatch,
    setShouldAutoSaveAfterReopen,
    routeInitialized,
    handleCreateAndSaveTravel,
    clientList,
  ]);

  // const getMarkerColor = useCallback((status: string | undefined) => {
  //   switch (status) {
  //     case 'visited':
  //       return 'green';
  //     case 'not_visited':
  //       return 'red';
  //     case 'pending':
  //     default:
  //       return 'blue';
  //   }
  // }, []);

  const iniciarNavegacao = useCallback((cliente: ClientModel) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${cliente.latitude},${cliente.longitude}&travelmode=driving`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o Google Maps');
    });
  }, []);

  const handleClose = useCallback(() => {
    setShowAlertDialog(false);
  }, []);

  const handleCallCheckIn = async (cliente: ClientModel) => {
    try {
      handleCheckIn(cliente);
      setShowAlertDialog(false);
      navigation.navigate('SaleCheckIn');
    } catch (error) {
      // console.error('Erro ao buscar detalhes do cliente:', error);
    }
  };

  const listIsCompleted = useMemo(() => {
    const clientsPending = clientList.filter(
      client => client.status === 'pending',
    );
    if (clientsPending.length > 0) {
      return false;
    }
    return true;
  }, [clientList]);

  const handleCompleteTravel = useCallback(() => {
    if (listIsCompleted) {
      Alert.alert(
        'Confirmação',
        'Você deseja finalizar a rota e registrar os atendimentos?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Confirmar',
            onPress: async () => {
              try {
                const updatedTravel: TravelModel = {
                  id: travelEdit.id,
                  customerId: travelEdit.customerId,
                  userId: travelEdit.userId,
                  routeId: travelEdit.routeId,
                  startDate: travelEdit.startDate,
                  endDate: new Date(),
                  notes: travelEdit.notes,
                  status: 'closed',
                };

                await api.patch<TravelModel>('/travel/', updatedTravel);

                dispatch(resetClientEdit());
                dispatch(resetClientList());
                dispatch(resetTravelClientEdit());
                dispatch(resetTravelClientOrderEdit());
                dispatch(resetTravelClientOrderItemsEdit());
                dispatch(resetTravelEdit());
                dispatch(resetTravelList());

                await ClearTravel();

                dispatch(
                  addExistsTravelEdit({
                    exists: false,
                  }),
                );

                dispatch(addCanChangeRouteEdit({ canChangeRoute: true }));

                navigation.navigate('SaleMain');
              } catch (error) {
                // console.error('Erro ao finalizar a rota:', error);
                Alert.alert('Erro', 'Não foi possível finalizar a rota.');
              } finally {
                setShowAlertDialog(false);
              }
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Atenção',
        'Você precisa visitar todos os clientes antes de finalizar a rota.',
      );
    }
  }, [
    dispatch,
    listIsCompleted,
    navigation,
    travelEdit.customerId,
    travelEdit.id,
    travelEdit.notes,
    travelEdit.routeId,
    travelEdit.startDate,
    travelEdit.userId,
  ]);

  const handleBackToSaleMain = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SaleMain' }],
    });
  };

  const handleAddNewClient = () => {
    if (existsTravelEdit.exists) {
      navigation.navigate('SaleMain');
    } else {
      Alert.alert(
        'Atenção',
        'Não é possível adicionar novos clientes durante uma rota em andamento.',
      );
    }
  };

  return (
    <>
      <VStack className="relative flex-1">
        {coordsEdit &&
          typeof coordsEdit.latitude === 'number' &&
          typeof coordsEdit.longitude === 'number' &&
          !isNaN(coordsEdit.latitude) &&
          !isNaN(coordsEdit.longitude) && (
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
              {clientList.length > 0 &&
                clientList
                  .filter(client => client.dataFrom !== 'ad_hoc')
                  .map((cliente, idx) => (
                    <Marker
                      key={cliente.id}
                      coordinate={{
                        latitude: Number(cliente.latitude),
                        longitude: Number(cliente.longitude),
                      }}
                      title={`${idx + 1}. ${cliente.companyName}`}
                      onCalloutPress={() => {
                        iniciarNavegacao(cliente);
                      }}
                      tracksViewChanges={false}
                    >
                      <HouseMarker
                        markerStatus={
                          cliente.status ? cliente.status : 'pending'
                        }
                      />
                    </Marker>
                  ))}
              {routeInitialized && rota && rota.length > 0 && (
                <Polyline
                  coordinates={rota}
                  strokeColor="#2196F3"
                  strokeWidth={3}
                />
              )}
              <Marker coordinate={coordsEdit} title="Minha posição">
                <CarMarker />
              </Marker>
            </MapView>
          )}
        <Button
          onPress={handleBackToSaleMain}
          className="absolute top-12 left-4 rounded-md opacity-80 bg-info-600"
        >
          <ButtonIcon as={ChevronLeft} size="xl" />
        </Button>
        <Button
          onPress={handleAddNewClient}
          className="absolute bottom-12 left-4 rounded-md opacity-80 bg-info-600"
        >
          <ButtonIcon as={UserPlus2} size="xl" />
        </Button>
        <Button
          variant="solid"
          onPress={() => {
            // Encontra o próximo cliente com status "pending"
            const nextPendingClient = clientList.find(
              client => client.status === 'pending',
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
            } else if (clientList.length > 0 && mapRef.current) {
              // Fallback: se não há clientes pendentes, vai para o primeiro cliente
              mapRef.current.animateToRegion(
                {
                  latitude: Number(clientList[0].latitude),
                  longitude: Number(clientList[0].longitude),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000,
              );
            }
          }}
          className="bg-green-600  active:bg-green-700 absolute top-12 right-4 rounded-md opacity-80"
        >
          <ButtonIcon as={Binoculars} size="xl" />
        </Button>

        <Button
          onPress={() => {
            setShowAlertDialog(true);
          }}
          className="bg-orange-600  active:bg-orange-800 absolute bottom-12 right-4 rounded-md opacity-80"
        >
          <ButtonIcon as={Contact} size="xl" />
        </Button>
      </VStack>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="lg">
        <AlertDialogBackdrop />
        <AlertDialogContent
          className={` maxHeight-${height * 0.9} bg-background-0 `}
        >
          <AlertDialogHeader>
            <VStack>
              <Heading size="sm">{`Selecione o cliente para iniciar`}</Heading>
              <Text>{`Total de clientes na rota: ${allClientList.length}`}</Text>
            </VStack>
          </AlertDialogHeader>
          <AlertDialogBody style={{ maxHeight: height * 0.6 }}>
            {allClientList.length > 0 &&
              allClientList.map((item, index) => (
                <VStack style={styles.itemContainer} key={item.id}>
                  <Button
                    onPress={async () => {
                      await handleCallCheckIn(item);
                    }}
                    className={
                      item.dataFrom === 'ad_hoc'
                        ? 'bg-warning-200'
                        : `${item.status === 'not_visited' ? 'bg-error-300' : item.status === 'visited' ? 'bg-success-300' : 'bg-blue-500'} w-[100%] `
                    }
                  >
                    <Text
                      numberOfLines={1}
                      size="md"
                      style={styles.buttonText}
                      className="text-center text-white"
                    >
                      {index + 1}. {item.companyName}
                    </Text>
                  </Button>
                </VStack>
              ))}
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack className="gap-4 justify-between items-center flex-wrap">
              {listIsCompleted && (
                <Button
                  onPress={handleCompleteTravel}
                  className="bg-blue-600  active:bg-blue-800 rounded-md opacity-60"
                >
                  <ButtonIcon as={ListCheck} size="xl" />
                </Button>
              )}
              {canChangeRouteEdit.canChangeRoute && (
                <Button
                  onPress={async () => {
                    await handleCreateAndSaveTravel(clientList, 'route');
                  }}
                  className="bg-success-300  active:bg-success-400 rounded-md opacity-60"
                >
                  <ButtonIcon as={SaveAll} size="xl" />
                </Button>
              )}
              <Button
                onPress={handleClose}
                className="bg-error-300  active:bg-error-400 rounded-md opacity-60"
              >
                <ButtonIcon
                  as={DoorClosed}
                  size="xl"
                  className="text-typography-700"
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
