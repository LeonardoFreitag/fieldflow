import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type CoordsModel } from '@models/CoordsModel';

const coordsEditSlice = createSlice({
  name: 'coordsEdit',
  initialState: {} as CoordsModel,
  reducers: {
    addCoordsEdit: (state: CoordsModel, action: PayloadAction<CoordsModel>) => {
      return action.payload;
    },
    updateCoordsEdit: (
      state: CoordsModel,
      action: PayloadAction<CoordsModel>,
    ) => {
      return action.payload;
    },
    deleteCoordsEdit: () => {
      return {} as CoordsModel;
    },
  },
});

export const { addCoordsEdit, updateCoordsEdit, deleteCoordsEdit } =
  coordsEditSlice.actions;

export default coordsEditSlice.reducer;
