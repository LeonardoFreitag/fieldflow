import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRAVEL_COLLETION } from '../storageConfig';
import { type TravelModel } from '@models/TravelModel';

export async function CreateTravel(travel: TravelModel): Promise<void> {
  try {
    const newTravel = JSON.stringify(travel);

    await AsyncStorage.setItem(TRAVEL_COLLETION, newTravel);
  } catch (e) {
    throw new Error('Error saving route');
  }
}
