import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DismissKeyboardView from '../components/DismissKeyboardView';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import Catalog from './Catalog';
import Chat from './Chat';

function Search({navigation}: NativeStackScreenProps<RootStackParamList>) {
  const [isCatalog, setIsCatalog] = useState(true);
  const [inputText, setInputText] = useState('');
  const onPressHandler = useCallback(() => {
    setIsCatalog(isCatalog => !isCatalog);
  }, []);
  const onSubmitEditingHandler = () => {
    navigation.navigate(isCatalog ? 'Catalog' : 'Chat', {
      searchQuery: inputText,
    });
  };
  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <View>
          <Text style={styles.titleText}>FInD YOUR STYLE</Text>
        </View>
        <View style={styles.optionWrapper}>
          <Text
            style={[styles.optionText, isCatalog ? styles.choosenText : {}]}
            onPress={onPressHandler}>
            Catalog
          </Text>
          <Text
            onPress={onPressHandler}
            style={[styles.optionText, isCatalog ? {} : styles.choosenText]}>
            Chat
          </Text>
        </View>
        <View style={styles.inputText}>
          <Image
            style={{resizeMode: 'contain', width: '8%', height: '100%'}}
            source={require('../assets/Icon/Logo.png')}
          />
          <TextInput
            style={{flex: 10, marginLeft: 10}}
            placeholder="찾고 싶은 스타일을 입력해주세요"
            placeholderTextColor="#666"
            importantForAutofill="yes"
            returnKeyType="next"
            clearButtonMode="while-editing"
            blurOnSubmit={false}
            onSubmitEditing={onSubmitEditingHandler}
            onChangeText={text => {
              setInputText(text);
            }}
          />
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    overflowY: 'auto',
    touchAction: 'none',
    userSelect: 'none',
    backgroundColor: 'white',
  },
  titleText: {
    fontFamily: 'Syncopate-Bold',
    fontSize: 25,
    color: 'black',
    marginBottom: 20,
  },
  optionWrapper: {
    marginLeft: Dimensions.get('screen').width * 0.05,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
  },
  optionText: {
    margin: 1,
    padding: 5,
    borderRadius: 8,
    color: 'black',
    textAlign: 'center',
  },
  choosenText: {
    color: 'white',
    backgroundColor: 'black',
  },
  inputText: {
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    width: Dimensions.get('screen').width * 0.9,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export type RootStackParamList = {
  Search: undefined;
  Catalog: {
    searchQuery: string;
  };
  Chat: {
    searchQuery: string;
  };
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Home() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Catalog" component={Catalog as any} />
      <Stack.Screen name="Chat" component={Chat as any} />
    </Stack.Navigator>
  );
}
