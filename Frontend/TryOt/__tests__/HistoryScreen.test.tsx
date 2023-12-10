import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import HistoryScreen from '../src/screens/Authenticated/HistoryTab/HistoryScreen';
import mockStore from './mockStore';
import {Provider} from 'react-redux';

const initialState = {
  user: {
    id: 1, // or some default value
    username: 'testUser',
  },
}; // Add your initial state as needed

const store = mockStore(initialState);

describe('History Screen', () => {
  jest.useFakeTimers();
  it('snap shot', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <HistoryScreen />
        </NavigationContainer>
      </Provider>,
    );
    const json = screen.toJSON();
    expect(json).toMatchSnapshot();
  });
});
