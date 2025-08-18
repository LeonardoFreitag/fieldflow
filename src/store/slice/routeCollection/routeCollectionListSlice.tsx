import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type RouteCollectionModel } from '@models/RouteCollectionModel';

const routeCollectionListSlice = createSlice({
  name: 'routeCollectionList',
  initialState: [] as RouteCollectionModel[],
  reducers: {
    loadRouteCollectionList: (
      state: RouteCollectionModel[],
      action: PayloadAction<RouteCollectionModel[]>,
    ) => {
      return action.payload;
    },
    addRouteCollectionList: (
      state: RouteCollectionModel[],
      action: PayloadAction<RouteCollectionModel>,
    ) => {
      state.push(action.payload);
    },
    updateRouteCollectionList: (
      state: RouteCollectionModel[],
      action: PayloadAction<RouteCollectionModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteRouteCollectionList: (
      state: RouteCollectionModel[],
      action: PayloadAction<RouteCollectionModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadRouteCollectionList,
  addRouteCollectionList,
  updateRouteCollectionList,
  deleteRouteCollectionList,
} = routeCollectionListSlice.actions;

export default routeCollectionListSlice.reducer;
