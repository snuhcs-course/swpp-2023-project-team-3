import {createSlice} from '@reduxjs/toolkit';
import {Token, UserInfo} from '../types/server';


export interface LocalVariables {
    gptUsable: boolean
}

const initialState: UserInfo & Token & LocalVariables = {
  id: 0,
  username: 'initialUsername',
  age: 20,
  gender: 'F',
  email: 'initalEmail',
  token: '',
  nickname: 'initialNickname',
  gptUsable: true,
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
    setGPTUsable: (state, action) => {
      state.gptUsable = action.payload;
    }
  },
  extraReducers: builder => {},
});

export default userSlice;
