import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEARCHWORDS_COLLETION } from '../storageConfig';

export async function searchWordsGetAll(): Promise<string[]> {
  try {
    const storage = await AsyncStorage.getItem(SEARCHWORDS_COLLETION);

    const searchWords: string[] = storage ? JSON.parse(storage) : [];

    return searchWords;
  } catch (e) {
    throw new Error('Error getting searchWords');
  }
}
