import { createSlice } from '@reduxjs/toolkit';
import { resetStore } from '..';

export interface Setting {
  collapsed?: boolean;
}
export type SettingState = Setting;

const initialState: SettingState = {};

export const settingSlice = createSlice({
  name: 'setting',
  initialState: initialState,
  reducers: {
    changeSetting: (state, action) => {
      const payload = action.payload;
      state = {
        ...state,
        [payload.key]: payload.value,
      };
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetStore, () => initialState);
  },
});

export const { changeSetting } = settingSlice.actions;

export default settingSlice.reducer;
