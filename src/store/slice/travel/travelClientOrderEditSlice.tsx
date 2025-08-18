import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TravelClientOrdersModel } from '@models/TravelClientOrdersModel';

const travelClientOrderEditSlice = createSlice({
  name: 'travelClientOrderEdit',
  initialState: {} as TravelClientOrdersModel,
  reducers: {
    addTravelClientOrderEdit: (
      state: TravelClientOrdersModel,
      action: PayloadAction<TravelClientOrdersModel>,
    ) => {
      return action.payload;
    },
    updateTravelClientOrderEdit: (
      state: TravelClientOrdersModel,
      action: PayloadAction<TravelClientOrdersModel>,
    ) => {
      return action.payload;
    },
    deleteTravelClientOrderEdit: () => {
      return {} as TravelClientOrdersModel;
    },
    resetTravelClientOrderEdit: () => {
      return {} as TravelClientOrdersModel;
    },
  },
});

export const {
  addTravelClientOrderEdit,
  updateTravelClientOrderEdit,
  deleteTravelClientOrderEdit,
  resetTravelClientOrderEdit,
} = travelClientOrderEditSlice.actions;

export default travelClientOrderEditSlice.reducer;
