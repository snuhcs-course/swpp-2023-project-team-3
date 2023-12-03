/**
 * @format
 */

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = require('react-native').ScrollView;
  return {KeyboardAwareScrollView};
});

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shiped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
// import renderer from 'react-test-renderer';
import {render, screen, fireEvent} from '@testing-library/react-native';

describe('App test', () => {
  it('renders correctly', () => {
    jest.useFakeTimers();
    // const tree = renderer.create(<App />);
    const tree = render(<App />);
    expect(tree).toBeDefined();
  });
});
