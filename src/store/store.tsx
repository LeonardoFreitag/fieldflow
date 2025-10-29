import { combineReducers, configureStore } from '@reduxjs/toolkit';
import customerEditSlice from './slice/customer/customerEditSlice';
import customerListSlice from './slice/customer/customerListSlice';
import saleEditSlice from './slice/sale/saleEditSlice';
import saleListSlice from './slice/sale/saleListSlice';
import saleItemEditSlice from './slice/saleItem/saleItemEditSlice';
import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import productListSlice from './slice/product/productListSlice';
import receivableEditSlice from './slice/receivable/receivableEditSlice';
import receivableListSlice from './slice/receivable/receivableListSlice';
import clientEditSlice from './slice/client/clientEditSlice';
import clientListSlice from './slice/client/clientListSlice';
import allClientListSlice from './slice/client/allClientListSlice';
import clientAdHocListSlice from './slice/client/clientAdHocListSlice';
import clientRouteListSlice from './slice/client/clientRouteListSlice';
import coordsEditSlice from './slice/coords/coordsEditSlice';
import saleRouteListSlice from './slice/saleRoute/saleRouteListSlice';
import saleRouteEditSlice from './slice/saleRoute/saleRouteEditSlice';
import travelEditSlice from './slice/travel/travelEditSlice';
import travelListSlice from './slice/travel/travelListSlice';
import existsTravelEditSlice from './slice/travel/existsTravelEditSlice';
import travelClientEditSlice from './slice/travel/travelClientEditSlice';
import travelClientOrderEditSlice from './slice/travel/travelClientOrderEditSlice';
import travelClientOrderItemEditSlice from './slice/travel/travelClientOrderItemEditSlice';
import travelClientOrdersPaymentFormListSlice from './slice/travel/travelClientOrderPamentFormListSlice';
import canChangeRouteEditSlice from './slice/travel/canChangeRouteEditSlice';
import deliveryQueueEditSlice from './slice/deliveryQueue/deliveryQueueEditSlice';
import deliveryQueueListSlice from './slice/deliveryQueue/deliveryQueueListSlice';
import deliveryRouteEditSlice from './slice/deliveryRoute/deliveryRouteEditSlice';
import deliveryItemEditSlice from './slice/deliveryRoute/deliveryItemEditSlice';
import deliveryItemPhotoEditSlice from './slice/deliveryRoute/deliveryItemPhotoEditSlice';
import existsDeliveryRouteEditSlice from './slice/deliveryRoute/existsDeliveryRouteEditSlice';
import chargeIsCompleteEditSlice from './slice/deliveryRoute/chargeIsCompleteEditSlice';
import receberEditSlice from './slice/receber/receberEditSlice';
import receberListSlice from './slice/receber/receberListSlice';
import routeCollectionListSlice from './slice/routeCollection/routeCollectionListSlice';
import routeCollectionEditSlice from './slice/routeCollection/routeCollectionEditSlice';
import routeCollectionItemsListSlice from './slice/routeCollection/routeCollectionItemsListSlice';
import routeCollectionItemsEditSlice from './slice/routeCollection/routeCollectionItemsEditSlice';
import routeCollectionItemsPhotosEditSlice from './slice/routeCollection/routeCollectionItemsPhotosEditSlice';
import routeCollectionItemsPhotosListSlice from './slice/routeCollection/routeCollectionItemsPhotosListSlice';
import routeCollectionNotFoundClientEditSlice from './slice/routeCollection/routeCollectionNotFoundClientEditSlice';
import routeCollectionNotFoundClientListSlice from './slice/routeCollection/routeCollectionNotFoundClientListSlice';
import existsRouteCollectionEditSlice from './slice/routeCollection/existsRouteCollectionEditSlice';

const rootReducer = combineReducers({
  customerEdit: customerEditSlice,
  customerList: customerListSlice,
  saleEdit: saleEditSlice,
  saleList: saleListSlice,
  saleItemEdit: saleItemEditSlice,
  productList: productListSlice,
  receivableEdit: receivableEditSlice,
  receivableList: receivableListSlice,
  clientEdit: clientEditSlice,
  clientList: clientListSlice,
  allClientList: allClientListSlice,
  clientAdHocList: clientAdHocListSlice,
  clientRouteList: clientRouteListSlice,
  coordsEdit: coordsEditSlice,
  saleRouteList: saleRouteListSlice,
  saleRouteEdit: saleRouteEditSlice,
  travelEdit: travelEditSlice,
  travelList: travelListSlice,
  existsTravelEdit: existsTravelEditSlice,
  travelClientEdit: travelClientEditSlice,
  travelClientOrderEdit: travelClientOrderEditSlice,
  travelClientOrderItemEdit: travelClientOrderItemEditSlice,
  travelClientOrdersPaymentFormList: travelClientOrdersPaymentFormListSlice,
  canChangeRouteEdit: canChangeRouteEditSlice,
  deliveryQueueEdit: deliveryQueueEditSlice,
  deliveryQueueList: deliveryQueueListSlice,
  deliveryRouteEdit: deliveryRouteEditSlice,
  deliveryItemEdit: deliveryItemEditSlice,
  deliveryItemPhotoEdit: deliveryItemPhotoEditSlice,
  existsDeliveryRouteEdit: existsDeliveryRouteEditSlice,
  chargeIsCompleteEdit: chargeIsCompleteEditSlice,
  receberEdit: receberEditSlice,
  receberList: receberListSlice,
  routeCollectionList: routeCollectionListSlice,
  routeCollectionEdit: routeCollectionEditSlice,
  routeCollectionItemsList: routeCollectionItemsListSlice,
  routeCollectionItemsEdit: routeCollectionItemsEditSlice,
  routeCollectionItemsPhotosEdit: routeCollectionItemsPhotosEditSlice,
  routeCollectionItemsPhotosList: routeCollectionItemsPhotosListSlice,
  routeCollectionNotFoundClientEdit: routeCollectionNotFoundClientEditSlice,
  routeCollectionNotFoundClientList: routeCollectionNotFoundClientListSlice,
  existsRouteCollectionEdit: existsRouteCollectionEditSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
