import AsyncStorage from '@react-native-async-storage/async-storage';
import { NUVEM_COLLETION } from '../storageConfig';
import { type NuvemDTO } from '@dtos/NuvemDTO';

export async function nuvemCreate(tokenData: NuvemDTO): Promise<void> {
  try {
    const newStorageCompany = JSON.stringify(tokenData);

    await AsyncStorage.setItem(NUVEM_COLLETION, newStorageCompany);
  } catch (e) {
    throw new Error('Error saving data in storage');
  }
}
