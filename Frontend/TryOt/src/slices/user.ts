import {createSlice} from '@reduxjs/toolkit';
import {Token, UserInfo} from '../types/server';

const initialState: UserInfo & Token = {
  id: '',
  username: '',
  age: 20,
  gender: 'female',
  email: '',
  token: '',
  nickname: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.age = action.payload.age;
      state.nickname = action.payload.nickname;
      state.gender = action.payload.gender;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
