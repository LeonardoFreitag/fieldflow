import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRAVEL_COLLETION } from '../storageConfig';
import { type TravelModel } from '@models/TravelModel';

export async function GetTravel(): Promise<TravelModel> {
  try {
    const travelData = await AsyncStorage.getItem(TRAVEL_COLLETION);
    if (travelData) {
      return JSON.parse(travelData) as TravelModel;
    }
    return {} as TravelModel; // Return an empty object if no data found
  } catch (e) {
    throw new Error('Error saving route');
  }
}
