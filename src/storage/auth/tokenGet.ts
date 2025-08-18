import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_COLLETION } from '../storageConfig';
import { type TokenModel } from '@models/TokenModel';

export async function tokenGet(): Promise<TokenModel> {
  try {
    const jsonValue = String(await AsyncStorage.getItem(TOKEN_COLLETION));

    const { token, refreshToken }: TokenModel = jsonValue
      ? JSON.parse(jsonValue)
      : {};

    return { token, refreshToken };
  } catch (e) {
    throw new Error('Error getting token');
  }
}
