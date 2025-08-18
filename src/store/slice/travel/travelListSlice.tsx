import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type TravelModel } from '@models/TravelModel';

const travelListSlice = createSlice({
  name: 'travelList',
  initialState: [] as TravelModel[],
  reducers: {
    loadTravelList: (
      state: TravelModel[],
      action: PayloadAction<TravelModel[]>,
    ) => {
      return action.payload;
    },
    addTravelList: (
      state: TravelModel[],
      action: PayloadAction<TravelModel>,
    ) => {
      state.push(action.payload);
    },
    updateTravelList: (
      state: TravelModel[],
      action: PayloadAction<TravelModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteTravelList: (
      state: TravelModel[],
      action: PayloadAction<TravelModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
    resetTravelList: () => {
      return [];
    },
  },
});

export const {
  loadTravelList,
  addTravelList,
  updateTravelList,
  deleteTravelList,
  resetTravelList,
} = travelListSlice.actions;

export default travelListSlice.reducer;
