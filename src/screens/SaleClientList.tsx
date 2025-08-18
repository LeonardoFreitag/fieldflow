import { ClientRouteCard } from '@components/ClientRouteCard';
import { HomeHeader } from '@components/HomeHeader';
import { Input } from '@components/Input';
import { Button, ButtonIcon, HStack, VStack, Text } from '@gluestack-ui/themed';
import { useAuth } from '@hooks/useAuth';
import { useHandleSaleRoute } from '@hooks/useHandleSaleRoute';
import { type ClientModel } from '@models/ClientModel';
import { type TravelClientsModel } from '@models/TravelModel';
import { useNavigation } from '@react-navigation/native';
import { api } from '@services/api';
import { addClientEdit } from '@store/slice/client/clientEditSlice';
import {
  loadClientRouteList,
  updateClientRouteList,
} from '@store/slice/client/clientRouteListSlice';
import { addTravelClientEdit } from '@store/slice/travel/travelClientEditSlice';
import { updateTravelEdit } from '@store/slice/travel/travelEditSlice';
import { useAppSelector } from '@store/store';
import { ChevronLeft, Plus, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';

export function SaleClientList() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [textTyped, setTextTyped] = useState('');
  const clientRouteList = useAppSelector(state => state.clientRouteList);
  const clientList = useAppSelector(state => state.clientList);
  const travelEdit = useAppSelector(state => state.travelEdit);
  const existsTravelEdit = useAppSelector(state => state.existsTravelEdit);

  const { user } = useAuth();

  const { handleCreateAndSaveTravel, handleSaleRoute, handleCheckIn } =
    useHandleSaleRoute();

  useEffect(() => {
    const loadClientsByRoute = async () => {
      try {
        const response = await api.get<ClientModel[]>('/client/listByRoute', {
          params: {
            customerId: user?.user.customerId,
            routeId: user?.user.routeId,
          },
        });

        dispatch(loadClientRouteList(response.data));
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    };
    loadClientsByRoute();
  }, [dispatch, user?.user.customerId, user?.user.routeId]);

  const handleSelectCustomer = (clientItem: ClientModel) => {
    dispatch(
      updateClientRouteList({
        ...clientItem,
        isSelected: !clientItem.isSelected,
      }),
    );
  };

  const handleAddToRoute = async () => {
    const selectedClients = clientRouteList.filter(client => client.isSelected);

    if (selectedClients.length === 0) {
      return;
    }

    if (!existsTravelEdit.exists && !travelEdit.id) {
      console.log('Creating new travel for manual route');
      await handleCreateAndSaveTravel(selectedClients, 'manual');
      return;
    }

    try {
      const responses = await Promise.all(
        selectedClients.map(async (clientItem, idx) => {
          const newClient: TravelClientsModel = {
            travelId: travelEdit.id ?? '',
            clientId: clientItem.id,
            clientCode: clientItem.code,
            orderInRoute: (travelEdit.TravelClients?.length ?? 0) + idx + 1,
            latitude: Number(clientItem.latitude),
            longitude: Number(clientItem.longitude),
            checkInDate: new Date(),
            checkOutDate: new Date(),
            notes: '',
            status: 'pending',
            dataFrom: 'manual',
          };
          console.log('Adding client to route:', newClient);
          const response = await api.post('travel/travelClients', newClient);
          return response.data;
        }),
      );

      dispatch(
        updateTravelEdit({
          ...travelEdit,
          TravelClients: [...(travelEdit.TravelClients ?? []), ...responses],
        }),
      );
      handleSaleRoute();

      navigation.goBack();
    } catch (error) {
      console.error('Error adding clients to route:', error);
    }
  };

  const handleAddNewSale = async () => {
    const selectedClients = clientRouteList.filter(client => client.isSelected);

    if (selectedClients.length === 0) {
      return;
    }

    if (selectedClients.length > 1) {
      Alert.alert(
        'Atenção',
        'Você só pode adicionar um cliente por vez ao pedido.',
        [{ text: 'OK' }],
      );
      return;
    }

    if (!existsTravelEdit.exists && !travelEdit.id) {
      await handleCreateAndSaveTravel(selectedClients, 'manual');
      return;
    }

    const clientItem = selectedClients[0];

    try {
      const newClient: TravelClientsModel = {
        travelId: travelEdit.id ?? '',
        clientId: clientItem.id,
        clientCode: clientItem.code,
        orderInRoute: (travelEdit.TravelClients?.length ?? 0) + 1,
        latitude: Number(clientItem.latitude),
        longitude: Number(clientItem.longitude),
        checkInDate: new Date(),
        checkOutDate: new Date(),
        notes: '',
        status: 'pending',
        dataFrom: 'manual',
      };

      const response = await api.post<TravelClientsModel>(
        'travel/travelClients',
        newClient,
      );

      const newTravelClient: TravelClientsModel = response.data;

      dispatch(
        updateTravelEdit({
          ...travelEdit,
          TravelClients: [...(travelEdit.TravelClients ?? []), newTravelClient],
          orderedClients: [...(travelEdit.orderedClients ?? []), clientItem],
        }),
      );

      handleSaleRoute();

      handleCreateAndSaveTravel(clientList, undefined);

      try {
        const response = await api.get<ClientModel>('/client/details', {
          params: {
            clientId: clientItem.id,
          },
        });

        dispatch(addClientEdit(response.data));
        dispatch(addTravelClientEdit(newTravelClient));
      } catch (error) {
        // console.error('Erro ao buscar detalhes do cliente:', error);
      }

      navigation.navigate('SaleCheckIn');
    } catch (error) {
      console.error('Error adding clients to route:', error);
    }
  };

  const canAddNewSale = useMemo(() => {
    const selectedClients = clientRouteList.filter(client => client.isSelected);
    if (selectedClients.length === 1) {
      return true;
    }
    return false;
  }, [clientRouteList]);

  return (
    <VStack flex={1}>
      <HomeHeader />
      <VStack flex={1} px="$2" py="$2">
        <HStack
          // mx="$1"
          mb="$2"
          w="$full"
          backgroundColor="$trueGray600"
          p="$2"
          rounded="$md"
          gap="$2"
        >
          <Input
            placeholder="Pesquise pelo cliente..."
            keyboardType="default"
            autoCapitalize="none"
            onChangeText={setTextTyped}
            value={textTyped}
            w="$full"
          />
          <Button
            size="lg"
            rounded="$md"
            w="$12"
            h="$12"
            onPress={() => {
              setTextTyped('');
            }}
            gap="$1"
          >
            <ButtonIcon as={X} size="xl" />
          </Button>
        </HStack>

        {clientRouteList.length > 0 && (
          <FlatList
            data={clientRouteList.filter(client =>
              client.companyName
                .toLowerCase()
                .includes(textTyped.toLowerCase()),
            )}
            keyExtractor={(item: ClientModel) => item.id}
            renderItem={({ item }) => (
              <ClientRouteCard
                data={item}
                handleSelectCustomer={() => {
                  handleSelectCustomer(item);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </VStack>
      <HStack
        justifyContent="space-between"
        position="absolute"
        bottom="$0"
        left="$0"
        backgroundColor="$trueGray900"
        width="100%"
        height="$24"
        padding="$2"
      >
        <Button
          size="lg"
          rounded="$md"
          w="$24"
          h="$12"
          backgroundColor="$blue500"
          $active-bg="$blue700"
          onPress={() => {
            navigation.goBack();
          }}
          gap="$1"
        >
          <ButtonIcon as={ChevronLeft} size="xl" />
          <Text color="$trueGray100" size="xs">
            Voltar
          </Text>
        </Button>
        <Button
          size="lg"
          rounded="$md"
          w="$24"
          h="$12"
          backgroundColor="$green700"
          $active-bg="$green500"
          gap="$1"
          onPress={handleAddToRoute}
        >
          <ButtonIcon as={Plus} size="lg" />
          <Text color="$trueGray100" size="xs">
            Rota
          </Text>
        </Button>
        <Button
          size="lg"
          rounded="$md"
          w="$24"
          h="$12"
          backgroundColor="$green700"
          $active-bg="$green500"
          gap="$1"
          onPress={() => {
            handleAddNewSale();
          }}
          disabled={!canAddNewSale}
        >
          <ButtonIcon as={Plus} size="lg" />
          <Text color="$trueGray100" size="xs">
            Pedido
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
}
