import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type RouteCollectionItemsModel } from '@models/RouteCollectionItemsModel';

const routeCollectionItemsListSlice = createSlice({
  name: 'routeCollectionItemsList',
  initialState: [] as RouteCollectionItemsModel[],
  reducers: {
    loadRouteCollectionItemsList: (
      state: RouteCollectionItemsModel[],
      action: PayloadAction<RouteCollectionItemsModel[]>,
    ) => {
      return action.payload;
    },
    addRouteCollectionItemsList: (
      state: RouteCollectionItemsModel[],
      action: PayloadAction<RouteCollectionItemsModel>,
    ) => {
      state.push(action.payload);
    },
    updateRouteCollectionItemsList: (
      state: RouteCollectionItemsModel[],
      action: PayloadAction<RouteCollectionItemsModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteRouteCollectionItemsList: (
      state: RouteCollectionItemsModel[],
      action: PayloadAction<RouteCollectionItemsModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadRouteCollectionItemsList,
  addRouteCollectionItemsList,
  updateRouteCollectionItemsList,
  deleteRouteCollectionItemsList,
} = routeCollectionItemsListSlice.actions;

export default routeCollectionItemsListSlice.reducer;
