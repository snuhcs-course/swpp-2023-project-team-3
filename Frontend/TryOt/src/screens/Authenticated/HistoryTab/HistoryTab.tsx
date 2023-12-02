import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from './HistoryScreen';
import ChatScreen from "../HomeTab/ChatScreen";
import CatalogScreen from "../HomeTab/CatalogScreen";
import ItemDetailScreen from "../HomeTab/ItemDetailScreen";
import {HistoryScreenProps} from "./HistoryScreen";
import {ChatScreenProps} from "../HomeTab/ChatScreen";
import {CatalogScreenProps} from "../HomeTab/CatalogScreen";
import {ItemDetailScreenProps} from "../HomeTab/ItemDetailScreen";

export type HistoryTabStackProps = HistoryScreenProps & ChatScreenProps & CatalogScreenProps & ItemDetailScreenProps;

const Stack = createNativeStackNavigator<HistoryTabStackProps>();
export default function HistoryTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{headerShown: false}}
      />
        <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
                headerShadowVisible: false,
                headerTitle: '',
                headerTransparent: true,
                headerTintColor: 'black',
            }}
        />
        <Stack.Screen
            name="Catalog"
            component={CatalogScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="ItemDetail"
            component={ItemDetailScreen}
            options={{
                headerShadowVisible: false,
                headerTitle: '',
                headerTransparent: true,
                headerTintColor: 'black',
            }}
        />
    </Stack.Navigator>
  );
}
