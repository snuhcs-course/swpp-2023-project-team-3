import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';

import {queryPlaceholders} from '../../../constants/queryPlaceholders';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {color, fontSize, vh, vw} from '../../../constants/design';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import {HomeStackProps} from './HomeTab';
import Toast from "react-native-toast-message";
import {useIsFocused} from "@react-navigation/native";

export type HomeScreenProps = {
  Home: undefined;
};

function HomeScreen({navigation}: NativeStackScreenProps<HomeStackProps>) {
  const isFocused = useIsFocused();
  const [isCatalog, setIsCatalog] = useState(true);
  const [inputText, setInputText] = useState('');
  const onPressHandler = useCallback(() => {
    setIsCatalog(isCatalog => !isCatalog);
  }, []);
  const onSubmitEditingHandler = () => {
    if (inputText.trim()) {
      navigation.navigate(isCatalog ? 'Catalog' : 'Chat', {
        searchQuery: inputText,
      });
    } else {
      setInputText('');
    }
  };

  const [placeholderText, setPlaceholderText] = useState('');

  useEffect(() => {
    setInputText('');
    const randomIndex = Math.floor(Math.random() * queryPlaceholders.length);
    const placeholderText = queryPlaceholders[randomIndex];
    setPlaceholderText(placeholderText);
  }, [isFocused]);

  return (
    <DismissKeyboardView
      style={{backgroundColor: color.background, height: 100 * vh}}>
      <View style={styles.inputWrapper}>
        <View>
          <Text style={styles.titleText}>Try-Ot</Text>
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
            source={require('../../../assets/Icon/Logo_Black.png')}
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
            value={inputText}
            onChangeText={(text) => {
              const englishOnlyText = text.replace(/[^a-zA-Z\s]/g, '');
              setInputText(englishOnlyText);
            }}
          />
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 89 * vh,
    overflowY: 'auto',
    touchAction: 'none',
    userSelect: 'none',
    backgroundColor: color.background,
  },
  titleText: {
    fontFamily: 'Syncopate-Bold',
    fontSize: fontSize.large + 10,
    color: color.text.title,
    marginBottom: 10,
  },
  optionWrapper: {
    marginLeft: 5 * vw,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
  },
  optionText: {
    margin: 0,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 30,
    color: 'gray',
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
    borderRadius: 30,
    width: 90 * vw,
    height: 13 * vw,
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

export default HomeScreen;
