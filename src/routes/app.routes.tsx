import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuRoutes } from '@screens/MenuRoutes';
import { SaleAddNewItem } from '@screens/SaleAddNewItem';
import { SaleBreak } from '@screens/SaleBreak';
import { SaleItemComposition } from '@screens/SaleItemComposition';
import { SaleList } from '@screens/SaleList';
import { SaleNew } from '@screens/SaleNew';
import { SaleRoute } from '@screens/SaleRoute';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="MenuRoutes" component={MenuRoutes} />
      <Screen name="SaleRoute" component={SaleRoute} />
      <Screen name="SaleList" component={SaleList} />
      <Screen name="SaleBreak" component={SaleBreak} />
      <Screen name="SaleNew" component={SaleNew} />
      <Screen name="SaleItemComposition" component={SaleItemComposition} />
      <Screen name="SaleAddNewItem" component={SaleAddNewItem} />
    </Navigator>
  );
}
