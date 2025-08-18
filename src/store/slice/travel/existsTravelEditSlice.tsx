import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ExistsTravelModel } from '@models/ExistsTravelModel';

const existsTravelEditSlice = createSlice({
  name: 'existsTravelEdit',
  initialState: {} as ExistsTravelModel,
  reducers: {
    addExistsTravelEdit: (
      state: ExistsTravelModel,
      action: PayloadAction<ExistsTravelModel>,
    ) => {
      return action.payload;
    },
    updateExistsTravelEdit: (
      state: ExistsTravelModel,
      action: PayloadAction<ExistsTravelModel>,
    ) => {
      return action.payload;
    },
    deleteExistsTravelEdit: () => {
      return {} as ExistsTravelModel;
    },
  },
});

export const {
  addExistsTravelEdit,
  updateExistsTravelEdit,
  deleteExistsTravelEdit,
} = existsTravelEditSlice.actions;

export default existsTravelEditSlice.reducer;
