/**
 * @format
 */


import 'react-native';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

import SignUpScreen from '../src/screens/SignUpScreen';

it('snap shot', () => {
    jest.useFakeTimers()
    const screen = render( 
        <NavigationContainer>
            <SignUpScreen />
        </NavigationContainer>
    );
    const json = screen.toJSON();
    expect(json).toMatchSnapshot();
});

it('renders correctly', () => {
    jest.useFakeTimers();

    const { getByText } = render(
        <NavigationContainer>
          <SignUpScreen />
        </NavigationContainer>
      );
    const header = getByText('Create an Account');
    expect(header).toBeDefined();
  });


// it('renders correctly', () => {
//     jest.useFakeTimers();

//     const { getByText } = render(
//         <NavigationContainer>
//           <SignUpScreen />
//         </NavigationContainer>
//       );
//     const header = getByText('Create an Account');
//     expect(header).toBeDefined();
//   });