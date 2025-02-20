import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type SaleItemModel } from '@models/SaleItemModel';

const saleItemEditSlice = createSlice({
  name: 'saleItemEdit',
  initialState: {} as SaleItemModel,
  reducers: {
    addSaleItemEdit: (
      state: SaleItemModel,
      action: PayloadAction<SaleItemModel>,
    ) => {
      return action.payload;
    },
    updateSaleItemEdit: (
      state: SaleItemModel,
      action: PayloadAction<SaleItemModel>,
    ) => {
      return action.payload;
    },
    deleteSaleItemEdit: () => {
      return {} as SaleItemModel;
    },
  },
});

export const { addSaleItemEdit, updateSaleItemEdit, deleteSaleItemEdit } =
  saleItemEditSlice.actions;

export default saleItemEditSlice.reducer;
