import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {HomeStackProps} from './HomeTab';
import ChatBubble from '../../../components/ChatBubble';
import {fontSize, vh, vw} from '../../../constants/design';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducer';
import ChatFacade from '../../../models-refactor/chat/ChatFacade';
import {ChatInfo} from '../../../models-refactor/chat/ChatComponent';

export type ChatScreenProps = {
  Chat: {
    searchQuery?: string;
    chatroom?: number;
  };
};

function ChatScreen({
  navigation,
  route,
}: NativeStackScreenProps<HomeStackProps, 'Chat'>) {
  // get user info
  const {id, nickname} = useSelector((state: RootState) => state.user);

  // set chat manager
  const chatManager = useMemo(
    () => new ChatFacade(route.params.searchQuery, route.params.chatroom, id),
    [id, route.params.chatroom, route.params.searchQuery],
  );

  // states
  const [messages, setMessages] = useState<ChatInfo>([]);
  const [query, setQuery] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(false);
  // flatlist ref
  const flatlistRef = useRef<FlatList<ChatInfo[number]>>(null);

  //scroll down function
  const scrollDownChats = useCallback(() => {
    flatlistRef.current?.scrollToEnd();
  }, []);

  const onChatRequest = useCallback(async () => {
    setDisableButton(true);
    try {
      await chatManager.sendMessage(query);
    } catch {
      Alert.alert('Error occured', 'Pleas try again', [
        {text: 'OK', onPress: () => navigation.pop()},
      ]);
    }
    setQuery('');
    setDisableButton(false);
  }, [chatManager, navigation, query]);

  const setChatroom = useCallback(async () => {
    chatManager.addObserver(setMessages);
    setDisableButton(true);
    try {
      await chatManager.createOrLoadChatroom();
    } catch {
      Alert.alert('Error occured', 'Pleas try again', [
        {text: 'OK', onPress: () => navigation.pop()},
      ]);
    }
    setDisableButton(false);
  }, [chatManager, navigation]);

  useEffect(() => {
    setChatroom();
  }, [setChatroom]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={flatlistRef}
          style={styles.chatting}
          data={messages}
          ListEmptyComponent={<></>}
          onLayout={scrollDownChats}
          onContentSizeChange={scrollDownChats}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <View onStartShouldSetResponder={() => true}>
              <ChatBubble
                who={'item' in item ? 'Tryot' : nickname}
                info={item}
                navigation={navigation}
              />
            </View>
          )}
        />

        <View
          style={styles.inputTextContainer}
          onStartShouldSetResponder={() => true}>
          <TextInput
            onChangeText={text => {
              const englishOnlyText = text.replace(/[^a-zA-Z\s]/g, '');
              setQuery(englishOnlyText);
            }}
            value={query}
            placeholder="Message..."
            placeholderTextColor="#666"
            importantForAutofill="yes"
            returnKeyType="next"
            clearButtonMode="while-editing"
            blurOnSubmit={false}
            style={styles.inputText}
          />
          <Pressable
            onPress={onChatRequest}
            disabled={disableButton}
            style={styles.inputTextButton}>
            {!disableButton ? (
              <Image
                style={styles.inputTextButtonImage}
                source={require('../../../assets/Icon/Send.png')}
              />
            ) : (
              <ActivityIndicator />
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',

    paddingHorizontal: ((vw * 12) / 360) * 100,
    backgroundColor: 'white',
  },

  chatting: {
    // flexGrow: 1,
    alignSelf: 'flex-start',

    marginTop: 40,
    width: '100%',
  },
  errorMessage: {
    color: 'red',
    size: fontSize.small,
  },

  inputTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: vw * 90,
    height: vh * 7,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    paddingHorizontal: vw * 3,
    marginVertical: vw * 3,
  },
  inputText: {
    flex: 1,
  },
  inputTextButton: {
    alignItems: 'center',
    justifyContent: 'center',

    width: '8%',
    height: '100%',
  },
  inputTextButtonImage: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
});

export default ChatScreen;
