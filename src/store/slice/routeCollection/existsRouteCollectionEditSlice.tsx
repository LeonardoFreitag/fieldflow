import { type ExistsRouteCollectionModel } from '@models/ExistsRouteCollectionModel';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const existsRouteCollectionEditSlice = createSlice({
  name: 'existsRouteCollectionEdit',
  initialState: {} as ExistsRouteCollectionModel,
  reducers: {
    addExistsRouteCollectionEdit: (
      state: ExistsRouteCollectionModel,
      action: PayloadAction<ExistsRouteCollectionModel>,
    ) => {
      return action.payload;
    },
    updateExistsRouteCollectionEdit: (
      state: ExistsRouteCollectionModel,
      action: PayloadAction<ExistsRouteCollectionModel>,
    ) => {
      return action.payload;
    },
    deleteExistsRouteCollectionEdit: () => {
      return {} as ExistsRouteCollectionModel;
    },
  },
});

export const {
  addExistsRouteCollectionEdit,
  updateExistsRouteCollectionEdit,
  deleteExistsRouteCollectionEdit,
} = existsRouteCollectionEditSlice.actions;

export default existsRouteCollectionEditSlice.reducer;
