import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import HistoryScreen from '../src/screens/Authenticated/HistoryTab/HistoryScreen';
import mockStore from './mockStore';
import {Provider} from 'react-redux';

const mockNavigation = {addListener: jest.fn()};
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));
// const mockStore = configureStore([]);

describe('History Screen', () => {
  jest.useFakeTimers();
  it('renders HistoryScreen correctly', async () => {
    const initialState = {
      user: {
        id: 1,
        // Add other relevant user data for the test
      },
    };
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryScreen navigation={mockNavigation} />
      </Provider>,
    );
    const json = screen.toJSON();
    expect(json).toMatchSnapshot();
  });
});
