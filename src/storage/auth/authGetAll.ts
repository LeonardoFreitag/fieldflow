import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_COLLETION } from '../storageConfig';
import { type UserAuthModel } from '@models/UserAuthModel';

export async function authGetAll(): Promise<UserAuthModel> {
  try {
    const storage = await AsyncStorage.getItem(AUTH_COLLETION);

    if (!storage) {
      throw new Error('No user data found');
    }

    const user: UserAuthModel = JSON.parse(storage);

    return user;
  } catch (error) {
    throw new Error('Error retrieving user data');
  }
}
