import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_COLLETION } from '../storageConfig';
import { type LoginModel } from '@models/LoginModel';

export async function loginCreate(dataLogin: LoginModel): Promise<void> {
  try {
    const newStorageCompany = JSON.stringify(dataLogin);

    await AsyncStorage.setItem(LOGIN_COLLETION, newStorageCompany);
  } catch (e) {
    throw new Error('Error saving login');
  }
}
