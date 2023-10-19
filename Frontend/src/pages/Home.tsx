import React, {useCallback, useState} from 'react';
import {Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import DismissKeyboardView from '../components/DismissKeyboardView';

function Home() {
  const [isCatalog, setIsCatalog] = useState(true);
  const onPressHandler = useCallback(() => {
    setIsCatalog(isCatalog => !isCatalog);
  }, []);
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
        <View>
          <TextInput
            style={styles.inputText}
            placeholder="찾고 싶은 스타일을 입력해주세요"
            placeholderTextColor="#666"
            importantForAutofill="yes"
            returnKeyType="next"
            clearButtonMode="while-editing"
            blurOnSubmit={false}
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
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  titleText: {
    fontFamily: 'Syncopate-Bold',
    fontSize: 20,
    color: 'black',
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
    marginTop: 20,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    width: Dimensions.get('screen').width * 0.9,
    paddingLeft: 10,
  },
});

export default Home;
