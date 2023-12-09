import React from 'react';
import {Image, View, StyleSheet, Text, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BasicTextInput from '../../components/BasicTextInput';
import TextLikeButton from '../../components/TextLikeButton';
import BlackBasicButton from '../../components/BlackBasicButton';
import {UnauthenticatedStackNavigation} from '../../navigation/UnauthenticatedStack';
import {color, vw} from '../../constants/design';
import userSlice from '../../slices/user';
import Toast from 'react-native-toast-message';
import {useAppDispatch} from '../../store';
import {ActivityIndicator} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import useCheckBox from '../../components/CheckBox';
import tryAxios from '../../util/tryAxios';

function LoginScreen() {
  const dispatch = useAppDispatch();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const {navigate} = useNavigation<UnauthenticatedStackNavigation>();
  const handleSignUpClick = () => {
    navigate('SignUp');
  };

  const onSubmit = async () => {
    if (loading) {
      return;
    }
    if (!username || !username.trim()) {
      return Alert.alert('Notification', 'Please enter a valid username.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('Notification', 'Please enter a valid password.');
    }
    try {
      setLoading(true);
      const response = await tryAxios('post', 'user/login/', {
        username,
        password,
      });
      //무조건 리멤버미
      await EncryptedStorage.setItem('accessToken', response.token);
      dispatch(userSlice.actions.setUser(response));
    } catch (error) {
      //@ts-ignore
      Alert.alert("Notification", "Username or password is incorrect.");
      //Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
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
        source={require('../../assets/Icon/Logo_Text.png')}
        style={styles.logo}
        resizeMode={'contain'}
      />
      <View style={styles.formContainer}>
        <View style={{paddingBottom: 10}}>
          <BasicTextInput
              label={'Username'}
              onChangeText={text => handleTextInputs(text, 'username')}
          />
          <BasicTextInput
              label={'Password'}
              secureTextEntry={true}
              onChangeText={text => handleTextInputs(text, 'password')}
          />
        </View>
        <BlackBasicButton
          buttonText={
            loading ? <ActivityIndicator color="white" /> : <Text>Sign In</Text>
          }
          title={'Sign In'}
          onClick={onSubmit}
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
