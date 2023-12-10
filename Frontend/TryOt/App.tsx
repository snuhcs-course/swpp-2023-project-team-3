// App.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import store from './src/store/index';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </GestureHandlerRootView>
  );
};

export default App;
