import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type DeliveryQueueModel } from '@models/DeliveryQueueModel';

const deliveryQueueListSlice = createSlice({
  name: 'deliveryQueueList',
  initialState: [] as DeliveryQueueModel[],
  reducers: {
    loadDeliveryQueueList: (
      state: DeliveryQueueModel[],
      action: PayloadAction<DeliveryQueueModel[]>,
    ) => {
      return action.payload;
    },
    addDeliveryQueueList: (
      state: DeliveryQueueModel[],
      action: PayloadAction<DeliveryQueueModel>,
    ) => {
      state.push(action.payload);
    },
    updateDeliveryQueueList: (
      state: DeliveryQueueModel[],
      action: PayloadAction<DeliveryQueueModel>,
    ) => {
      return state.map(product => {
        if (product.id === action.payload.id) {
          return action.payload;
        }
        return product;
      });
    },
    deleteDeliveryQueueList: (
      state: DeliveryQueueModel[],
      action: PayloadAction<DeliveryQueueModel>,
    ) => {
      return state.filter(product => product.id !== action.payload.id);
    },
  },
});

export const {
  loadDeliveryQueueList,
  addDeliveryQueueList,
  updateDeliveryQueueList,
  deleteDeliveryQueueList,
} = deliveryQueueListSlice.actions;

export default deliveryQueueListSlice.reducer;
