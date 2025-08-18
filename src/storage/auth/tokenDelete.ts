import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_COLLETION } from '../storageConfig';

export async function authDelete(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TOKEN_COLLETION);
  } catch (e) {
    throw new Error('Error saving token');
  }
}
