import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ReasonModel } from '@models/ReasonModel';

const reasonListSlice = createSlice({
  name: 'reasonList',
  initialState: [] as ReasonModel[],
  reducers: {
    loadReasonList: (
      state: ReasonModel[],
      action: PayloadAction<ReasonModel[]>,
    ) => {
      return action.payload;
    },
    addReasonList: (
      state: ReasonModel[],
      action: PayloadAction<ReasonModel>,
    ) => {
      state.push(action.payload);
    },
    updateReasonList: (
      state: ReasonModel[],
      action: PayloadAction<ReasonModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteReasonList: (
      state: ReasonModel[],
      action: PayloadAction<ReasonModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadReasonList,
  addReasonList,
  updateReasonList,
  deleteReasonList,
} = reasonListSlice.actions;

export default reasonListSlice.reducer;
