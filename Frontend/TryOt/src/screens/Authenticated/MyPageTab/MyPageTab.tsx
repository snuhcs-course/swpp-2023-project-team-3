import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ChangePasswordScreen from "./ChangePasswordScreen";
import React from "react";
import MyPageScreen from "./MyPageScreen";

export type MyPageTabStackParamList = {
    MyPageScreen: undefined;
    ChangePasswordScreen: undefined;
};

const Stack = createNativeStackNavigator<MyPageTabStackParamList>();
export default function MyPageTab() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MyPageScreen"
                component={MyPageScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="ChangePasswordScreen"
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
