import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_COLLETION } from '../storageConfig';
import { type TokenModel } from '@models/TokenModel';

export async function tokenCreate({
  token,
  refresh_token,
}: TokenModel): Promise<void> {
  try {
    await AsyncStorage.setItem(
      TOKEN_COLLETION,
      JSON.stringify({ token, refresh_token }),
    );
  } catch (e) {
    throw new Error('Error saving token');
  }
}
