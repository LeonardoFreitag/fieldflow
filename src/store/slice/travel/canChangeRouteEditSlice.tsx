import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type CanChangeRouteModel } from '@models/CanChangeRouteModel';

const canChangeRouteEditSlice = createSlice({
  name: 'canChangeRouteEdit',
  initialState: {} as CanChangeRouteModel,
  reducers: {
    addCanChangeRouteEdit: (
      state: CanChangeRouteModel,
      action: PayloadAction<CanChangeRouteModel>,
    ) => {
      return action.payload;
    },
    updateCanChangeRouteEdit: (
      state: CanChangeRouteModel,
      action: PayloadAction<CanChangeRouteModel>,
    ) => {
      return action.payload;
    },
    deleteCanChangeRouteEdit: () => {
      return {} as CanChangeRouteModel;
    },
  },
});

export const {
  addCanChangeRouteEdit,
  updateCanChangeRouteEdit,
  deleteCanChangeRouteEdit,
} = canChangeRouteEditSlice.actions;

export default canChangeRouteEditSlice.reducer;
