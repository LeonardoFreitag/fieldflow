import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_COLLETION } from '../storageConfig';

export async function loginDelete(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOGIN_COLLETION);
  } catch (e) {
    throw new Error('Error deleting login');
  }
}
