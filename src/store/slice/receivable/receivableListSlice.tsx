import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ReceivableModel } from '@models/ReceivableModel';

const receivableListSlice = createSlice({
  name: 'receivableList',
  initialState: [] as ReceivableModel[],
  reducers: {
    loadReceivableList: (
      state: ReceivableModel[],
      action: PayloadAction<ReceivableModel[]>,
    ) => {
      return action.payload;
    },
    addReceivableList: (
      state: ReceivableModel[],
      action: PayloadAction<ReceivableModel>,
    ) => {
      state.push(action.payload);
    },
    updateReceivableList: (
      state: ReceivableModel[],
      action: PayloadAction<ReceivableModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteReceivableList: (
      state: ReceivableModel[],
      action: PayloadAction<ReceivableModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadReceivableList,
  addReceivableList,
  updateReceivableList,
  deleteReceivableList,
} = receivableListSlice.actions;

export default receivableListSlice.reducer;
