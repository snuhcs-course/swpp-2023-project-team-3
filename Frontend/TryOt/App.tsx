/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  NavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from './src/screens/Unauthenticated/LoginScreen';
import SignUpScreen from './src/screens/Unauthenticated/SignUpScreen';
import Home, {HomeStackParamList} from './src/screens/Authenticated/HomeTab/Home';
import MyTab from './src/screens/Authenticated/MyTab/MyTab';
import Toast from 'react-native-toast-message';
import {Provider, useSelector} from 'react-redux';
import store, {useAppDispatch} from './src/store';
import {RootState} from './src/store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from './src/slices/user';
import {Alert} from 'react-native';
import tryAxios from './src/util/tryAxios';
import HistoryTab from './src/screens/Authenticated/HistoryTab/HistoryTab';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export type AuthenticatedParamList = {
  MyTab: undefined;
  Home: NavigatorScreenParams<HomeStackParamList>;
  HistoryTab: undefined;
  ChangePassword: undefined;
};

export type UnAuthenticatedParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type RootStackNavigation = NavigationProp<UnAuthenticatedParamList>;

export const Tab = createBottomTabNavigator<AuthenticatedParamList>();
export const Stack = createNativeStackNavigator<UnAuthenticatedParamList>();

function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.username);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('accessToken');
        if (!token) {
          return;
        }
        const response = await tryAxios('get', 'user/token-check/', {token});
        dispatch(userSlice.actions.setUser(response));
        await EncryptedStorage.setItem('accessToken', response.token);
      } catch (error) {
        Alert.alert('notification', 'please try login again.');
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({route}) => ({
            tabBarActiveBackgroundColor: 'black',
            tabBarInactiveBackgroundColor: 'black',
            tabBarActiveTintColor: 'white',
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({focused, color, size}) => {
              let iconName = '';

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'HistoryTab') {
                iconName = focused ? 'podium' : 'podium-outline';
              } else if (route.name === 'MyTab') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return (
                <Icon
                  //@ts-ignore
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
          })}>
          <Tab.Screen
            name="HistoryTab"
            component={HistoryTab}
            options={{
              headerShown: false,
              title: 'query history',
            }}
          />
          <Tab.Screen
            name="Home"
            component={Home}
            options={({route}) => ({
              headerShown: false,
              title: 'Home',
              tabBarStyle: (route => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? 'null';
                if (routeName === 'ItemDetail' || routeName === 'Chat') {
                  return {display: 'none'};
                }
                return;
              })(route),
            })}
          />
          <Tab.Screen
            name="MyTab"
            component={MyTab}
            options={({route}) => ({
              title: 'my tab',
              headerShown: false,
              tabBarStyle: (route => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? 'null';
                if (routeName === 'ChangePasswordScreen') {
                  return {display: 'none'};
                }
                return;
              })(route),
            })}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            options={{headerShown: false, title: '로그인'}}
            component={LoginScreen}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              title: '',
              headerTransparent: true,
              headerTintColor: 'black',
            }}
          />
        </Stack.Navigator>
      )}
      <Toast />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <AppInner />
      </Provider>
    </GestureHandlerRootView>
  );
}
