import ItemDetailScreen from "./ItemDetailScreen";
import CatalogScreen from "./CatalogScreen";
import ChatScreen from "./ChatScreen";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";

import {CatalogScreenParamList} from "./CatalogScreen";
import {ChatScreenParamList} from "./ChatScreen";
import {ItemDetailScreenParamList} from "./ItemDetailScreen";
import {HomeScreenParamList} from "./HomeScreen";

export type HomeStackParamList = HomeScreenParamList & CatalogScreenParamList & ChatScreenParamList & ItemDetailScreenParamList;

export default function HomeTab(){
    const Stack = createNativeStackNavigator<HomeStackParamList>();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
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
            <Stack.Screen
                name="Catalog"
                component={CatalogScreen}
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
        </Stack.Navigator>
    );
}
