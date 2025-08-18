import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type RouteCollectionNotFoundClientModel } from '@models/RouteCollectionNotFoundClientModel';

const routeCollectionNotFoundClientListSlice = createSlice({
  name: 'routeCollectionNotFoundClientList',
  initialState: [] as RouteCollectionNotFoundClientModel[],
  reducers: {
    loadRouteCollectionNotFoundClientList: (
      state: RouteCollectionNotFoundClientModel[],
      action: PayloadAction<RouteCollectionNotFoundClientModel[]>,
    ) => {
      return action.payload;
    },
    addRouteCollectionNotFoundClientList: (
      state: RouteCollectionNotFoundClientModel[],
      action: PayloadAction<RouteCollectionNotFoundClientModel>,
    ) => {
      state.push(action.payload);
    },
    updateRouteCollectionNotFoundClientList: (
      state: RouteCollectionNotFoundClientModel[],
      action: PayloadAction<RouteCollectionNotFoundClientModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteRouteCollectionNotFoundClientList: (
      state: RouteCollectionNotFoundClientModel[],
      action: PayloadAction<RouteCollectionNotFoundClientModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadRouteCollectionNotFoundClientList,
  addRouteCollectionNotFoundClientList,
  updateRouteCollectionNotFoundClientList,
  deleteRouteCollectionNotFoundClientList,
} = routeCollectionNotFoundClientListSlice.actions;

export default routeCollectionNotFoundClientListSlice.reducer;
