import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  username: '',
  email: '',
  accessToken: ''
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;