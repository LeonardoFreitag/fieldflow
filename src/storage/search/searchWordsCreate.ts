import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEARCHWORDS_COLLETION } from '../storageConfig';

export async function searchWordsCreate(searchWord: string): Promise<void> {
  try {
    const searchWordsStorage = await AsyncStorage.getItem(
      SEARCHWORDS_COLLETION,
    );

    const searchWords: string[] = searchWordsStorage
      ? JSON.parse(searchWordsStorage)
      : [];

    if (searchWords.includes(searchWord)) {
      return;
    }

    if (searchWords.length >= 10) {
      searchWords.pop();
    }

    const newSearchWords = [searchWord, ...searchWords];

    await AsyncStorage.setItem(
      SEARCHWORDS_COLLETION,
      JSON.stringify(newSearchWords),
    );
  } catch (e) {
    throw new Error('Error saving favorite');
  }
}
