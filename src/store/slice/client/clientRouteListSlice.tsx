import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ClientModel } from '@models/ClientModel';

const clientRouteListSlice = createSlice({
  name: 'clientRouteList',
  initialState: [] as ClientModel[],
  reducers: {
    loadClientRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel[]>,
    ) => {
      return action.payload;
    },
    addClientRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      state.push(action.payload);
    },
    updateClientRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      return state.map(client => {
        if (client.id === action.payload.id) {
          return action.payload;
        }
        return client;
      });
    },
    deleteClientRouteList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
    resetClientRouteList: () => {
      return [];
    },
  },
});

export const {
  loadClientRouteList,
  addClientRouteList,
  updateClientRouteList,
  deleteClientRouteList,
  resetClientRouteList,
} = clientRouteListSlice.actions;

export default clientRouteListSlice.reducer;
