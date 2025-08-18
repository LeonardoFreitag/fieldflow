import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ClientModel } from '@models/ClientModel';

const clientEditSlice = createSlice({
  name: 'clientEdit',
  initialState: {} as ClientModel,
  reducers: {
    addClientEdit: (state: ClientModel, action: PayloadAction<ClientModel>) => {
      return action.payload;
    },
    updateClientEdit: (
      state: ClientModel,
      action: PayloadAction<ClientModel>,
    ) => {
      return action.payload;
    },
    deleteClientEdit: () => {
      return {} as ClientModel;
    },
    resetClientEdit: () => {
      return {} as ClientModel;
    },
  },
});

export const {
  addClientEdit,
  updateClientEdit,
  deleteClientEdit,
  resetClientEdit,
} = clientEditSlice.actions;

export default clientEditSlice.reducer;
