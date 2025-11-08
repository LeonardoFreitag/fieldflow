import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReceberFinalize } from '@screens/ReceberFinalize';
import { ReceberRoute } from '@screens/ReceberRoute';
import { DeliveryFinalize } from '@screens/DeliveryFinalize';
import { DeliveryRoute } from '@screens/DeliveryRoute';
import { DeliveryDrive } from '@screens/DeliveryDrive';
import { MenuRoutes } from '@screens/MenuRoutes';
import { SaleAddNewItem } from '@screens/SaleAddNewItem';
import { SaleVisitFailure } from '@screens/SaleVisitFailure';
import { SaleFinish } from '@screens/SaleFinish';
import { SaleItemComposition } from '@screens/SaleItemComposition';
import { SaleCheckIn } from '@screens/SaleCheckIn';
import { SaleNew } from '@screens/SaleNew';
import { SaleRoute } from '@screens/SaleRoute';
import { SaleRouteDrive } from '@screens/SaleRouteDrive';
import { SaleMain } from '@screens/SaleMain';
import { ReceberDrive } from '@screens/ReceberDrive';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="MenuRoutes" component={MenuRoutes} />
      <Screen name="SaleMain" component={SaleMain} />
      <Screen name="SaleRoute" component={SaleRoute} />
      <Screen name="SaleCheckIn" component={SaleCheckIn} />
      <Screen name="SaleVisitFailure" component={SaleVisitFailure} />
      <Screen name="SaleNew" component={SaleNew} />
      <Screen name="SaleItemComposition" component={SaleItemComposition} />
      <Screen name="SaleAddNewItem" component={SaleAddNewItem} />
      <Screen name="SaleFinish" component={SaleFinish} />
      <Screen name="DeliveryRoute" component={DeliveryRoute} />
      <Screen name="DeliveryDrive" component={DeliveryDrive} />
      <Screen name="DeliveryFinalize" component={DeliveryFinalize} />
      <Screen name="ReceberRoute" component={ReceberRoute} />
      <Screen name="ReceberDrive" component={ReceberDrive} />
      <Screen name="ReceberFinalize" component={ReceberFinalize} />
      <Screen name="SaleRouteDrive" component={SaleRouteDrive} />
    </Navigator>
  );
}
