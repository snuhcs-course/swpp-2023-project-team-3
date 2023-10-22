import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {RootStackParamList} from './Home';
import DismissKeyboardView from '../components/DismissKeyboardView';
import ChatBubble from '../components/ChatBubble';

function Chat({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Chat'>) {
  return (
    <DismissKeyboardView style={styles.container}>
      <View
        style={{
          height: Dimensions.get('window').height - 100,
        }}>
        <View>
          <Pressable
            style={{width: '8%', height: '8%'}}
            onPress={() => {
              navigation.pop();
            }}>
            <Image
              source={require('../assets/Icon/LeftArrow.png')}
              style={{resizeMode: 'contain', width: '100%', height: '100%'}}
            />
          </Pressable>

          <ChatBubble
            who="username"
            content={`please find [${route.params.searchQuery}]`}
          />
          <ChatBubble
            who="Trytri"
            content={'A summer dress for ~~ blah blah blah'}
          />
          <ChatBubble
            who="username"
            content={'A summer dress for ~~ blah blah blah'}
          />
        </View>
        <View style={styles.inputText}>
          <TextInput
            placeholder="채팅을 입력해주세요"
            placeholderTextColor="#666"
            importantForAutofill="yes"
            returnKeyType="next"
            clearButtonMode="while-editing"
            blurOnSubmit={false}
          />
          <Image
            style={{resizeMode: 'contain', width: '8%', height: '100%'}}
            source={require('../assets/Icon/Send.png')}
          />
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
    padding: Dimensions.get('window').width * 0.05,
  },
  inputText: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    width: Dimensions.get('screen').width * 0.9,
    paddingHorizontal: '3%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Chat;
