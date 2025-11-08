import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonIcon } from '@/components/ui/button';
import { HomeHeader } from '@components/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import { Alert, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { useCallback, useEffect } from 'react';
import {
  loadDeliveryQueueList,
  updateDeliveryQueueList,
} from '@store/slice/deliveryQueue/deliveryQueueListSlice';
import { useAppSelector } from '@store/store';
import { type DeliveryQueueModel } from '@models/DeliveryQueueModel';
import { DeliveryQueueCard } from '@components/DeliveryQueueCard';
import { HandTap, Truck } from 'phosphor-react-native';
import { addDeliveryRouteEdit } from '@store/slice/deliveryRoute/deliveryRouteEditSlice';
import { type DeliveryRouteModel } from '@models/DeliveryRouteModel';
import uuid from 'react-native-uuid';
import { type DeliveryItemModel } from '@models/DeliveryItemModel';
import { addExistsDeliveryRouteEdit } from '@store/slice/deliveryRoute/existsDeliveryRouteEditSlice';
import { type DeliveryRouteCoordsModel } from '@models/DliveryRouteCoordsModel';
import { type DeliveryItemPhotoModel } from '@models/DeliveryItemPhotoModel';
import { type NotDeliveredItemsModel } from '@models/NotDeliveredItemsModel';

export function DeliveryRoute() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const deliveryQueueList = useAppSelector(state => state.deliveryQueueList);

  const { user } = useAuth();

  useEffect(() => {
    const loadDeliveries = async () => {
      const response = await api.get('/deliveryQueue', {
        params: {
          customerId: user?.user.customerId,
          routeId: user?.user.routeId,
        },
      });
      if (response.data) {
        dispatch(loadDeliveryQueueList(response.data));
      }
    };
    loadDeliveries();
  }, [dispatch, user]);

  const handleSelectDeliveryQueue = useCallback(
    (deliveryQueueItem: DeliveryQueueModel) => {
      dispatch(
        updateDeliveryQueueList({
          ...deliveryQueueItem,
          isSelected: !deliveryQueueItem.isSelected,
        }),
      );
    },
    [dispatch],
  );

  const handleCreateDeliveryDrive = useCallback(() => {
    const selectedDeliveries = deliveryQueueList.filter(
      item => item.isSelected,
    );

    if (selectedDeliveries.length === 0) {
      Alert.alert(
        'Nenhuma entrega selecionada',
        'Por favor, selecione ao menos uma entrega para iniciar a rota.',
      );
      return;
    }

    const newDeliveryRouteId = uuid.v4();
    const newDeliveryRoute: DeliveryRouteModel = {
      id: newDeliveryRouteId,
      customerId: user?.user.customerId ?? '',
      routeId: user?.user.routeId ?? '',
      sellerId: user?.user.id ?? '',
      startDate: new Date(),
      endDate: undefined,
      status: 'created',
      completedCharge: false,
      dateTimeCompletedCharge: undefined,
      DeliveryItems: selectedDeliveries.map((item: DeliveryQueueModel) => ({
        id: item.id,
        customerId: item.customerId,
        deliveryRouteId: newDeliveryRouteId,
        clientId: item.clientId,
        clientCode: item.Client ? item.Client.code : '', // Use cityCode and null check
        Client: item.Client,
        orderId: item.orderId,
        orderNumber: item.orderNumber,
        orderDate: item.orderDate,
        invoiceId: item.invoiceId,
        receber: item.receber,
        notes: item.notes,
        status: item.status,
        nfeNumber: item.nfeNumber,
        nfeUrl: item.nfeUrl,
        deliveryOrder: 0, // or calculate based on your logic
        DeliveryItemsPhotos: [] as DeliveryItemPhotoModel[], // Initialize with empty array
        NotDeliveredItems: [] as NotDeliveredItemsModel[], // Now correctly typed as NotDeliveredItemsModel[]
      })),
      DeliveryItemsCharge: [] as DeliveryItemModel[],
      DeliveryRouteCoords: [] as DeliveryRouteCoordsModel[],
    };

    dispatch(addDeliveryRouteEdit(newDeliveryRoute));

    dispatch(
      addExistsDeliveryRouteEdit({
        exists: false,
      }),
    );

    navigation.navigate('DeliveryDrive');
  }, [
    deliveryQueueList,
    dispatch,
    navigation,
    user?.user.customerId,
    user?.user.id,
    user?.user.routeId,
  ]);

  const handleSelectAllDeliveries = useCallback(() => {
    const selectedItems = deliveryQueueList.map(item => ({
      ...item,
      isSelected: true,
    }));

    dispatch(loadDeliveryQueueList(selectedItems));
  }, [deliveryQueueList, dispatch]);

  return (
    <VStack className="flex-1">
      <HomeHeader />
      <VStack className="flex-1 px-4 py-4">
        <HStack className="gap-4 justify-between mb-4">
          <Heading size="sm" className="text-trueGray-100">
            Rota de Entregas
          </Heading>
          <Text className="text-trueGray-400">{`${deliveryQueueList.length} entregas`}</Text>
        </HStack>
        <FlatList
          data={deliveryQueueList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: DeliveryQueueModel) => item.id}
          renderItem={({ item }) => (
            <DeliveryQueueCard
              data={item}
              handleSelectDeliveryQueue={handleSelectDeliveryQueue}
            />
          )}
          ListEmptyComponent={() => (
            <Text className="text-trueGray-400 text-center">
              Nenhuma entrega na fila.
            </Text>
          )}
        />
      </VStack>
      <HStack className="bg-trueGray-800 p-4 justify-around items-center border border-trueGray-700">
        <Button
          size="lg"
          onPress={handleSelectAllDeliveries}
          className="rounded-md h-12 w-1/3 bg-green-500  active:bg-green-700 flex"
        >
          <ButtonIcon as={HandTap} size="xl" />
        </Button>
        <Button
          size="lg"
          onPress={handleCreateDeliveryDrive}
          className="rounded-md h-12 w-1/3 bg-blue-500  active:bg-blue-700 flex"
        >
          <ButtonIcon as={Truck} size="xl" />
        </Button>
      </HStack>
    </VStack>
  );
}
