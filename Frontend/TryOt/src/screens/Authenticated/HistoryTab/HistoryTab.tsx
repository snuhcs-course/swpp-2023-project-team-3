import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from './HistoryScreen';

export type HistoryTabStackProps = {
  HistoryScreen: undefined;
};

const Stack = createNativeStackNavigator<HistoryTabStackProps>();
export default function HistoryTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
