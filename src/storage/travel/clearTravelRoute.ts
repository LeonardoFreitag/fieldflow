import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRAVEL_COLLETION } from '../storageConfig';

export async function ClearTravel(): Promise<void> {
  try {
    // Clear the travel route by removing the item from AsyncStorage
    await AsyncStorage.removeItem(TRAVEL_COLLETION);
  } catch (e) {
    throw new Error('Error saving route');
  }
}
