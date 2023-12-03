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
import HomeTab from '../screens/Authenticated/HomeTab/HomeTab';
import MyPageTab from '../screens/Authenticated/MyPageTab/MyPageTab';
import HistoryTab from '../screens/Authenticated/HistoryTab/HistoryTab';
import store, { useAppDispatch } from '../store';
import {HomeStackProps} from "../screens/Authenticated/HomeTab/HomeTab";
import {MyPageTabStackProps} from "../screens/Authenticated/MyPageTab/MyPageTab";
import {HistoryTabStackProps} from "../screens/Authenticated/HistoryTab/HistoryTab";

export type AuthenticatedStackProps = {
    MyPageTab: MyPageTabStackProps;
    HomeTab: HomeStackProps;
    HistoryTab: HistoryTabStackProps;
};

export const Tab = createBottomTabNavigator<AuthenticatedStackProps>();

createNativeStackNavigator<AuthenticatedStackProps>();
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
            <Tab.Navigator
                initialRouteName="HomeTab"
                screenOptions={({ route }) => ({
                    tabBarActiveBackgroundColor: 'black',
                    tabBarInactiveBackgroundColor: 'black',
                    tabBarActiveTintColor: 'white',
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = '';

                        if (route.name === 'HomeTab') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'HistoryTab') {
                            iconName = focused ? 'podium' : 'podium-outline';
                        } else if (route.name === 'MyPageTab') {
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
                    options={({ route }) => ({
                        headerShown: false,
                        title: 'query history',
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
                    name="HomeTab"
                    component={HomeTab}
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
                    name="MyPageTab"
                    component={MyPageTab}
                    options={({ route }) => ({
                        title: 'my page',
                        headerShown: false,
                        tabBarStyle: (route => {
                            const routeName = getFocusedRouteNameFromRoute(route) ?? 'null';
                            if (routeName === 'ChangePasswordScreen' || routeName === 'ItemDetail') {
                                return { display: 'none' };
                            }
                            return;
                        })(route),
                    })}
                />
            </Tab.Navigator>
    );
};

export default AuthenticatedStack;
