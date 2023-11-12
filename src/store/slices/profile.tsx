import { createSlice } from '@reduxjs/toolkit';
import { resetStore } from '..';
import { Profile } from '../../interfaces/models/profile';

export type ProfileState = Profile | unknown;

const initialState: ProfileState = null;

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState,
  reducers: {
    updateProfile: (state, action) => {
      state = action.payload;

      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetStore, () => initialState);
  },
});

export const { updateProfile } = profileSlice.actions;

export default profileSlice.reducer;
