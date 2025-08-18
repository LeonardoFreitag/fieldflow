import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TravelClientsModel } from '@models/TravelClientsModel';

const travelClientEditSlice = createSlice({
  name: 'travelClientEdit',
  initialState: {} as TravelClientsModel,
  reducers: {
    addTravelClientEdit: (
      state: TravelClientsModel,
      action: PayloadAction<TravelClientsModel>,
    ) => {
      return action.payload;
    },
    updateTravelClientEdit: (
      state: TravelClientsModel,
      action: PayloadAction<TravelClientsModel>,
    ) => {
      return action.payload;
    },
    deleteTravelClientEdit: () => {
      return {} as TravelClientsModel;
    },
    resetTravelClientEdit: () => {
      return {} as TravelClientsModel;
    },
  },
});

export const {
  addTravelClientEdit,
  updateTravelClientEdit,
  deleteTravelClientEdit,
  resetTravelClientEdit,
} = travelClientEditSlice.actions;

export default travelClientEditSlice.reducer;
