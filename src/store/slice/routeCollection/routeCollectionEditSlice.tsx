import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RouteCollectionModel } from '@models/RouteCollectionModel';

const routeCollectionEditSlice = createSlice({
  name: 'routeCollectionEdit',
  initialState: {} as RouteCollectionModel,
  reducers: {
    addRouteCollectionEdit: (
      state: RouteCollectionModel,
      action: PayloadAction<RouteCollectionModel>,
    ) => {
      return action.payload;
    },
    updateRouteCollectionEdit: (
      state: RouteCollectionModel,
      action: PayloadAction<RouteCollectionModel>,
    ) => {
      return action.payload;
    },
    deleteRouteCollectionEdit: () => {
      return {} as RouteCollectionModel;
    },
  },
});

export const {
  addRouteCollectionEdit,
  updateRouteCollectionEdit,
  deleteRouteCollectionEdit,
} = routeCollectionEditSlice.actions;

export default routeCollectionEditSlice.reducer;
