// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import devicesReducer from './devicesSlice';

export const store = configureStore({
  reducer: { devices: devicesReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
