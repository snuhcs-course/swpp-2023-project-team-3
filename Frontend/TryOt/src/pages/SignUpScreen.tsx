import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import BlackBasicButton from '../components/BlackBasicButton';
import BasicTextInput from '../components/BasicTextInput';
import {ActivityIndicator, PaperProvider} from 'react-native-paper';
import {color, fontSize, vw} from '../constants/design';
import axios from 'axios';
import {serverName} from '../constants/dev';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigation} from '../../App';
import Toast from 'react-native-toast-message';
import tryAxios from '../util/tryAxios';

function SignUpScreen() {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  //error handling
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [isUsernameValid, setIsUsernameValid] = React.useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    React.useState(true);

  //navigation for page transition
  const {navigate} = useNavigation<RootStackNavigation>();

  //button disablied
  const isFormValid = () => {
    return (
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      !isUsernameValid
    );
  };

  //error messages
  const emailMessageError = 'Please enter a valid email address';
  const [passwordMessageError, setPasswordMessageError] = useState(
    'Please enter a valid password',
  );
  const usernameMessageError = 'Please enter a valid username';
  const confirmPasswordMessageError = 'Passwords do not match';

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('notification', 'please enter email.');
    }
    if (!username || !username.trim()) {
      return Alert.alert('notification', 'please enter username.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('notification', 'please enter password.');
    }
    if (!confirmPassword || !confirmPassword.trim()) {
      return Alert.alert('notification', 'please enter [confirm password].');
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }
    try {
      setLoading(true);
      const response = await tryAxios('post', 'user/register', {
        username,
        password,
        email,
        gender: 'F',
        age: 10,
        nickname: 'test',
      });
      Toast.show({
        type: 'success',
        text1: 'sign up success!',
      });
      navigate('SignIn');
    } catch (error) {
      Alert.alert('notification', 'Sign up fail');
    } finally {
      setLoading(false);
    }
  }, [loading, navigate, email, username, password]);

  //functions
  const handleEmailChange = (text: string) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = emailPattern.test(text);

    setEmail(text); // Update the email state
    setIsEmailValid(isValid); // Update the email validation state
  };

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

    setPassword(text);
    setIsPasswordValid(isValid);
    setPasswordMessageError(errorMessage);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (password !== text) {
      setIsConfirmPasswordValid(false);
    } else {
      setIsConfirmPasswordValid(true);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.formContainer}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Create an Account</Text>
          </View>
          <View style={styles.inputContainer}>
            <BasicTextInput
              label={'Email'}
              onChangeText={handleEmailChange}
              isValid={isEmailValid}
              errorMessage={emailMessageError}
            />
            <BasicTextInput
              label={'Username'}
              onChangeText={text => setUsername(text)}
            />
            <BasicTextInput
              label={'Password'}
              onChangeText={handlePasswordChange}
              secureTextEntry={true}
              isValid={isPasswordValid}
              errorMessage={passwordMessageError}
            />
            <BasicTextInput
              label={'Confirm Password'}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry={true}
              isValid={isConfirmPasswordValid}
              errorMessage={confirmPasswordMessageError}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <BlackBasicButton
            buttonText={
              loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Create Account</Text>
              )
            }
            title={'Create Account'}
            isButtonActive={isFormValid()}
            onClick={onSubmit}
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
    backgroundColor: color.background,
    flexDirection: 'column',
  },

  headerContainer: {
    width: 90 * vw,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: '10%',
    paddingBottom: 20,
  },

  formContainer: {
    paddingBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  header: {
    fontSize: fontSize.large,
    color: color.text.title,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: 90 * vw,
  },
});

export default SignUpScreen;
