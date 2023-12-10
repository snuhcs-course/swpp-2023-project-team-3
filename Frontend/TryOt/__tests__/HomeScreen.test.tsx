import React from 'react';
import {render} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import mockStore from './mockStore';
import {Provider} from 'react-redux';
import HomeScreen from '../src/screens/Authenticated/HomeTab/HomeScreen';

const mockNavigation = {isFocused: jest.fn()};
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = require('react-native').ScrollView;
  return {KeyboardAwareScrollView};
});
describe('Home Screen', () => {
  jest.useFakeTimers();
  test('renders Home Screen correctly', () => {
    const initialState = {
      user: {
        id: 1,
        // Add other relevant user data for the test
      },
    };
    const store = mockStore(initialState);

    const {getByText} = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>,
    );
    const chatText = getByText('Chat');
    expect(chatText).toBeDefined();
    const chatText2 = getByText('Catalog');
    expect(chatText2).toBeDefined();
    // const json = screen.toJSON();
    // expect(json).toMatchSnapshot();
  });
});
