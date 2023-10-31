import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'


import HomeScreen from "../../screens/Home";
import ScannerScreen from "../../screens/Scanner";
import ProfileScreen from "../../screens/Profile";

const Tab = createBottomTabNavigator();

export default function TabBar(){
    /* This is wrapper navigation for more examples, visit : https://reactnavigation.org/docs/tab-based-navigation/  */
    return (
        <Tab.Navigator>
            <Tab.Screen name='Home' component={HomeScreen} />
            <Tab.Screen name='Scanner' component={ScannerScreen} />
            <Tab.Screen name='Profile' component={ProfileScreen} />
        </Tab.Navigator>
    )
}
