import * as React from 'react';
import { NavigationProp } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import store from './src/store';
import { AppInner } from './AppInner';

export type LoggedInParamList = {
  MyTab: undefined;
  Home: undefined;
  SearchHistory: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type RootStackNavigation = NavigationProp<RootStackParamList>;

export const Tab = createBottomTabNavigator();
export const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(){

  return(
    <Provider store={store}>
      <AppInner />
    </Provider>
  )
};
