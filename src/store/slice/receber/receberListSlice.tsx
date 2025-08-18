import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ReceberModel } from '@models/ReceberModel';

const receberListSlice = createSlice({
  name: 'receberList',
  initialState: [] as ReceberModel[],
  reducers: {
    loadReceberList: (
      state: ReceberModel[],
      action: PayloadAction<ReceberModel[]>,
    ) => {
      return action.payload;
    },
    addReceberList: (
      state: ReceberModel[],
      action: PayloadAction<ReceberModel>,
    ) => {
      state.push(action.payload);
    },
    updateReceberList: (
      state: ReceberModel[],
      action: PayloadAction<ReceberModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteReceberList: (
      state: ReceberModel[],
      action: PayloadAction<ReceberModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadReceberList,
  addReceberList,
  updateReceberList,
  deleteReceberList,
} = receberListSlice.actions;

export default receberListSlice.reducer;
