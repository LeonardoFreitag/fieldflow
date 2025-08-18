import { type RouteCollectionItemsPhotosModel } from '@models/RouteCollectionItemsPhotosModel';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

const routeCollectionItemsPhotosListSlice = createSlice({
  name: 'routeCollectionItemsPhotosList',
  initialState: [] as RouteCollectionItemsPhotosModel[],
  reducers: {
    loadRouteCollectionItemsPhotosList: (
      state: RouteCollectionItemsPhotosModel[],
      action: PayloadAction<RouteCollectionItemsPhotosModel[]>,
    ) => {
      return action.payload;
    },
    addRouteCollectionItemsPhotosList: (
      state: RouteCollectionItemsPhotosModel[],
      action: PayloadAction<RouteCollectionItemsPhotosModel>,
    ) => {
      state.push(action.payload);
    },
    updateRouteCollectionItemsPhotosList: (
      state: RouteCollectionItemsPhotosModel[],
      action: PayloadAction<RouteCollectionItemsPhotosModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteRouteCollectionItemsPhotosList: (
      state: RouteCollectionItemsPhotosModel[],
      action: PayloadAction<RouteCollectionItemsPhotosModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadRouteCollectionItemsPhotosList,
  addRouteCollectionItemsPhotosList,
  updateRouteCollectionItemsPhotosList,
  deleteRouteCollectionItemsPhotosList,
} = routeCollectionItemsPhotosListSlice.actions;

export default routeCollectionItemsPhotosListSlice.reducer;
