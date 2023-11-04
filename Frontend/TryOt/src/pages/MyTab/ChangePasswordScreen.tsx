import {StyleSheet, Text, View} from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import BlackBasicButton from "../../components/BlackBasicButton";
import {ActivityIndicator} from "react-native-paper";
import React from "react";
import {color, fontSize, vw} from "../../constants/design";

function ChangePasswordScreen() {
    return (
        <View style={styles.root}>
            <View style={styles.formContainer}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Change Password</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <BasicTextInput label={'Current Password'}/>
                        <BasicTextInput label={'New Password'}/>
                        <BasicTextInput label={'Confirm New Password'}/>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'column',
    },

    headerContainer: {
        width: 90 * vw,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: '10%',
        paddingBottom: 20,
        backgroundColor: 'white',
    },

    formContainer: {
        paddingBottom: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        backgroundColor: 'white',
    },
    header: {
        fontSize: fontSize.large,
        color: color.text.title,
        fontWeight: 'bold',
        paddingTop: 10,
    },
    inputContainer: {
        width: 90 * vw,
        backgroundColor: 'white',
    },
});

export default ChangePasswordScreen;
