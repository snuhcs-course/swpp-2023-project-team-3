import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ChangePasswordScreen from "./ChangePasswordScreen";
import React from "react";
import MyPageScreen from "./MyPageScreen";
import ItemDetailScreen from "../HomeTab/ItemDetailScreen";
import {ItemDetailScreenProps} from "../HomeTab/ItemDetailScreen";

export type MyPageTabStackProps = {
    MyPage: undefined;
    ChangePassword: undefined;
    ItemDetail: ItemDetailScreenProps;
};

const Stack = createNativeStackNavigator<MyPageTabStackProps>();

export default function MyPageTab() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MyPage"
                component={MyPageScreen}
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
                name="ChangePassword"
                component={ChangePasswordScreen}
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
