// Chatbot.test.tsx

import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  RenderOptions,
} from '@testing-library/react-native';
import {Provider} from 'react-redux'; // Assuming you use Redux, adjust as needed
import {RouteProp} from '@react-navigation/native';

import Chat from '../src/screens/Authenticated/HomeTab/ChatScreen'; // Import the Chat component
import mockStore from './mockStore';
import {RootState} from '../src/store/reducer';
import {HomeStackProps} from '../src/screens/Authenticated/HomeTab/HomeTab';

// Mock the navigation prop
const navigation: any = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
};
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock the Redux store
const initialState = {
  user: {
    id: '3', // or some default value
    nickname: 'hey',
  },
}; // Add your initial state as needed

const createRoute = (params: {
  searchQuery: string;
  chatroom?: number;
}): RouteProp<HomeStackProps, 'Chat'> => {
  return {key: 'unique-key', name: 'Chat', params};
};

const store = mockStore(initialState);

describe('Chat Component', () => {
  jest.useFakeTimers();
  it('handles user input and sends a chat request', async () => {
    const route = createRoute({searchQuery: 'Test', chatroom: 123});
    const {getByPlaceholderText, getByLabelText, getByText} = render(
      <Provider store={store}>
        <Chat navigation={navigation} route={route} />
      </Provider>,
    );

    const inputField = getByPlaceholderText('Message...');
    expect(inputField).toBeDefined();
  });
});
