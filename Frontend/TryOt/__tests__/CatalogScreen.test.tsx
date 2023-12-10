import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import CatalogScreen from '../src/screens/Authenticated/HomeTab/CatalogScreen';
import mockStore from './mockStore';
import {Provider} from 'react-redux';

const initialState = {
  user: {
    id: 1, // or some default value
    username: 'testUser',
  },
}; // Add your initial state as needed

const store = mockStore(initialState);
const createRoute = (params: {
  query: string;
}): RouteProp<HomeStackProps, 'Catalog'> => {
  return {key: 'unique-key', name: 'Catalog', params};
};

const route = createRoute({query: 'this is test for catalog'});

describe('Catalog Search', () => {
  jest.useFakeTimers();
  it('snap shot', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <CatalogScreen route={route} />
        </NavigationContainer>
      </Provider>,
    );
    const json = screen.toJSON();
    expect(json).toMatchSnapshot();
  });
});
