import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_COLLETION } from '../storageConfig';
import { type UserAuthModel } from '@models/UserAuthModel';

export async function authCreate(user: UserAuthModel): Promise<void> {
  try {
    const newStorageCompany = JSON.stringify(user);

    await AsyncStorage.setItem(AUTH_COLLETION, newStorageCompany);
  } catch (e) {
    throw new Error('Error saving company');
  }
}
