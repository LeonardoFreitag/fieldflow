import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type DeliveryRouteModel } from '@models/DeliveryRouteModel';

const deliveryRouteEditSlice = createSlice({
  name: 'deliveryRouteEdit',
  initialState: {} as DeliveryRouteModel,
  reducers: {
    addDeliveryRouteEdit: (
      state: DeliveryRouteModel,
      action: PayloadAction<DeliveryRouteModel>,
    ) => {
      return action.payload;
    },
    updateDeliveryRouteEdit: (
      state: DeliveryRouteModel,
      action: PayloadAction<DeliveryRouteModel>,
    ) => {
      return action.payload;
    },
    deleteDeliveryRouteEdit: () => {
      return {} as DeliveryRouteModel;
    },
  },
});

export const {
  addDeliveryRouteEdit,
  updateDeliveryRouteEdit,
  deleteDeliveryRouteEdit,
} = deliveryRouteEditSlice.actions;

export default deliveryRouteEditSlice.reducer;
