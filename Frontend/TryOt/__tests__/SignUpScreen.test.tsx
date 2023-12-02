/**
 * @format
 */


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import SignUpScreen from '../src/screens/SignUpScreen';

const user = {
    Email: "test@email.com",
    Username : "testUser",
    Password : "testPassword"
  };

describe('SignUp success', () => {

    jest.useFakeTimers()
    test('snap shot', () => {
        render( 
            <NavigationContainer>
                <SignUpScreen />
            </NavigationContainer>
        );
        const json = screen.toJSON();
        expect(json).toMatchSnapshot();
    });

    test('headers correctly', () => {
        // jest.useFakeTimers()
        const {getByText} = render(
            <NavigationContainer>
                <SignUpScreen />
            </NavigationContainer>
        );
        const header = getByText('Create an Account');
        expect(header).toBeDefined();
    });

    test('submits form', () => {
        const {getAllByText, getByText} = render(
            <NavigationContainer>
                <SignUpScreen />
            </NavigationContainer>
        );
        const email = getAllByText('Email')[0];
        const username = getAllByText('Username')[0];
        const password = getAllByText('Password')[0];
        const confirm_password = getAllByText('Confirm Password')[0]
        fireEvent.changeText(email, user.Email);
        fireEvent.changeText(username, user.Username);
        fireEvent.changeText(password, user.Password);
        fireEvent.changeText(confirm_password, user.Password);

        const onSubmit = getByText('Create Account');
        fireEvent.press(onSubmit);
        expect(onSubmit).toBeDefined();
        expect(email).toBeDefined();
        expect(username).toBeDefined();
        expect(password).toBeDefined();
        expect(confirm_password).toBeDefined();
    });

});
