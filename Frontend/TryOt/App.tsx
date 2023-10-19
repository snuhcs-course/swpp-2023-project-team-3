import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import homeScreen from "./src/screens/HomeScreen";

export type LoggedInParamList = {
  Chat: undefined;
  Home: undefined;
  SearchHistory: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(true);

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
              } else if (route.name === 'Chat') {
                iconName = focused
                  ? 'chatbubble-ellipses'
                  : 'chatbubble-ellipses-outline';
              }

              // @ts-ignore
              return (
                <Icon
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
          })}>
          <Tab.Screen name="Home" options={{headerShown: false}} component={homeScreen}/>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={LoginScreen}
            options={{title: '로그인'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
