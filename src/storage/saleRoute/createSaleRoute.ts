import AsyncStorage from '@react-native-async-storage/async-storage';
import { SALEROUTE_COLLETION } from '../storageConfig';
import { type SaleRouteModel } from '@models/SaleRouteModel';

export async function saleRouteModelCreate(
  saleRoute: SaleRouteModel,
): Promise<void> {
  try {
    const newStorageCompany = JSON.stringify(saleRoute);

    await AsyncStorage.setItem(SALEROUTE_COLLETION, newStorageCompany);
  } catch (e) {
    throw new Error('Error saving route');
  }
}
