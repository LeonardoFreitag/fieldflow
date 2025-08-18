import AsyncStorage from '@react-native-async-storage/async-storage';
import { NUVEM_COLLETION } from '../storageConfig';
import { type NuvemDTO } from '@dtos/NuvemDTO';

export async function nuvemGet(): Promise<NuvemDTO> {
  try {
    const jsonValue = String(await AsyncStorage.getItem(NUVEM_COLLETION));

    if (jsonValue === '') {
      return {} as NuvemDTO;
    }

    const currentUser: NuvemDTO = JSON.parse(jsonValue);

    return currentUser;
  } catch (e) {
    throw new Error('Error getting company');
  }
}
