import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import BlackBasicButton from '../components/BlackBasicButton';
import BasicTextInput from '../components/BasicTextInput';
import {PaperProvider} from 'react-native-paper';

function SignUpScreen() {
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

  //button disablied
  const isFormValid = () => {
    return isEmailValid && isPasswordValid && isConfirmPasswordValid && !isUsernameValid;
  };

  //error messages
  const emailMessageError = 'Please enter a valid email address';
  const [passwordMessageError, setPasswordMessageError] = useState(
    'Please enter a valid password',
  );
  const usernameMessageError = 'Please enter a valid username';
  const confirmPasswordMessageError = 'Passwords do not match';


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
            <BasicTextInput label={'Username'} />
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
            buttonText={'Create Account'}
            title={'Create Account'}
            isButtonActive={isFormValid()}
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
  },

  headerContainer: {
    width: Dimensions.get('screen').width * 0.9,
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
    height: '100%'
  },
  header: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: Dimensions.get('screen').width * 0.9,
  },
});

export default SignUpScreen;
