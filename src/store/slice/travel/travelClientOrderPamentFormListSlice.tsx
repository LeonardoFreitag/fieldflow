import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type TravelClientOrdersPaymentFormModel } from '@models/TravelClientOrdersPaymentFormModel';

const travelClientOrdersPaymentFormListSlice = createSlice({
  name: 'travelClientOrdersPaymentFormList',
  initialState: [] as TravelClientOrdersPaymentFormModel[],
  reducers: {
    loadTravelClientOrdersPaymentFormList: (
      state: TravelClientOrdersPaymentFormModel[],
      action: PayloadAction<TravelClientOrdersPaymentFormModel[]>,
    ) => {
      return action.payload;
    },
    addTravelClientOrdersPaymentFormList: (
      state: TravelClientOrdersPaymentFormModel[],
      action: PayloadAction<TravelClientOrdersPaymentFormModel>,
    ) => {
      state.push(action.payload);
    },
    updateTravelClientOrdersPaymentFormList: (
      state: TravelClientOrdersPaymentFormModel[],
      action: PayloadAction<TravelClientOrdersPaymentFormModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteTravelClientOrdersPaymentFormList: (
      state: TravelClientOrdersPaymentFormModel[],
      action: PayloadAction<TravelClientOrdersPaymentFormModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
    resetTravelClientOrdersPaymentFormList: () => {
      return [];
    },
  },
});

export const {
  loadTravelClientOrdersPaymentFormList,
  addTravelClientOrdersPaymentFormList,
  updateTravelClientOrdersPaymentFormList,
  deleteTravelClientOrdersPaymentFormList,
  resetTravelClientOrdersPaymentFormList,
} = travelClientOrdersPaymentFormListSlice.actions;

export default travelClientOrdersPaymentFormListSlice.reducer;
