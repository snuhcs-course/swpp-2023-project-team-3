// AppNavigator.tsx
import React from 'react';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthenticatedStack from './AuthenticatedStack';
import UnauthenticatedStack from './UnauthenticatedStack';
import {UnAuthenticatedParamList} from "../../App";

export type RootStackNavigation = NavigationProp<UnAuthenticatedParamList>;

const RootStack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator
                initialRouteName="UnauthenticatedStack"
                screenOptions={{ headerShown: false }}>
                <RootStack.Screen
                    name="UnauthenticatedStack"
                    component={UnauthenticatedStack}
                />
                <RootStack.Screen
                    name="AuthenticatedStack"
                    component={AuthenticatedStack}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
