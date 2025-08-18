import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ExistsDeliveryRouteModel } from '@models/ExistsDeliveryRouteModel';

const existsDeliveryRouteEditSlice = createSlice({
  name: 'existsDeliveryRouteEdit',
  initialState: {} as ExistsDeliveryRouteModel,
  reducers: {
    addExistsDeliveryRouteEdit: (
      state: ExistsDeliveryRouteModel,
      action: PayloadAction<ExistsDeliveryRouteModel>,
    ) => {
      return action.payload;
    },
    updateExistsDeliveryRouteEdit: (
      state: ExistsDeliveryRouteModel,
      action: PayloadAction<ExistsDeliveryRouteModel>,
    ) => {
      return action.payload;
    },
    deleteExistsDeliveryRouteEdit: () => {
      return {} as ExistsDeliveryRouteModel;
    },
  },
});

export const {
  addExistsDeliveryRouteEdit,
  updateExistsDeliveryRouteEdit,
  deleteExistsDeliveryRouteEdit,
} = existsDeliveryRouteEditSlice.actions;

export default existsDeliveryRouteEditSlice.reducer;
