// UnauthenticatedStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Unauthenticated/LoginScreen';
import SignUpScreen from '../screens/Unauthenticated/SignUpScreen';

export type UnAuthenticatedParamList = {
    SignIn: undefined;
    SignUp: undefined;
};

const Stack = createNativeStackNavigator<UnAuthenticatedParamList>();

const UnauthenticatedStack: React.FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SignIn"
                options={{ headerShown: false, title: '로그인' }}
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
    );
};

export default UnauthenticatedStack;
