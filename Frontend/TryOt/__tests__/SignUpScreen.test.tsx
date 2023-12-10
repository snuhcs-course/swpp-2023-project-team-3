/**
 * @format
 */

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import SignUpScreen from '../src/screens/UnAuthenticated/SignUpScreen';

const user = {
  Email: 'test@email.com',
  Username: 'testUser',
  Password: 'testPassword',
};
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('SignUp success', () => {
  jest.useFakeTimers();
  jest.runAllTimers();
  it('snap shot', () => {
    render(
      <NavigationContainer>
        <SignUpScreen />
      </NavigationContainer>,
    );
    const json = screen.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('headers correctly', () => {
    // jest.useFakeTimers()
    const {getByText} = render(
      <NavigationContainer>
        <SignUpScreen />
      </NavigationContainer>,
    );
    const header = getByText('Create an Account');
    expect(header).toBeDefined();
  });

  it('submits form', () => {
    const {getAllByText, getByText} = render(
      <NavigationContainer>
        <SignUpScreen />
      </NavigationContainer>,
    );
    const email = getAllByText('Email')[0];
    const username = getAllByText('Username')[0];
    const password = getAllByText('Password')[0];
    const confirm_password = getAllByText('Confirm Password')[0];
    fireEvent.changeText(email, user.Email);
    fireEvent.changeText(username, user.Username);
    fireEvent.changeText(password, user.Password);
    fireEvent.changeText(confirm_password, user.Password);

    const onSubmit = getByText('Create Account');
    expect(onSubmit).toBeDefined();
    expect(email).toBeDefined();
    expect(username).toBeDefined();
    expect(password).toBeDefined();
    expect(confirm_password).toBeDefined();
  });
});
