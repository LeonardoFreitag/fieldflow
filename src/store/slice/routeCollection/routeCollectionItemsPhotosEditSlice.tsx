import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type RouteCollectionItemsPhotosModel } from '@models/RouteCollectionItemsPhotosModel';

const routeCollectonItemsPhotosEditSlice = createSlice({
  name: 'routeCollectonItemsPhotosEdit',
  initialState: {} as RouteCollectionItemsPhotosModel,
  reducers: {
    addRouteCollectonItemsPhotosEdit: (
      state: RouteCollectionItemsPhotosModel,
      action: PayloadAction<RouteCollectionItemsPhotosModel>,
    ) => {
      return action.payload;
    },
    updateRouteCollectonItemsPhotosEdit: (
      state: RouteCollectionItemsPhotosModel,
      action: PayloadAction<RouteCollectionItemsPhotosModel>,
    ) => {
      return action.payload;
    },
    deleteRouteCollectonItemsPhotosEdit: () => {
      return {} as RouteCollectionItemsPhotosModel;
    },
  },
});

export const {
  addRouteCollectonItemsPhotosEdit,
  updateRouteCollectonItemsPhotosEdit,
  deleteRouteCollectonItemsPhotosEdit,
} = routeCollectonItemsPhotosEditSlice.actions;

export default routeCollectonItemsPhotosEditSlice.reducer;
