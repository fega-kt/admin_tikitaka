import { createSlice } from '@reduxjs/toolkit';

export type ProfileState = unknown;

const initialState: ProfileState = null;

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState,
  reducers: {
    updateProfile: (state, action) => {
      state = action.payload;

      return state;
    },
    // logout: (state) => {
    //   state = null;

    //   return state;
    // },
  },
});

export const { updateProfile } = profileSlice.actions;

export default profileSlice.reducer;
