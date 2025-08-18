import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ClientModel } from '@models/ClientModel';

const currentSaleRouteListSlice = createSlice({
  name: 'currentSaleRouteList',
  initialState: [] as ClientModel[],
  reducers: {
    loadCurrentSaleRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel[]>,
    ) => {
      return action.payload;
    },
    addCurrentSaleRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      state.push(action.payload);
    },
    updateCurrentSaleRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteCurrentSaleRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadCurrentSaleRouteList,
  addCurrentSaleRouteList,
  updateCurrentSaleRouteList,
  deleteCurrentSaleRouteList,
} = currentSaleRouteListSlice.actions;

export default currentSaleRouteListSlice.reducer;
