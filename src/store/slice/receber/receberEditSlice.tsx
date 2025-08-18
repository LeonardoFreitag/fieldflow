import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ReceberModel } from '@models/ReceberModel';

const receberEditSlice = createSlice({
  name: 'receberEdit',
  initialState: {} as ReceberModel,
  reducers: {
    addReceberEdit: (
      state: ReceberModel,
      action: PayloadAction<ReceberModel>,
    ) => {
      return action.payload;
    },
    updateReceberEdit: (
      state: ReceberModel,
      action: PayloadAction<ReceberModel>,
    ) => {
      return action.payload;
    },
    deleteReceberEdit: () => {
      return {} as ReceberModel;
    },
  },
});

export const { addReceberEdit, updateReceberEdit, deleteReceberEdit } =
  receberEditSlice.actions;

export default receberEditSlice.reducer;
