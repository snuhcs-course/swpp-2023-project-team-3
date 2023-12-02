// Chatbot.test.tsx

import React from 'react';
import { render, fireEvent, waitFor, RenderOptions  } from '@testing-library/react-native';
import { Provider } from 'react-redux'; // Assuming you use Redux, adjust as needed
import configureStore from 'redux-mock-store'; // Assuming you use Redux, adjust as needed
import { RouteProp } from '@react-navigation/native';

import Chat from '../src/screens/Chat'; // Import the Chat component
import {HomeStackParamList} from '../src/screens/Home';
import mockStore from './mockStore';
import {RootState} from '../src/store/reducer';

// Mock the navigation prop
const navigation: any = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
};

// Mock the Redux store
const initialState = {
  user: {
    id: '3', // or some default value
    nickname: 'hey',
  }
}; // Add your initial state as needed

const createRoute = (params: { searchQuery: string; chatroom?: number }): RouteProp<HomeStackParamList, 'Chat'> => {
  return { key: 'unique-key', name: 'Chat', params };
};

const store = mockStore(initialState);
const route = createRoute({ searchQuery: 'hello mr gpt tell me how to do a test', chatroom: 123 });

const { getByTestId } = render(
  <Provider store={store}>
    <Chat navigation={navigation} route={route} />
  </Provider>
);

  describe('Chat Component', () => {
    it('renders correctly', async () => {
      const { getByTestId, toJSON } = render(
        <Provider store={store}>
          <Chat navigation={navigation} route={route} />
        </Provider>
      );
  
      const sendButton = getByTestId('sendButton');
  
      // Trigger the asynchronous operation (if any) by pressing the button
      fireEvent.press(sendButton);
  
      // Wait for the asynchronous operation to complete (if needed)
      await waitFor(() => {
        // Your assertions go here
        expect(getByTestId('sendButton')).toBeTruthy();
        // Additional assertions if needed
      });
  
      // Snapshot testing (if needed)
      // expect(toJSON()).toMatchSnapshot();
    });
  });

  // it('handles user input and sends a chat request', async () => {
  //   const route = createRoute({ searchQuery: 'Test', chatroom: 123 });
  //   const { getByPlaceholderText, getByTestId } = render(
  //     <Provider store={store}>
  //       <Chat navigation={navigation} route={route} />
  //     </Provider>
  //   );

  //   const inputField = getByPlaceholderText('채팅을 입력해주세요');
  //   const sendButton = getByTestId('send-button');

  //   // Type a message in the input field
  //   fireEvent.changeText(inputField, 'Hello, this is a test message');

  //   // Trigger the send button press
  //   fireEvent.press(sendButton);

  //   // Wait for any asynchronous tasks to complete
  //   await waitFor(() => {});

  //   // Add assertions based on the expected behavior
  //   // For example, check if the message is added to the chat messages state
  // });