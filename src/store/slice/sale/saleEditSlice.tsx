import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type SaleModel } from '@models/SaleModel';

const saleEditSlice = createSlice({
  name: 'saleEdit',
  initialState: {} as SaleModel,
  reducers: {
    addSaleEdit: (state: SaleModel, action: PayloadAction<SaleModel>) => {
      return action.payload;
    },
    updateSaleEdit: (state: SaleModel, action: PayloadAction<SaleModel>) => {
      return action.payload;
    },
    deleteSaleEdit: () => {
      return {} as SaleModel;
    },
  },
});

export const { addSaleEdit, updateSaleEdit, deleteSaleEdit } =
  saleEditSlice.actions;

export default saleEditSlice.reducer;
