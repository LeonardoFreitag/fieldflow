import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type ClientModel } from '@models/ClientModel';

const allClientListSlice = createSlice({
  name: 'allClientList',
  initialState: [] as ClientModel[],
  reducers: {
    loadAllClientList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel[]>,
    ) => {
      return action.payload;
    },
    addAllClientList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      state.push(action.payload);
    },
    updateAllClientList: (
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
    deleteAllClientList: (
      state: ClientModel[],
      action: PayloadAction<ClientModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
    resetAllClientList: () => {
      return [];
    },
  },
});

export const {
  loadAllClientList,
  addAllClientList,
  updateAllClientList,
  deleteAllClientList,
  resetAllClientList,
} = allClientListSlice.actions;

export default allClientListSlice.reducer;
