import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TravelClientOrdersItemsModel } from '@models/TravelClientOrdersItemsModel';

const travelClientOrderItemsEditSlice = createSlice({
  name: 'travelClientOrderItemsEdit',
  initialState: {} as TravelClientOrdersItemsModel,
  reducers: {
    addTravelClientOrderItemsEdit: (
      state: TravelClientOrdersItemsModel,
      action: PayloadAction<TravelClientOrdersItemsModel>,
    ) => {
      return action.payload;
    },
    updateTravelClientOrderItemsEdit: (
      state: TravelClientOrdersItemsModel,
      action: PayloadAction<TravelClientOrdersItemsModel>,
    ) => {
      return action.payload;
    },
    deleteTravelClientOrderItemsEdit: () => {
      return {} as TravelClientOrdersItemsModel;
    },
    resetTravelClientOrderItemsEdit: () => {
      return {} as TravelClientOrdersItemsModel;
    },
  },
});

export const {
  addTravelClientOrderItemsEdit,
  updateTravelClientOrderItemsEdit,
  deleteTravelClientOrderItemsEdit,
  resetTravelClientOrderItemsEdit,
} = travelClientOrderItemsEditSlice.actions;

export default travelClientOrderItemsEditSlice.reducer;
