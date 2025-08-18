import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type DeliveryItemPhotoModel } from '@models/DeliveryItemPhotoModel';

const deliveryItemPhotoEditSlice = createSlice({
  name: 'deliveryItemPhotoEdit',
  initialState: {} as DeliveryItemPhotoModel,
  reducers: {
    addDeliveryItemPhotoEdit: (
      state: DeliveryItemPhotoModel,
      action: PayloadAction<DeliveryItemPhotoModel>,
    ) => {
      return action.payload;
    },
    updateDeliveryItemPhotoEdit: (
      state: DeliveryItemPhotoModel,
      action: PayloadAction<DeliveryItemPhotoModel>,
    ) => {
      return action.payload;
    },
    deleteDeliveryItemPhotoEdit: () => {
      return {} as DeliveryItemPhotoModel;
    },
  },
});

export const {
  addDeliveryItemPhotoEdit,
  updateDeliveryItemPhotoEdit,
  deleteDeliveryItemPhotoEdit,
} = deliveryItemPhotoEditSlice.actions;

export default deliveryItemPhotoEditSlice.reducer;
