import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ReceivableModel } from '@models/ReceivableModel';

const receivableEditSlice = createSlice({
  name: 'receivableEdit',
  initialState: {} as ReceivableModel,
  reducers: {
    addReceivableEdit: (
      state: ReceivableModel,
      action: PayloadAction<ReceivableModel>,
    ) => {
      return action.payload;
    },
    updateReceivableEdit: (
      state: ReceivableModel,
      action: PayloadAction<ReceivableModel>,
    ) => {
      return action.payload;
    },
    deleteReceivableEdit: () => {
      return {} as ReceivableModel;
    },
  },
});

export const { addReceivableEdit, updateReceivableEdit, deleteReceivableEdit } =
  receivableEditSlice.actions;

export default receivableEditSlice.reducer;
