import React from 'react';
import {render, screen, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import CatalogScreen from '../src/screens/Authenticated/HomeTab/CatalogScreen';
import axios from 'axios';

const mockNavigation = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
};
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));
const mockStore = configureStore([]);
jest.mock('axios');

describe('CatalogScreen', () => {
  jest.useFakeTimers();
  test('renders CatalogScreen correctly', async () => {
    const initialState = {
      user: {
        id: 1,
        username: 'testUser',
      },
    };

    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <CatalogScreen route={{params: {searchQuery: 'Test Query'}}} />
      </Provider>,
    );
    await waitFor(() => {
      expect(
        screen.getByText('GPT has refined your query into new queries'),
      ).toBeTruthy();
    });

    const json = screen.toJSON();
    expect(json).toMatchSnapshot();
  });
});
