import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type DeliveryQueueModel } from '@models/DeliveryQueueModel';

const deliveryQueueEditSlice = createSlice({
  name: 'deliveryQueueEdit',
  initialState: {} as DeliveryQueueModel,
  reducers: {
    addDeliveryQueueEdit: (
      state: DeliveryQueueModel,
      action: PayloadAction<DeliveryQueueModel>,
    ) => {
      return action.payload;
    },
    updateDeliveryQueueEdit: (
      state: DeliveryQueueModel,
      action: PayloadAction<DeliveryQueueModel>,
    ) => {
      return action.payload;
    },
    deleteDeliveryQueueEdit: () => {
      return {} as DeliveryQueueModel;
    },
  },
});

export const {
  addDeliveryQueueEdit,
  updateDeliveryQueueEdit,
  deleteDeliveryQueueEdit,
} = deliveryQueueEditSlice.actions;

export default deliveryQueueEditSlice.reducer;
