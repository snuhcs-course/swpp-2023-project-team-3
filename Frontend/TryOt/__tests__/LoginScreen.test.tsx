/**
 * @format
 */

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../src/screens/UnAuthenticated/LoginScreen';
import {Provider} from 'react-redux';
import store from '../src/store';

const user = {
  Username: 'admin2',
  Password: 'admin1234',
};

describe('Login success', () => {
  jest.useFakeTimers();
  test('snap shot', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <LoginScreen />
        </NavigationContainer>
      </Provider>,
    );
    const json = screen.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('submits form', () => {
    const {getAllByText, getByText} = render(
      <Provider store={store}>
        <NavigationContainer>
          <LoginScreen />
        </NavigationContainer>
      </Provider>,
    );
    const username = getAllByText('Username')[0];
    const password = getAllByText('Password')[0];
    const remember_me = getAllByText('Remember Me')[0];
    fireEvent.changeText(username, user.Username);
    fireEvent.changeText(password, user.Password);

    const onSubmit = getByText('Sign In');
    fireEvent.press(onSubmit);
    expect(onSubmit).toBeDefined();
    expect(username).toBeDefined();
    expect(password).toBeDefined();
    expect(remember_me).toBeDefined();
  });
});
