import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_COLLETION } from '../storageConfig';

export async function authDelete(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_COLLETION);
  } catch (e) {
    throw new Error('Error saving company');
  }
}
