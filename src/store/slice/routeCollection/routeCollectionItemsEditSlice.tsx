import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RouteCollectionItemsModel } from '@models/RouteCollectionItemsModel';

const routeCollectionItemsEditSlice = createSlice({
  name: 'routeCollectionItemsEdit',
  initialState: {} as RouteCollectionItemsModel,
  reducers: {
    addRouteCollectionItemsEdit: (
      state: RouteCollectionItemsModel,
      action: PayloadAction<RouteCollectionItemsModel>,
    ) => {
      return action.payload;
    },
    updateRouteCollectionItemsEdit: (
      state: RouteCollectionItemsModel,
      action: PayloadAction<RouteCollectionItemsModel>,
    ) => {
      return action.payload;
    },
    deleteRouteCollectionItemsEdit: () => {
      return {} as RouteCollectionItemsModel;
    },
  },
});

export const {
  addRouteCollectionItemsEdit,
  updateRouteCollectionItemsEdit,
  deleteRouteCollectionItemsEdit,
} = routeCollectionItemsEditSlice.actions;

export default routeCollectionItemsEditSlice.reducer;
