import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ClientModel } from '@models/ClientModel';

const saleRouteListSlice = createSlice({
  name: 'saleRouteList',
  initialState: [] as ClientModel[],
  reducers: {
    loadSaleRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel[]>,
    ) => {
      return action.payload;
    },
    addSaleRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      state.push(action.payload);
    },
    updateSaleRouteList: (
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
    deleteSaleRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadSaleRouteList,
  addSaleRouteList,
  updateSaleRouteList,
  deleteSaleRouteList,
} = saleRouteListSlice.actions;

export default saleRouteListSlice.reducer;
