import { combineReducers, configureStore } from '@reduxjs/toolkit';
import customerEditSlice from './slice/customer/customerEditSlice';
import customerListSlice from './slice/customer/customerListSlice';
import saleEditSlice from './slice/sale/saleEditSlice';
import saleListSlice from './slice/sale/saleListSlice';
import saleItemEditSlice from './slice/saleItem/saleItemEditSlice';
import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import productListSlice from './slice/product/productListSlice';

const rootReducer = combineReducers({
  customerEdit: customerEditSlice,
  customerList: customerListSlice,
  saleEdit: saleEditSlice,
  saleList: saleListSlice,
  saleItemEdit: saleItemEditSlice,
  productList: productListSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
