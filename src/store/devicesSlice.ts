// src/store/devicesSlice.ts
import { Device, DeviceDetail } from '@/lib/mockData';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DevicesState = {
  byId: Record<string, Device>;
  allIds: string[];
  detailsById: Record<string, DeviceDetail>;
};

const initialState: DevicesState = {
  byId: {},
  allIds: [],
  detailsById: {},
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    upsertMany(state, action: PayloadAction<Device[]>) {
      for (const d of action.payload) {
        state.byId[d.deviceIdentifier] = d;
        if (!state.allIds.includes(d.deviceIdentifier)) state.allIds.push(d.deviceIdentifier);
      }
    },
    upsertOne(state, action: PayloadAction<Device>) {
      const d = action.payload;
      state.byId[d.deviceIdentifier] = d;
      if (!state.allIds.includes(d.deviceIdentifier)) state.allIds.push(d.deviceIdentifier);
    },
    setDetail(state, action: PayloadAction<DeviceDetail>) {
      const detail = action.payload;
      state.detailsById[detail.device.deviceIdentifier] = detail;
    },
    clear(state) {
      state.byId = {};
      state.allIds = [];
      state.detailsById = {};
    },
  },
});

export const { upsertMany, upsertOne, setDetail, clear } = devicesSlice.actions;

export default devicesSlice.reducer;
