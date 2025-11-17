import { VStack } from '@ui/vstack';
import { Text } from '@ui/text';
import { HStack } from '@ui/hstack';
import { Heading } from '@ui/heading';
import { Button, ButtonIcon } from '@ui/button';
import { HomeHeader } from '@components/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import { Alert, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { type ReceberModel } from '@models/ReceberModel';
import { useAppSelector } from '@store/store';
import { ReceberCard } from '@components/ReceberCard';
import { useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import {
  loadReceberList,
  updateReceberList,
} from '@store/slice/receber/receberListSlice';
import { HandCoins, HandTap } from 'phosphor-react-native';
import uuid from 'react-native-uuid';
import { type RouteCollectionModel } from '@models/RouteCollectionModel';
import { type RouteCollectionNotFoundClientModel } from '@models/RouteCollectionNotFoundClientModel';
import { type RouteCollectionCoordsModel } from '@models/RouteCollectionCoordsModel';
import { addExistsRouteCollectionEdit } from '@store/slice/routeCollection/existsRouteCollectionEditSlice';
import { addRouteCollectionEdit } from '@store/slice/routeCollection/routeCollectionEditSlice';
import { type RouteCollectionItemsPhotosModel } from '@models/RouteCollectionItemsPhotosModel';
import { Hand, HandCoinsIcon } from 'lucide-react-native';

export function ReceberRoute() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const receberList = useAppSelector(state => state.receberList);
  const { user } = useAuth();

  const handleSelectReceber = useCallback(
    (dataReceber: ReceberModel) => {
      const selected = dataReceber.selected ? dataReceber.selected : false;

      dispatch(
        updateReceberList({
          ...dataReceber,
          selected: !selected,
        }),
      );
    },
    [dispatch],
  );

  const receberSelectedCount = useMemo(() => {
    return receberList.filter(item => item.selected).length;
  }, [receberList]);

  const handleSelectAllReceberList = useCallback(() => {
    const selectedList = receberList.map(item => ({
      ...item,
      selected: true,
    }));

    dispatch(loadReceberList(selectedList));
  }, [dispatch, receberList]);

  const handleCreateReceberDrive = useCallback(() => {
    const selectedReceber = receberList.filter(item => item.selected);

    if (selectedReceber.length === 0) {
      Alert.alert(
        'Nenhuma conta selecionada',
        'Por favor, selecione ao menos uma entrega para iniciar a rota.',
      );
      return;
    }

    const newRouteCollectionId = uuid.v4();
    const newRouteCollection: RouteCollectionModel = {
      id: newRouteCollectionId,
      customerId: user?.user.customerId ?? '',
      routeId: user?.user.routeId ?? '',
      sellerId: user?.user.id ?? '',
      startDate: new Date(),
      endDate: undefined,
      status: 'created',
      RouteCollectionItems: selectedReceber.map((item: ReceberModel) => ({
        id: item.id,
        routeCollectionId: newRouteCollectionId,
        customerId: item.customerId,
        clientId: item.clientId,
        clientCode: item.clientCode,
        Client: item.Client,
        receberId: item.id,
        Receber: item,
        orderId: item.travelClientOrdersId,
        orderNumber: item.travelClientOrdersNumber,
        orderDate: item.TrabelClientOrders.orderDate,
        invoiceId: item.invoiceId,
        notes: '',
        status: 'pending',
        nfeNumber: item.notaFiscal,
        nfeUrl: item.notaFiscalFileUrl,
        latitude: item.Client?.latitude ?? null,
        longitude: item.Client?.longitude ?? null,
        visitOrder: 0,
        RouteCollectionItemsPhotos: [] as RouteCollectionItemsPhotosModel[],
        RouteCollectionNotFoundClient:
          [] as RouteCollectionNotFoundClientModel[],
      })),
      RouteCollectionCoords: [] as RouteCollectionCoordsModel[],
    };

    dispatch(addRouteCollectionEdit(newRouteCollection));

    dispatch(
      addExistsRouteCollectionEdit({
        exists: false,
      }),
    );

    navigation.navigate('ReceberDrive');
  }, [
    dispatch,
    navigation,
    receberList,
    user?.user.customerId,
    user?.user.id,
    user?.user.routeId,
  ]);

  useEffect(() => {
    const fetchReceberList = async () => {
      const response = await api.get<ReceberModel[]>('/receber/overdue', {
        params: {
          customerId: user?.user.customerId,
          routeId: user?.user.routeId,
        },
      });
      if (response.data) {
        dispatch(loadReceberList(response.data));
      }
    };
    fetchReceberList();
  }, [dispatch, user]);

  return (
    <VStack className="flex-1">
      <HomeHeader />
      <VStack className="flex-1 px-4 py-4">
        <HStack className="gap-4 justify-between mb-4">
          <Heading size="sm" className="text-typography-700 w-full text-center">
            Rota de cobrança
          </Heading>
        </HStack>
        <HStack className="mb-2 justify-between">
          <Text className="text-typography-600">{`Selecinados: ${receberSelectedCount} de ${receberList.length} títulos`}</Text>
        </HStack>
        <FlatList
          data={receberList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: ReceberModel) => item.id}
          renderItem={({ item }) => (
            <ReceberCard
              data={item}
              handleSelectReceber={handleSelectReceber}
            />
          )}
          ListEmptyComponent={() => (
            <Text className="text-typography-600 text-center">
              Nenhum título pendente para esta rota.
            </Text>
          )}
        />
      </VStack>
      <HStack className="bg-background-200 p-6 justify-around items-center">
        <Button
          size="lg"
          onPress={handleSelectAllReceberList}
          className="rounded-md h-12 w-1/3 bg-success-400  active:bg-success-500 flex"
        >
          <ButtonIcon as={Hand} size="xl" className="text-typography-700" />
        </Button>
        <Button
          size="lg"
          onPress={handleCreateReceberDrive}
          className="rounded-md h-12 w-1/3 bg-info-400  active:bg-info-500 flex"
        >
          <ButtonIcon
            as={HandCoinsIcon}
            size="xl"
            className="text-typography-700"
          />
        </Button>
      </HStack>
    </VStack>
  );
}
