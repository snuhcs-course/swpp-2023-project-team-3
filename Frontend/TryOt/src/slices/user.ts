import {createSlice} from '@reduxjs/toolkit';
import {Token, UserInfo} from '../types/server';

export interface LocalVariables {
  gptUsable: boolean;
}


const testUser: UserInfo & Token & LocalVariables = {
  id: 0,
  username: '',
  age: 0,
  gender: 'M',
  email: '',
  token: '',
  nickname: '',
  gptUsable: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState: testUser, // Set the initial state to testUser
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.age = action.payload.age;
      state.nickname = action.payload.nickname;
      state.gender = action.payload.gender;
    },
    setGPTUsable: (state, action) => {
      state.gptUsable = action.payload;
    },
    logoutUser(state) {
      // Clear all user-related data
      state.id = 0;
      state.email = '';
      state.username = '';
      state.age = 0;
      state.nickname = '';
      state.gender = 'F';
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
