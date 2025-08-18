import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ReceberModel } from '@models/ReceberModel';

const routeCollectionListSlice = createSlice({
  name: 'routeCollectionList',
  initialState: [] as ReceberModel[],
  reducers: {
    loadRouteCollectionList: (
      state: ReceberModel[],
      action: PayloadAction<ReceberModel[]>,
    ) => {
      return action.payload;
    },
    addRouteCollectionList: (
      state: ReceberModel[],
      action: PayloadAction<ReceberModel>,
    ) => {
      state.push(action.payload);
    },
    updateRouteCollectionList: (
      state: ReceberModel[],
      action: PayloadAction<ReceberModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteRouteCollectionList: (
      state: ReceberModel[],
      action: PayloadAction<ReceberModel>,
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
