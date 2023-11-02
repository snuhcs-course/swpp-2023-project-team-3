import React from 'react';
import {Text, View} from 'react-native';

//해야하는 기능:
//1. Change Password
//2. Turn on/off gpt refinement
//3. See Recent Items Viewed
function MyTab() {
    return (
        <View>
            <View>
                <Text>Username</Text>
                <Text>Email</Text>
            </View>
            <View
                style={{
                    height: 10, // Adjust the height as needed
                    backgroundColor: 'gray',
                }}
            />
            <View>
                <Text>Turn on/off GPT refinement</Text>
            </View>
            <View>
                <Text>Gender</Text>
            </View>
            <View>
                <Text>Change Password</Text>
            </View>
            <View>
                <Text>Logout</Text>
            </View>
            <View
                style={{
                    height: 10, // Adjust the height as needed
                    backgroundColor: 'gray',
                }}
            />
        </View>
    );
}

export default MyTab;
