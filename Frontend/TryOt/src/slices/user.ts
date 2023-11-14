import {createSlice} from '@reduxjs/toolkit';
import {Token, UserInfo} from '../types/server';

export interface LocalVariables {
  gptUsable: boolean;
}

const initialState: UserInfo & Token & LocalVariables = {
  id: 0,
  username: '',
  age: 0,
  gender: 'F',
  email: '',
  token: '',
  nickname: '',
  gptUsable: true,
};

const testUser: UserInfo & Token & LocalVariables = {
  id: 2,
  username: 'admin2',
  age: 0,
  gender: 'M',
  email: 'admin2@admin.com',
  token: '710201114a0c4ff56bcf82452b0f9c79e1fa1399',
  nickname: 'admin2',
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
  },
  extraReducers: builder => {},
});

export default userSlice;
