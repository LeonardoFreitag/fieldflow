import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type CustomerModel } from '@models/CustomerModel';

const customerListSlice = createSlice({
  name: 'customerList',
  initialState: [] as CustomerModel[],
  reducers: {
    loadCustomerList: (
      state: CustomerModel[],
      action: PayloadAction<CustomerModel[]>,
    ) => {
      return action.payload;
    },
    addCustomerList: (
      state: CustomerModel[],
      action: PayloadAction<CustomerModel>,
    ) => {
      state.push(action.payload);
    },
    updateCustomerList: (
      state: CustomerModel[],
      action: PayloadAction<CustomerModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteCustomerList: (
      state: CustomerModel[],
      action: PayloadAction<CustomerModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadCustomerList,
  addCustomerList,
  updateCustomerList,
  deleteCustomerList,
} = customerListSlice.actions;

export default customerListSlice.reducer;
