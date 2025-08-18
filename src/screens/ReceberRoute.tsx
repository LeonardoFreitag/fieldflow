import { HomeHeader } from '@components/HomeHeader';
import {
  Button,
  ButtonIcon,
  Heading,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
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

export function ReceberRoute() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const receberList = useAppSelector(state => state.receberList);
  const { user } = useAuth();

  const handleSelectReceber = useCallback(
    (dataReceber: ReceberModel) => {
      console.log('Selected Receber');
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
    <VStack flex={1}>
      <HomeHeader />
      <VStack flex={1} px="$4" py="$4">
        <HStack gap="$4" justifyContent="space-between" mb="$4">
          <Heading size="sm" color="$trueGray100">
            Rota de cobrança
          </Heading>
        </HStack>
        <HStack mb="$2" justifyContent="space-between">
          <Text color="$trueGray400">{`Selecinados: ${receberSelectedCount} de ${receberList.length} títulos`}</Text>
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
            <Text color="$trueGray400" textAlign="center">
              Nenhum título pendente para esta rota.
            </Text>
          )}
        />
      </VStack>
      <HStack
        bg="$trueGray800"
        p="$4"
        justifyContent="space-around"
        alignItems="center"
        borderTopWidth={1}
        borderColor="$trueGray700"
      >
        <Button
          size="lg"
          rounded="$md"
          h="$12"
          w="$1/3"
          backgroundColor="$green500"
          $active-bg="$green700"
          display="flex"
          onPress={handleSelectAllReceberList}
        >
          <ButtonIcon as={HandTap} size="xl" />
        </Button>
        <Button
          size="lg"
          rounded="$md"
          h="$12"
          w="$1/3"
          backgroundColor="$blue500"
          $active-bg="$blue700"
          display="flex"
          onPress={handleCreateReceberDrive}
        >
          <ButtonIcon as={HandCoins} size="xl" />
        </Button>
      </HStack>
    </VStack>
  );
}
