import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ProductModel } from '@models/ProductModel';

const productEditSlice = createSlice({
  name: 'productEdit',
  initialState: {} as ProductModel,
  reducers: {
    addproductEdit: (
      state: ProductModel,
      action: PayloadAction<ProductModel>,
    ) => {
      return action.payload;
    },
    updateproductEdit: (
      state: ProductModel,
      action: PayloadAction<ProductModel>,
    ) => {
      return action.payload;
    },
    deleteproductEdit: () => {
      return {} as ProductModel;
    },
  },
});

export const { addproductEdit, updateproductEdit, deleteproductEdit } =
  productEditSlice.actions;

export default productEditSlice.reducer;
