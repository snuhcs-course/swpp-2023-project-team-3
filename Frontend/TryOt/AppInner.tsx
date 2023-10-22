import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from './src/pages/LoginScreen';
import SignUpScreen from './src/pages/SignUpScreen';
import Home from './src/pages/Home';
import SearchHistory from './src/pages/SearchHistory';
import MyTab from './src/pages/MyTab';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './src/store';
import { RootState } from './src/store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import { serverName } from './src/constants/dev';
import userSlice from './src/slices/user';
import { Tab, Stack } from './App';
import { Alert } from 'react-native';

export function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.username);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('accessToken');
        if (!token) {
          return;
        }
        
        const response = await axios.post(
          `${serverName}/accessToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(
          userSlice.actions.setUser({
            username: response.data.username,
            email: response.data.email,
            accessToken: response.data.accessToken,
          })
        );
        await EncryptedStorage.setItem(
          'accessToken',
          response.data.accessToken,
        );
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
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'SearchHistory') {
                iconName = focused ? 'podium' : 'podium-outline';
              } else if (route.name === 'MyTab') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return (
                <Icon
                  //@ts-ignore
                  name={iconName}
                  size={size}
                  color={color} />
              );
            },
          })}>
          <Tab.Screen
            name="SearchHistory"
            component={SearchHistory}
            options={{ title: 'query history' }} />
          <Tab.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false, title: 'home' }} />
          <Tab.Screen
            name="MyTab"
            component={MyTab}
            options={{ title: 'my tab' }} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            options={{ headerShown: false, title: '로그인' }}
            component={LoginScreen} />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              title: '',
              headerTransparent: true,
              headerTintColor: 'black',
            }} />
        </Stack.Navigator>
      )}
      <Toast />
    </NavigationContainer>
  );
}
