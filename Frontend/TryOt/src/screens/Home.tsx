import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {queryPlaceholders} from '../constants/queryPlaceholders';

import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import Catalog from './Catalog';
import Chat from './Chat';
import {color, fontSize, vh, vw} from '../constants/design';
import ItemDetailScreen from './ItemDetailScreen';
import {FashionItem} from '../models/FashionItem';

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

  const [placeholderText, setPlaceholderText] = useState('');
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * queryPlaceholders.length);
    const placeholderText = queryPlaceholders[randomIndex];
    setPlaceholderText(placeholderText);
  }, []);

  return (
    <View>
      <View style={styles.inputWrapper}>
        <View>
          <Text style={styles.titleText}>find your style</Text>
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
        <View style={styles.inputTextWrapper}>
          <Image
            style={styles.textInnerImage}
            source={require('../assets/Icon/Logo_Black.png')}
          />
          <TextInput
            style={styles.inputText}
            placeholder={placeholderText}
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
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100 * vh,
    overflowY: 'auto',
    touchAction: 'none',
    userSelect: 'none',
    backgroundColor: color.background,
  },
  titleText: {
    fontFamily: 'Syncopate-Bold',
    fontSize: fontSize.large + 5,
    color: color.text.title,
    marginBottom: 20,
  },
  optionWrapper: {
    marginLeft: 5 * vw,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderColor: color.border,
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
  inputTextWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 10,
    width: 90 * vw,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInnerImage: {
    resizeMode: 'contain',
    width: '8%',
    height: '100%',
  },
  inputText: {
    flex: 10,
    marginLeft: 10,
  },
});

export type RootStackParamList = {
  Search: undefined;
  Catalog: {
    searchQuery: string;
  };
  Chat: {
    searchQuery: string;
    chatroom?: number;
  };
  ItemDetail: {
    item: FashionItem;
  };
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{
          headerShadowVisible: false,
          headerTitle: '',
          headerTransparent: true,
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen
        name="Catalog"
        component={Catalog as any}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Chat"
        component={Chat as any}
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
