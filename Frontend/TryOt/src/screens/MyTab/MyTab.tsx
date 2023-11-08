import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Switch, Modal, Portal, PaperProvider} from 'react-native-paper';
import CatalogItem from '../../components/CatalogItem';
import userSlice from '../../slices/user';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {RootState} from '../../store/reducer';
import {color, fontSize, vh, vw} from '../../constants/design';
import ChangePasswordScreen from './ChangePasswordScreen';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../Home';
import {FashionItem} from '../../models/FashionItem';

function MyPageScreen({
  navigation,
}: NativeStackScreenProps<MyTabStackParamList>) {
  const [isGPTRefineOn, setIsGPTRefineOn] = React.useState(false);
  const {email, nickname, gender, username, gptUsable} = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();

  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);

  const showLogoutModal = () => setLogoutModalVisible(true);
  const hideLogoutModal = () => setLogoutModalVisible(false);

  useEffect(() => {}, []);
  const handleLogout = () => {
    showLogoutModal();
  };

  const handlePasswordChange = () => {
    navigation.navigate('ChangePasswordScreen');
  };

  const handleGPTRefineOn = (newValue: boolean) => {
    setIsGPTRefineOn(newValue);
    userSlice.actions.setGPTUsable(isGPTRefineOn);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.userInfoContainer}>
          <View
            style={[
              styles.circle,
              {backgroundColor: 'black', width: 50, height: 50},
            ]}>
            <Text style={styles.letter}>{username.at(0)}</Text>
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.username}>{nickname}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
        <View style={styles.dividerBar} />
        <View style={styles.TableRow}>
          <Text style={styles.text}>Turn on/off GPT refinement</Text>
          <Switch value={isGPTRefineOn} onValueChange={handleGPTRefineOn} />
        </View>
        <TouchableOpacity onPress={handlePasswordChange}>
          <View style={styles.TableRow}>
            <Text style={styles.text}>Change Password</Text>
            <Icon name="chevron-forward-outline" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <View style={styles.TableRow}>
            <Text style={styles.text}>Logout</Text>
            <Icon name="chevron-forward-outline" />
          </View>
        </TouchableOpacity>
        <View style={styles.dividerBar} />
        <View style={styles.viewedItemsContainer}>
          <Text style={styles.viewedItemsHeader}>Recently Viewed Items</Text>
        </View>
        <Portal>
          <Modal
            visible={logoutModalVisible}
            onDismiss={hideLogoutModal}
            contentContainerStyle={styles.modalContainerStyle}>
            <Text style={{padding: 10, color: 'black'}}>
              Do you really want to logout?
            </Text>
            <View
              style={{width: '100%', backgroundColor: 'black', height: 1}}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>
            <View
              style={{width: '100%', backgroundColor: 'black', height: 1}}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={hideLogoutModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    paddingTop: 20,
  },

  userInfoContainer: {
    padding: 10,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
  },

  userTextContainer: {
    paddingLeft: 10,
  },

  circle: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
    padding: 13,
    borderWidth: 1,
    borderColor: color.backgroundGray,
  },

  GenderTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 80 * vw,
    alignSelf: 'center',
    alignItems: 'center',
  },

  modalButton: {
    padding: 10,
    width: '100%',
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'black',
    textAlign: 'center',
  },

  viewedItemsContainer: {
    backgroundColor: 'white',
    padding: 10,
  },

  viewedItemsHeader: {
    color: 'black',
    fontSize: fontSize.middle,
    fontWeight: 'bold',
  },
});

export type MyTabStackParamList = {
  MyPageScreen: undefined;
  ChangePasswordScreen: undefined;
};

const Stack = createNativeStackNavigator<MyTabStackParamList>();
export default function MyTab() {
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
