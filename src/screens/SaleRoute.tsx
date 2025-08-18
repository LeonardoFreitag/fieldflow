import { ClientCard } from '@components/ClientCard';
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
import { FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { api } from '@services/api';
import { type ClientModel } from '@models/ClientModel';
import { useAuth } from '@hooks/useAuth';
import {
  loadClientList,
  updateClientList,
} from '@store/slice/client/clientListSlice';
import { useAppSelector } from '@store/store';
import { Broom, MapPinArea, UserPlus } from 'phosphor-react-native';
import { ClearTravel } from '@storage/travel/clearTravelRoute';
import { addExistsTravelEdit } from '@store/slice/travel/existsTravelEditSlice';

export function SaleRoute() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const clientList = useAppSelector(state => state.clientList);
  const existsTravelEdit = useAppSelector(state => state.existsTravelEdit);
  const canChangeRouteEdit = useAppSelector(state => state.canChangeRouteEdit);

  const { user } = useAuth();

  const handleSelectCustomer = useCallback(
    (clientItem: ClientModel) => {
      const selected = clientItem.isSelected ? clientItem.isSelected : false;
      dispatch(
        updateClientList({
          ...clientItem,
          isSelected: !selected,
        }),
      );
    },
    [dispatch],
  );

  const handleGetClientRoutToDay = async () => {
    try {
      const response = await api.get<ClientModel[]>('/client/routeToDay', {
        params: {
          customerId: user?.user.customerId,
          routeId: user?.user.routeId,
          day: new Date().toISOString().split('T')[0],
        },
      });
      const data = response.data;
      dispatch(loadClientList(data));
    } catch (error) {
      console.error('Erro ao buscar rota do dia:', error);
    }
  };

  const clientSelecteds = useMemo(() => {
    return clientList.filter((client: ClientModel) => client.isSelected);
  }, [clientList]);

  const continueIsDisable = useMemo(() => {
    const minVisits = user?.user.customer.maxVisitsSales ?? 0;
    if (minVisits === 0) return false;
    return clientSelecteds.length < minVisits;
  }, [clientSelecteds, user?.user.customer.maxVisitsSales]);

  const handleClearSelection = useCallback(() => {
    if (existsTravelEdit.exists) {
      ClearTravel();
      dispatch(
        addExistsTravelEdit({
          exists: false,
        }),
      );
    }
    dispatch(
      loadClientList(
        clientList.map((client: ClientModel) => ({
          ...client,
          isSelected: false,
        })),
      ),
    );
  }, [existsTravelEdit.exists, dispatch, clientList]);

  const handleStartSaleRouteDrive = useCallback(() => {
    if (!existsTravelEdit.exists) {
      const selectedClients = clientList.filter(client => client.isSelected);

      const clientsWithStatus: ClientModel[] = selectedClients.map(client => ({
        ...client,
        status: client.status ? client.status : 'pending',
      }));
      dispatch(loadClientList(clientsWithStatus));
    }

    navigation.navigate('SaleRouteDrive');
  }, [clientList, dispatch, existsTravelEdit.exists, navigation]);

  return (
    <VStack flex={1}>
      <HomeHeader />
      <VStack flex={1} px="$4" py="$4">
        <HStack
          gap="$4"
          justifyContent="space-between"
          mb="$4"
          alignItems="center"
          flexWrap="wrap"
        >
          {canChangeRouteEdit.canChangeRoute && (
            <Button
              onPress={handleGetClientRoutToDay}
              w="$full"
              gap="$4"
              $active-bg="$trueGray200"
            >
              <ButtonIcon as={MapPinArea} size="xl" />
              <Text color="$trueGray100">Buscar rota do dia</Text>
            </Button>
          )}

          <Heading size="sm" color="$trueGray100">
            {`Selecionados (${clientSelecteds.length})`}
          </Heading>
          <Text color="$trueGray400">{`${clientList.length} clientes`}</Text>
        </HStack>
        {clientList.length > 0 && (
          <FlatList
            data={clientList}
            keyExtractor={(item: ClientModel) => item.id}
            renderItem={({ item }) => (
              <ClientCard
                data={item}
                handleSelectCustomer={handleSelectCustomer}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </VStack>
      <VStack
        w="$full"
        p="$4"
        mb="$4"
        display="flex"
        flexDirection="row"
        gap="$2"
        paddingHorizontal="$8"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Button
          size="lg"
          rounded="$md"
          h="$12"
          w="$1/3"
          backgroundColor="$blue500"
          $active-bg="$blue700"
          display="flex"
          onPress={() => {
            navigation.navigate('SaleClientList');
          }}
        >
          <ButtonIcon as={UserPlus} size="xl" />
        </Button>
        {canChangeRouteEdit.canChangeRoute && (
          <Button
            size="lg"
            rounded="$md"
            h="$12"
            w="$1/3"
            backgroundColor="$red500"
            display="flex"
            onPress={handleClearSelection}
          >
            <ButtonIcon as={Broom} size="xl" />
          </Button>
        )}
        <Button
          size="lg"
          rounded="$md"
          h="$12"
          w="$1/3"
          backgroundColor={continueIsDisable ? '$blueGray400' : '$green700'}
          $active-bg="$green500"
          display="flex"
          disabled={continueIsDisable}
          onPress={handleStartSaleRouteDrive}
        >
          <ButtonIcon as={MapPinArea} size="xl" />
        </Button>
      </VStack>
    </VStack>
  );
}
