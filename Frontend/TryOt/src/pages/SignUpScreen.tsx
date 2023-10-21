import React, { useState } from "react";
import { View, Text, Button, SafeAreaView, StyleSheet, Dimensions } from "react-native";
import BlackBasicButton from "../components/BlackBasicButton";
import BasicTextInput from "../components/BasicTextInput";
import {Button as PaperButton, Menu} from 'react-native-paper';

function SignUpScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  //error handling
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [usernameError, setUsernameError] = React.useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);

  //error messages
  const emailMessageError = 'Please enter a valid email address';
  const [passwordMessageError, setPasswordMessageError] = useState('Please enter a valid password');
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
    // Define your password validation criteria
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

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Create an Account</Text>
      <View style={{flex: 1, width: Dimensions.get('screen').width * 0.9}}>
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
        <BasicTextInput label={'Confirm Password'} />
        <BlackBasicButton buttonText={'Create Account'} title={'Create Account'} />
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    fontSize: 20,
    color: 'black',
  },
})

export default SignUpScreen;
