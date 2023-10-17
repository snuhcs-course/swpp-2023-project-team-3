import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Chat from './src/pages/Chat';
import Home from './src/pages/Home';
import SearchHistory from './src/pages/SearchHistory';

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

              // You can return any component that you like here!

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
            options={{title: '검색 목록'}}
          />
          <Tab.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Tab.Screen name="Chat" component={Chat} options={{title: '대화'}} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
