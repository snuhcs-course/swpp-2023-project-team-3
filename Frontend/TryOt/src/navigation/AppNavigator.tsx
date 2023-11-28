// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import AuthenticatedStack from './AuthenticatedStack';
import UnauthenticatedStack from './UnauthenticatedStack';

const AppNavigator: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => !!state.user.username);

    return (
        <NavigationContainer>
            {isLoggedIn ? <AuthenticatedStack /> : <UnauthenticatedStack />}
        </NavigationContainer>
    );
};

export default AppNavigator;

