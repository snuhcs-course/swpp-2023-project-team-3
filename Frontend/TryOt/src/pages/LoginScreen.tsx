import React from 'react';
import {Image, View, Dimensions, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BasicTextInput from '../components/BasicTextInput';
import RememberMeButton from '../components/RememberMeButton';
import TextLikeButton from '../components/TextLikeButton';
import BlackBasicButton from '../components/BlackBasicButton';
import {type RootStackNavigation} from '../../App';
import { color, vw } from '../constants/design';

interface LoginScreenProps {
  setLogin: () => void;
}

function LoginScreen({setLogin}: LoginScreenProps) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {navigate} = useNavigation<RootStackNavigation>();
  const handleSignUpClick = () => {
    navigate('SignUp');
  };

  const [isButtonActive, setIsButtonActive] = React.useState(false);

  const handleTextInputs = (text: string, field: string) => {
    // Update the state based on the input field
    if (field === 'username') {
      setUsername(text);
    } else if (field === 'password') {
      setPassword(text);
    }

    if (username !== '' && password !== '') {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Icon/Logo_Text.png')}
        style={styles.logo}
        resizeMode={'contain'}
      />
      <View style={styles.formContainer}>
        <BasicTextInput
          label={'Username'}
          onChangeText={text => handleTextInputs(text, 'username')}
        />
        <BasicTextInput
          label={'Password'}
          secureTextEntry={true}
          onChangeText={text => handleTextInputs(text, 'password')}
        />
        <View style={styles.rowContainer}>
          <RememberMeButton />
          <TextLikeButton text={'Forgot Password?'} textColor={'black'} />
        </View>
        <BlackBasicButton
          buttonText={'Sign In'}
          title={'Sign In'}
          onClick={setLogin}
          isButtonActive={isButtonActive}
        />
        <View style={styles.signUpContainer}>
          <TextLikeButton
            text={'New to Try-tri? Sign Up'}
            textColor={'black'}
            onPress={handleSignUpClick}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.background,
  },
  logo: {
    width: 50 * vw,
  },
  formContainer: {
    width: 90 * vw,
    paddingBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  signUpContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LoginScreen;
