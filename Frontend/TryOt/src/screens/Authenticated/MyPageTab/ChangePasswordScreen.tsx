import {StyleSheet, Text, View} from 'react-native';
import BasicTextInput from '../../../components/BasicTextInput';
import BlackBasicButton from '../../../components/BlackBasicButton';
import {ActivityIndicator} from 'react-native-paper';
import React, {useState} from 'react';
import {color, fontSize, vw} from '../../../constants/design';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducer';
import {ChangeUserPassword} from '../../../api/userApi';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MyPageTabStackProps} from './MyPageTab';

function ChangePasswordScreen({
  navigation,
}: NativeStackScreenProps<MyPageTabStackProps>) {
  //user info
  const {token, id} = useSelector((state: RootState) => state.user);

  const [newPassword, setNewPassword] = useState('');
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [passwordMessageError, setPasswordMessageError] = useState('');
  const [checkNewPassword, setCheckNewPassword] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [checkPasswordMessageError, setCheckPasswordMessageError] =
    useState('');
  const [doesOldPasswordMatch, setDoesOldPasswordMatch] = useState(true);

  const handlePasswordChange = (text: string) => {
    const minLength = 6; // Minimum password length
    const hasUppercase = /[A-Z]/.test(text); // At least one uppercase letter
    const hasLowercase = /[a-z]/.test(text); // At least one lowercase letter
    const hasDigit = /\d/.test(text); // At least one digit

    let isValid = true;
    let errorMessage = '';

    if (text.length < minLength) {
      isValid = false;
      errorMessage = 'Password must be at least 6 characters long.';
    } else if (!hasUppercase || !hasLowercase || !hasDigit) {
      isValid = false;
      errorMessage =
        'Password must include at least one uppercase letter, one lowercase letter, and one digit.';
    }

    setNewPassword(text);
    setIsNewPasswordValid(isValid);
    setPasswordMessageError(errorMessage);
  };

  const handleCheckPasswordChange = (text: string) => {
    setCheckNewPassword(text);
    if (newPassword !== text) {
      setCheckPasswordMessageError('Passwords do not match.');
      setIsPasswordMatch(false);
    } else {
      setCheckPasswordMessageError('');
      setIsPasswordMatch(true);
    }
  };

  //change password button disable
  const isFormValid = () => {
    return isPasswordMatch && isNewPasswordValid;
  };

  const handleChangePasswordButtonClick = async () => {
    try {
      await ChangeUserPassword(id, token, newPassword);
      setDoesOldPasswordMatch(true);
      navigation.navigate('MyPageScreen');
    } catch (e) {
      setDoesOldPasswordMatch(false);
      navigation.navigate('MyPageScreen');
      console.log(e);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.formContainer}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Change Password</Text>
          </View>
          <View style={styles.inputContainer}>
            <BasicTextInput
              label={'Current Password'}
              secureTextEntry={true}
              isValid={doesOldPasswordMatch}
              errorMessage={'Current password is incorrect.'}
            />
            <BasicTextInput
              label={'New Password'}
              onChangeText={handlePasswordChange}
              secureTextEntry={true}
              isValid={isNewPasswordValid}
              errorMessage={passwordMessageError}
            />
            <BasicTextInput
              label={'Confirm New Password'}
              onChangeText={handleCheckPasswordChange}
              secureTextEntry={true}
              isValid={isPasswordMatch}
              errorMessage={checkPasswordMessageError}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <BlackBasicButton
            buttonText={'Change Password'}
            isButtonActive={isFormValid()}
            title={'Change Password'}
            onClick={handleChangePasswordButtonClick}
          />
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
    paddingTop: 20,
    paddingBottom: 20,
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
