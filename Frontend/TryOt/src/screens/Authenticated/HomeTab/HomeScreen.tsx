import React, {useCallback, useEffect, useState} from 'react';
import {Button, Dimensions, Image, StyleSheet, Text, TextInput, View} from 'react-native';

import {queryPlaceholders} from '../../../constants/queryPlaceholders';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {color, fontSize, vh, vw} from '../../../constants/design';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import {HomeStackProps} from './HomeTab';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export type HomeScreenProps = {
  Home: undefined;
};

function HomeScreen({navigation}: NativeStackScreenProps<HomeStackProps>) {
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
    <DismissKeyboardView
      style={{backgroundColor: color.background, height: 100 * vh}}>
      <View style={styles.inputWrapper}>
        <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
          <View style={{...styles.optionWrapper, borderColor: isCatalog ? color.pointPurple : '#666'}}>
            <FontAwesome5
                name={'search'}
                size={15}
                style={isCatalog ?styles.chosenText : styles.optionText}
            />
            <Text
                style={[styles.optionText, isCatalog ? styles.chosenText : {}]}
                onPress={onPressHandler}>
              Catalog
            </Text>
          </View>
          <View style={{...styles.optionWrapper, borderColor: isCatalog ? '#666' : color.pointPurple, marginLeft: 3 * vw}}>
            <FontAwesome5
                name={'comments'}
                size={15}
                style={isCatalog ? styles.optionText : styles.chosenText}
            />
            <Text
                onPress={onPressHandler}
                style={[styles.optionText, isCatalog ? {} : styles.chosenText]}>
              Chat
            </Text>
          </View>
        </View>
        <View style={styles.inputTextWrapper}>
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
    fontSize: fontSize.large + 5,
    color: color.text.title,
    marginBottom: 20,
  },
  optionWrapper: {
    marginLeft: 5 * vw,
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1.5,
  },
  optionText: {
    margin: 1,
    padding: 5,
    borderRadius: 5,
    color: "#666",
    textAlign: 'center',
  },
  chosenText: {
    margin: 1,
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: color.pointPurple,
  },
  inputTextWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 5,
    width: 90 * vw,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  textInnerImage: {
    resizeMode: 'contain',
    width: '8%',
    height: '100%',
  },
  inputText: {
    flex: 10,
  },
});

export default HomeScreen;
