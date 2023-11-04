import * as React from 'react';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  NavigationProp,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import SignUpScreen from './src/screens/SignUpScreen';
import Home from './src/screens/Home';
import SearchHistory from './src/screens/SearchHistory';
import MyTab from './src/screens/MyTab';
import Toast from 'react-native-toast-message';
import {Provider, useSelector} from 'react-redux';
import store, {useAppDispatch} from './src/store';
import {RootState} from './src/store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from './src/slices/user';
import {Alert, Text, View} from 'react-native';
import tryAxios from './src/util/tryAxios';
import ChangePasswordScreen from "./src/pages/MyTab/ChangePasswordScreen";

export type LoggedInParamList = {
  MyTab: undefined;
  Home: undefined;
  SearchHistory: undefined;
  ChangePassword: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type RootStackNavigation = NavigationProp<RootStackParamList>;

export const Tab = createBottomTabNavigator();
export const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const isLoggedIn = true //useSelector((state: RootState) => !!state.user.username);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('accessToken');
        if (!token) {
          return;
        }
        //TODO - token parameter
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
<<<<<<< HEAD
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarStyle: {
              backgroundColor: 'black',
            },

            tabBarActiveTintColor: 'white',
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({focused, color, size}) => {
              let iconName = "";
=======
          <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName: string;
>>>>>>> feature/front/myPage

                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'SearchHistory') {
                    iconName = focused ? 'podium' : 'podium-outline';
                  } else if (route.name === 'MyTab') {
                    iconName = focused ? 'person' : 'person-outline';
                  }

<<<<<<< HEAD
              return (
                  <Icon
                      name={iconName}
                      size={size}
                      color={color}
                  />
              );
            },
          })}>
          <Tab.Screen
            name={'SearchHistory'}
            component={SearchHistory}
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
                if (routeName === 'ItemDetail') {
                  return {display: 'none'};
                }
                return { backgroundColor: 'black', tabBarHideOnKeyboard: true}
              })(route),
            })}
          />
          <Tab.Screen
            name="MyTab"
            component={MyTab}
            options={{title: 'my tab'}}
          />
        </Tab.Navigator>
=======
                  return (
                      <Icon
                          //@ts-ignore
                          name={iconName}
                          size={size}
                          color={color}
                      />
                  );
                },
              })}
          >
            <Tab.Screen
                name="SearchHistory"
                component={SearchHistory}
                options={{
                  headerShown: false,
                  title: 'query history',
                }}
            />
            <Tab.Screen
                name="Home"
                component={Home}
                options={({ route }) => ({
                  headerShown: false,
                  title: 'Home',
                  tabBarStyle: (route => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'null';
                    if (routeName === 'ItemDetail') {
                      return { display: 'none' };
                    }
                    return;
                  })(route),
                })}
            />
            <Tab.Screen
                name="MyTab"
                component={MyTab}
                options={ ({route }) => ({
                  title: 'my tab',
                  headerShown: false,
                  tabBarStyle: (route => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'null';
                    if (routeName === 'ChangePassword') {
                      return { display: 'none' };
                    }
                    return;
                  })(route),
                })}
            />
          </Tab.Navigator>
>>>>>>> feature/front/myPage
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
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
