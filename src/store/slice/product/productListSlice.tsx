import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ProductModel } from '@models/ProductModel';

const productListSlice = createSlice({
  name: 'productList',
  initialState: [] as ProductModel[],
  reducers: {
    loadProductList: (
      state: ProductModel[],
      action: PayloadAction<ProductModel[]>,
    ) => {
      return action.payload;
    },
    addProductList: (
      state: ProductModel[],
      action: PayloadAction<ProductModel>,
    ) => {
      state.push(action.payload);
    },
    updateProductList: (
      state: ProductModel[],
      action: PayloadAction<ProductModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteProductList: (
      state: ProductModel[],
      action: PayloadAction<ProductModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadProductList,
  addProductList,
  updateProductList,
  deleteProductList,
} = productListSlice.actions;

export default productListSlice.reducer;
