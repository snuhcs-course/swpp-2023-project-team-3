import React from 'react';
import {Text, Image, View, Dimensions, StyleSheet} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import BasicTextInput from '../components/BasicTextInput';
import RememberMeButton from '../components/RememberMeButton';
import TextLikeButton from '../components/TextLikeButton';
import BlackBasicButton from '../components/BlackBasicButton';

interface LoginScreenProps {
  setLogin: () => void;
}

function LoginScreen({setLogin}: LoginScreenProps) {
  const navigation = useNavigation();
  const handleSignUpClick = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.root}>
        <Image
          source={require('../assets/Icon/Logo_Text.png')}
          style={styles.logo}
        resizeMode={'contain'}
        />
      <View style={{flex: 1, width: Dimensions.get('screen').width * 0.9}}>
        <View style={{marginBottom: 10}}>
          <BasicTextInput label={'Username'} />
        </View>
        <View style={{marginBottom: 10}}>
          <BasicTextInput label={'Password'} />
        </View>
        <View style={{marginBottom: 30}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <RememberMeButton />
            <TextLikeButton text={'Forgot Password?'} textColor={'black'} />
          </View>
        </View>
        <BlackBasicButton buttonText={'Sign In'} title={'Sign In'} onClick={setLogin}/>
        <View style={{ marginTop: 20, alignItems: 'center' }}>
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
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
  },

  logo: {
    width: '50%',
  },


});
export default LoginScreen;
