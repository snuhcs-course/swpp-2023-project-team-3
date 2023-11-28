// AuthenticatedStack.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute, NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import tryAxios from '../util/tryAxios';
import userSlice from '../slices/user';
import Home, { HomeStackParamList } from '../screens/Authenticated/HomeTab/Home';
import MyTab from '../screens/Authenticated/MyTab/MyTab';
import HistoryTab from '../screens/Authenticated/HistoryTab/HistoryTab';
import { RootState } from '../store/reducer';
import store, { useAppDispatch } from '../store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type AuthenticatedParamList = {
    MyTab: undefined;
    Home: HomeStackParamList;
    HistoryTab: undefined;
    ChangePassword: undefined;
};

export const Tab = createBottomTabNavigator<AuthenticatedParamList>();
const Stack = createNativeStackNavigator<AuthenticatedParamList>();

const AuthenticatedStack: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getTokenAndRefresh = async () => {
            try {
                const token = await EncryptedStorage.getItem('accessToken');
                if (!token) {
                    return;
                }
                const response = await tryAxios('get', 'user/token-check/', { token });
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
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                    tabBarActiveBackgroundColor: 'black',
                    tabBarInactiveBackgroundColor: 'black',
                    tabBarActiveTintColor: 'white',
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ focused, color, size }) => {
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
                    options={({ route }) => ({
                        headerShown: false,
                        title: 'Home',
                        tabBarStyle: (route => {
                            const routeName = getFocusedRouteNameFromRoute(route) ?? 'null';
                            if (routeName === 'ItemDetail' || routeName === 'Chat') {
                                return { display: 'none' };
                            }
                            return;
                        })(route),
                    })}
                />
                <Tab.Screen
                    name="MyTab"
                    component={MyTab}
                    options={({ route }) => ({
                        title: 'my tab',
                        headerShown: false,
                        tabBarStyle: (route => {
                            const routeName = getFocusedRouteNameFromRoute(route) ?? 'null';
                            if (routeName === 'ChangePasswordScreen') {
                                return { display: 'none' };
                            }
                            return;
                        })(route),
                    })}
                />
            </Tab.Navigator>
            <Toast />
        </NavigationContainer>
    );
};

export default AuthenticatedStack;
