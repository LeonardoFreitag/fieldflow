import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TravelModel } from '@models/TravelModel';

const travelEditSlice = createSlice({
  name: 'travelEdit',
  initialState: {} as TravelModel,
  reducers: {
    addTravelEdit: (state: TravelModel, action: PayloadAction<TravelModel>) => {
      return action.payload;
    },
    updateTravelEdit: (
      state: TravelModel,
      action: PayloadAction<TravelModel>,
    ) => {
      return action.payload;
    },
    deleteTravelEdit: () => {
      return {} as TravelModel;
    },
    resetTravelEdit: () => {
      return {} as TravelModel;
    },
  },
});

export const {
  addTravelEdit,
  updateTravelEdit,
  deleteTravelEdit,
  resetTravelEdit,
} = travelEditSlice.actions;

export default travelEditSlice.reducer;
