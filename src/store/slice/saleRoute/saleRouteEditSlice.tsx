import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ClientModel } from '@models/ClientModel';

const saleRouteEditSlice = createSlice({
  name: 'saleRouteEdit',
  initialState: {} as ClientModel,
  reducers: {
    addSaleRouteEdit: (
      state: ClientModel,
      action: PayloadAction<ClientModel>,
    ) => {
      return action.payload;
    },
    updateSaleRouteEdit: (
      state: ClientModel,
      action: PayloadAction<ClientModel>,
    ) => {
      return action.payload;
    },
    deleteSaleRouteEdit: () => {
      return {} as ClientModel;
    },
  },
});

export const { addSaleRouteEdit, updateSaleRouteEdit, deleteSaleRouteEdit } =
  saleRouteEditSlice.actions;

export default saleRouteEditSlice.reducer;
