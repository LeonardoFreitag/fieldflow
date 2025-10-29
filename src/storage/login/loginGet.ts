import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_COLLETION } from '../storageConfig';
import { type LoginModel } from '@models/LoginModel';

export async function loginGet(): Promise<LoginModel> {
  try {
    const storage = await AsyncStorage.getItem(LOGIN_COLLETION);

    if (!storage) {
      return {} as LoginModel; // Return an empty object if no data is found
    }

    const user: LoginModel = JSON.parse(storage);

    return user;
  } catch (error) {
    throw new Error('Error retrieving user data');
  }
}
