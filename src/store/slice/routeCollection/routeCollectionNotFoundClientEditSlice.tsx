import { type RouteCollectionNotFoundClientModel } from '@models/RouteCollectionNotFoundClientModel';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const routeCollectonEditSlice = createSlice({
  name: 'routeCollectonEdit',
  initialState: {} as RouteCollectionNotFoundClientModel,
  reducers: {
    addRouteCollectonEdit: (
      state: RouteCollectionNotFoundClientModel,
      action: PayloadAction<RouteCollectionNotFoundClientModel>,
    ) => {
      return action.payload;
    },
    updateRouteCollectonEdit: (
      state: RouteCollectionNotFoundClientModel,
      action: PayloadAction<RouteCollectionNotFoundClientModel>,
    ) => {
      return action.payload;
    },
    deleteRouteCollectonEdit: () => {
      return {} as RouteCollectionNotFoundClientModel;
    },
  },
});

export const {
  addRouteCollectonEdit,
  updateRouteCollectonEdit,
  deleteRouteCollectonEdit,
} = routeCollectonEditSlice.actions;

export default routeCollectonEditSlice.reducer;
