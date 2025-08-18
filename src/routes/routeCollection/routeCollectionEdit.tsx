import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ReceberModel } from '@models/ReceberModel';

const routeCollectionEditSlice = createSlice({
  name: 'routeCollectionEdit',
  initialState: {} as ReceberModel,
  reducers: {
    addRouteCollectionEdit: (
      state: ReceberModel,
      action: PayloadAction<ReceberModel>,
    ) => {
      return action.payload;
    },
    updateRouteCollectionEdit: (
      state: ReceberModel,
      action: PayloadAction<ReceberModel>,
    ) => {
      return action.payload;
    },
    deleteRouteCollectionEdit: () => {
      return {} as ReceberModel;
    },
  },
});

export const {
  addRouteCollectionEdit,
  updateRouteCollectionEdit,
  deleteRouteCollectionEdit,
} = routeCollectionEditSlice.actions;

export default routeCollectionEditSlice.reducer;
