import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ClientModel } from '@models/ClientModel';

const clientListSlice = createSlice({
  name: 'clientList',
  initialState: [] as ClientModel[],
  reducers: {
    loadClientList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel[]>,
    ) => {
      return action.payload;
    },
    addClientList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      state.push(action.payload);
    },
    updateClientList: (
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
    deleteClientList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
    resetClientList: () => {
      return [];
    },
  },
});

export const {
  loadClientList,
  addClientList,
  updateClientList,
  deleteClientList,
  resetClientList,
} = clientListSlice.actions;

export default clientListSlice.reducer;
