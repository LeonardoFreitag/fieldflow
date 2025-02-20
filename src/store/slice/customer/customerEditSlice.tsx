import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type CustomerModel } from '@models/CustomerModel';

const customerEditSlice = createSlice({
  name: 'customerEdit',
  initialState: {} as CustomerModel,
  reducers: {
    addCustomerEdit: (
      state: CustomerModel,
      action: PayloadAction<CustomerModel>,
    ) => {
      return action.payload;
    },
    updateCustomerEdit: (
      state: CustomerModel,
      action: PayloadAction<CustomerModel>,
    ) => {
      return action.payload;
    },
    deleteCustomerEdit: () => {
      return {} as CustomerModel;
    },
  },
});

export const { addCustomerEdit, updateCustomerEdit, deleteCustomerEdit } =
  customerEditSlice.actions;

export default customerEditSlice.reducer;
