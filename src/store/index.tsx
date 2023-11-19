export const resetStore = createAction('clear');
import {
  combineReducers,
  configureStore,
  createAction,
} from '@reduxjs/toolkit';
import adminSlice, { AdminState } from './slices/adminSlice';
import settingSlice, { SettingState } from './slices/settingSlice';

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import profileSlice from './slices/profile';
import { Profile } from '../interfaces/models/profile';

const persistConfig = {
  key: CONFIG.appName,
  storage,
  whitelist: ['admin'], // Specify the reducer to persist
};
console.log(persistConfig, 'persistConfig');
const rootReducer = combineReducers({
  admin: adminSlice,
  setting: settingSlice,
  profile: profileSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = {
  admin: AdminState;
  profile: Profile;
  setting: SettingState;
};
export type AppDispatch = typeof store.dispatch;
