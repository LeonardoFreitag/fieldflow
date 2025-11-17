import { VStack } from '@ui/vstack';
import { SafeAreaView } from '@ui/safe-area-view';
import { Heading } from '@ui/heading';
import { Button, ButtonIcon } from '@ui/button';
import { useAuth } from '@hooks/useAuth';
import { type DeliveryRouteModel } from '@models/DeliveryRouteModel';
import { type RouteCollectionModel } from '@models/RouteCollectionModel';
import { type UserRuleModel } from '@models/UserAuthModel';
import { useNavigation } from '@react-navigation/native';
import { api } from '@services/api';
import { addDeliveryRouteEdit } from '@store/slice/deliveryRoute/deliveryRouteEditSlice';
import { addExistsDeliveryRouteEdit } from '@store/slice/deliveryRoute/existsDeliveryRouteEditSlice';
import { addExistsRouteCollectionEdit } from '@store/slice/routeCollection/existsRouteCollectionEditSlice';
import { addRouteCollectionEdit } from '@store/slice/routeCollection/routeCollectionEditSlice';
import { HandCoins, ShoppingCart, Truck } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHandleSaleRoute } from '@hooks/useHandleSaleRoute';

export function MenuRoutes() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { handleSaleRoute } = useHandleSaleRoute();

  const { user } = useAuth();

  const stringRules = useMemo(() => {
    if (!user?.user.UserRules) {
      return '';
    }
    const rules: string[] = user.user.UserRules.map((rule: UserRuleModel) => {
      return rule.rule;
    });

    return rules;
  }, [user?.user.UserRules]);

  const handleCallSaleRoute = async () => {
    await handleSaleRoute();
    // await fetchRota();
    navigation.navigate('SaleMain');
  };

  const handleCallDeliveryRoute = useCallback(async () => {
    // verifica se existe rota de entrega em andamento
    try {
      const response = await api.get<DeliveryRouteModel>(
        '/deliveryRoute/current',
        {
          params: {
            customerId: user?.user.customerId,
            routeId: user?.user.routeId,
          },
        },
      );
      if (response.data) {
        dispatch(
          addDeliveryRouteEdit({
            ...response.data,
            DeliveryItems: response.data.DeliveryItems
              ? [...response.data.DeliveryItems].sort(
                  (a, b) => a.deliveryOrder - b.deliveryOrder,
                )
              : [],
          }),
        );

        // await fetchRota();

        dispatch(
          addExistsDeliveryRouteEdit({
            exists: true,
          }),
        );

        navigation.navigate('DeliveryDrive');
        return;
      }
    } catch (error) {
      console.log('Error fetching current delivery route:', error);
    }

    dispatch(
      addExistsDeliveryRouteEdit({
        exists: false,
      }),
    );
    navigation.navigate('DeliveryRoute');
  }, [dispatch, navigation, user?.user.customerId, user?.user.routeId]);

  const handleCallRouteCollection = useCallback(async () => {
    try {
      const response = await api.get<RouteCollectionModel>(
        '/routeCollection/current',
        {
          params: {
            customerId: user?.user.customerId,
            routeId: user?.user.routeId,
          },
        },
      );

      if (response.data) {
        dispatch(
          addExistsRouteCollectionEdit({
            exists: true,
          }),
        );
        dispatch(
          addRouteCollectionEdit({
            ...response.data,
            RouteCollectionItems: response.data.RouteCollectionItems
              ? [...response.data.RouteCollectionItems]
                  .sort((a, b) => a.visitOrder - b.visitOrder)
                  .map(item => ({ ...item })) // garante que todas as props sejam mantidas
              : [],
          }),
        );
        navigation.navigate('ReceberDrive');
      }
    } catch (error) {
      navigation.navigate('ReceberRoute');
    }
  }, [dispatch, navigation, user?.user.customerId, user?.user.routeId]);

  return (
    <SafeAreaView>
      <VStack className="px-4 py-4 gap-12 h-full justify-center">
        <Heading size="lg" className="text-typography-500 text-center">
          Selecione a rota desejada
        </Heading>
        <Button
          variant="outline"
          onPress={handleCallSaleRoute}
          disabled={!stringRules.includes('sale')}
          className="border-outline-700  bg-background-700 active:bg-background-100 gap-8 h-20"
        >
          <ButtonIcon
            as={ShoppingCart}
            size="xl"
            className="text-typography-200"
          />
          <Heading size="md" className="text-typography-200">
            Vendas
          </Heading>
        </Button>
        <Button
          variant="outline"
          onPress={handleCallDeliveryRoute}
          disabled={!stringRules.includes('production')}
          className="border-outline-100  bg-background-700 active:bg-background-100 gap-8 h-20"
        >
          <ButtonIcon as={Truck} size="xl" className="text-typography-200" />
          <Heading size="md" className="text-typography-200">
            Entrega
          </Heading>
        </Button>
        <Button
          variant="outline"
          onPress={handleCallRouteCollection}
          disabled={!stringRules.includes('expedition')}
          className="border-outline-100  bg-background-700 active:bg-background-100 gap-8 h-20"
        >
          <ButtonIcon
            as={HandCoins}
            size="xl"
            className="text-typography-200"
          />
          <Heading size="md" className="text-typography-200">
            Cobrança
          </Heading>
        </Button>
      </VStack>
    </SafeAreaView>
  );
}
