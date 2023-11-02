import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Switch } from 'react-native-paper';
import {color, fontSize} from "../constants/design";
import CatalogItem from '../components/CatalogItem';
import userSlice from "../slices/user";
import {useSelector} from "react-redux";
import {RootState} from "../store/reducer";

function MyTab() {
    const [isGPTRefineOn, setIsGPTRefineOn] = React.useState(false);
    const { email, nickname } = useSelector((state: RootState) => state.user);

    useEffect(() => {

    }, []);
    const handleLogout = () => {
        console.log('logout');
    }

    const handlePasswordChange = () => {
        console.log('password change');
    }

    const handleGenderChange = () => {
        console.log('pressed gender change')
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text}>{nickname}</Text>
                <Text style={styles.text}>{email}</Text>
            </View>
            <View style={styles.dividerBar}/>
            <View style={styles.TableRow}>
                <Text style={styles.text}>Turn on/off GPT refinement</Text>
                <Switch
                    value={isGPTRefineOn}
                    onValueChange={() => setIsGPTRefineOn(!isGPTRefineOn)}
                />
            </View>
            <View style={styles.TableRow}>
                <Text style={styles.text}>Gender</Text>
                <View style={styles.GenderTextButton}>
                    <Text style={styles.text}>Female</Text>
                    <Icon name="chevron-forward-outline"></Icon>
                </View>
            </View>
            <View style={styles.TableRow}>
                <Text style={styles.text}>Change Password</Text>
                <TouchableOpacity>
                    <Icon name="chevron-forward-outline"></Icon>
                </TouchableOpacity>
            </View>
            <View style={styles.TableRow}>
                <Text style={styles.text}>Logout</Text>
                <Icon name="chevron-forward-outline"></Icon>
            </View>
            <View style={styles.dividerBar}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.background,
    },

    username: {
        fontSize: fontSize.large,
        fontWeight: 'bold',
    },

    email: {
        fontSize: fontSize.middle,
        fontWeight: 'normal',
    },

    dividerBar: {
        backgroundColor: color.backgroundGray,
        height: 8,
    },

    text: {
        color: 'black',
    },
    TableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: color.backgroundGray
    },

    GenderTextButton: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export default MyTab;
