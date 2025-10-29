import {
  Button,
  ButtonIcon,
  Heading,
  SafeAreaView,
  VStack,
} from '@gluestack-ui/themed';
import { useAuth } from '@hooks/useAuth';
import { useHandleSaleRoute } from '@hooks/useHandleSaleRoute';
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

export function MenuRoutes() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user } = useAuth();

  const { handleSaleRoute } = useHandleSaleRoute();

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
    navigation.navigate('SaleRoute');
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
      <VStack px="$4" py="$4" gap="$12" height="$full" justifyContent="center">
        <Button
          variant="outline"
          borderColor="$trueGray300"
          $active-bg="$trueGray500"
          gap="$8"
          height="$20"
          onPress={handleCallSaleRoute}
          disabled={!stringRules.includes('sale')}
        >
          <ButtonIcon as={ShoppingCart} size="xl" color="$trueGray300" />
          <Heading size="md" color="$trueGray300">
            Vendas
          </Heading>
        </Button>
        <Button
          variant="outline"
          borderColor="$trueGray300"
          $active-bg="$trueGray500"
          gap="$8"
          height="$20"
          onPress={handleCallDeliveryRoute}
          disabled={!stringRules.includes('production')}
        >
          <ButtonIcon as={Truck} size="xl" color="$trueGray300" />
          <Heading size="md" color="$trueGray300">
            Entrega
          </Heading>
        </Button>
        <Button
          variant="outline"
          borderColor="$trueGray300"
          gap="$8"
          height="$20"
          $active-bg="$trueGray500"
          onPress={handleCallRouteCollection}
          disabled={!stringRules.includes('expedition')}
        >
          <ButtonIcon as={HandCoins} size="xl" color="$trueGray300" />
          <Heading size="md" color="$trueGray300">
            Cobrança
          </Heading>
        </Button>
      </VStack>
    </SafeAreaView>
  );
}
