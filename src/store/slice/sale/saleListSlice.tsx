import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type SaleModel } from '@models/SaleModel';

const saleListSlice = createSlice({
  name: 'saleList',
  initialState: [] as SaleModel[],
  reducers: {
    loadSaleList: (state: SaleModel[], action: PayloadAction<SaleModel[]>) => {
      return action.payload;
    },
    addSaleList: (state: SaleModel[], action: PayloadAction<SaleModel>) => {
      state.push(action.payload);
    },
    updateSaleList: (state: SaleModel[], action: PayloadAction<SaleModel>) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteSaleList: (state: SaleModel[], action: PayloadAction<SaleModel>) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const { loadSaleList, addSaleList, updateSaleList, deleteSaleList } =
  saleListSlice.actions;

export default saleListSlice.reducer;
