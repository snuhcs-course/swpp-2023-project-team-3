// AppNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import AuthenticatedStack from './AuthenticatedStack';
import UnauthenticatedStack from './UnauthenticatedStack';
import { useAppDispatch } from '../store';
import EncryptedStorage from 'react-native-encrypted-storage';
import tryAxios from '../util/tryAxios';
import userSlice from '../slices/user';
import { Alert } from 'react-native';

const AppNavigator: React.FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.user.id != 0);
    const [isLoading, setIsLoading] = React.useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const tokenCheck = async () => {
            setIsLoading(true);
            try {
                const token = await EncryptedStorage.getItem('accessToken');
                if (!token) {
                    Alert.alert('notification', 'please try login again.');
                    return;
                }
                const response = await tryAxios('get', `user/token-check/`,{url : token});
                dispatch(userSlice.actions.setUser(response));
            } catch (error) {
                dispatch(userSlice.actions.logoutUser());
                Alert.alert('notification', 'please try login again.');
            } finally{
                setIsLoading(false);
            }
        };
        tokenCheck();
    }, [dispatch]);
    return (
        <NavigationContainer>
            {isLoggedIn ? <AuthenticatedStack /> : isLoading ? <></> : <UnauthenticatedStack />}
        </NavigationContainer>
    );
};

export default AppNavigator;

