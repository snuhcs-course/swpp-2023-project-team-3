import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from './HistoryScreen';

export type HistoryTabStackParamList = {
  HistoryScreen: undefined;
};

const Stack = createNativeStackNavigator<HistoryTabStackParamList>();
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
