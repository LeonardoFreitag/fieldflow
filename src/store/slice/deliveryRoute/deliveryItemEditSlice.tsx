import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type DeliveryItemModel } from '@models/DeliveryItemModel';

const deliveryItemEditSlice = createSlice({
  name: 'deliveryItemEdit',
  initialState: {} as DeliveryItemModel,
  reducers: {
    addDeliveryItemEdit: (
      state: DeliveryItemModel,
      action: PayloadAction<DeliveryItemModel>,
    ) => {
      return action.payload;
    },
    updateDeliveryItemEdit: (
      state: DeliveryItemModel,
      action: PayloadAction<DeliveryItemModel>,
    ) => {
      return action.payload;
    },
    deleteDeliveryItemEdit: () => {
      return {} as DeliveryItemModel;
    },
  },
});

export const {
  addDeliveryItemEdit,
  updateDeliveryItemEdit,
  deleteDeliveryItemEdit,
} = deliveryItemEditSlice.actions;

export default deliveryItemEditSlice.reducer;
