import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ExistsDeliveryRouteModel } from '@models/ExistsDeliveryRouteModel';

const chargeIsCompleteEditSlice = createSlice({
  name: 'chargeIsCompleteEdit',
  initialState: {} as ExistsDeliveryRouteModel,
  reducers: {
    addChargeIsCompleteEdit: (
      state: ExistsDeliveryRouteModel,
      action: PayloadAction<ExistsDeliveryRouteModel>,
    ) => {
      return action.payload;
    },
    updateChargeIsCompleteEdit: (
      state: ExistsDeliveryRouteModel,
      action: PayloadAction<ExistsDeliveryRouteModel>,
    ) => {
      return action.payload;
    },
    deleteChargeIsCompleteEdit: () => {
      return {} as ExistsDeliveryRouteModel;
    },
  },
});

export const {
  addChargeIsCompleteEdit,
  updateChargeIsCompleteEdit,
  deleteChargeIsCompleteEdit,
} = chargeIsCompleteEditSlice.actions;

export default chargeIsCompleteEditSlice.reducer;
