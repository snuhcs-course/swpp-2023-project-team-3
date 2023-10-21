import * as React from 'react';
import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from './src/pages/LoginScreen';
import SignUpScreen from './src/pages/SignUpScreen';
import Home from './src/pages/Home';
import SearchHistory from './src/pages/SearchHistory';
import MyTab from './src/pages/MyTab';
import Toast from 'react-native-toast-message';

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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    Toast.show({
      type: 'success',
      text1: 'Login Success!'
    });
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
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
                  color={color}
                />
              );
            },
          })}>
          <Tab.Screen
            name="SearchHistory"
            component={SearchHistory}
            options={{title: 'query history'}}
          />
          <Tab.Screen
            name="Home"
            component={Home}
            options={{headerShown: false, title: 'home'}}
          />
          <Tab.Screen
            name="MyTab"
            component={MyTab}
            options={{title: 'my tab'}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            options={{ headerShown: false, title: '로그인' }}
          >
            {() => <LoginScreen setLogin={handleLogin} />}
          </Stack.Screen>
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

export default App;
