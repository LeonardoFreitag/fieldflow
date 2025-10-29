import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ClientModel } from '@models/ClientModel';

const clientAdHocListSlice = createSlice({
  name: 'clientAdHocList',
  initialState: [] as ClientModel[],
  reducers: {
    loadClientAdHocList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel[]>,
    ) => {
      return action.payload;
    },
    addClientAdHocList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      state.push(action.payload);
    },
    updateClientAdHocList: (
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
    deleteClientAdHocList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
    resetClientAdHocList: () => {
      return [];
    },
  },
});

export const {
  loadClientAdHocList,
  addClientAdHocList,
  updateClientAdHocList,
  deleteClientAdHocList,
  resetClientAdHocList,
} = clientAdHocListSlice.actions;

export default clientAdHocListSlice.reducer;
