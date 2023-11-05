import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {
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
import {RootStackParamList} from './Home';
import ChatBubble from '../components/ChatBubble';
import {vh, vw} from '../constants/design';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

type userMessage = {
  id: number;
  who: string;
  content: string;
};
type gptMessage = {
  id: number;
  who: string;
  user_id: number;
  chatroom_id: number;
  answer: string;
  gpt_query1: string;
  gpt_query2: string;
  gpt_query3: string;
  items: {[key: number]: [number, number]};
  summary: string;
};

export type message = userMessage | gptMessage;

export function isUserMessage(msg: any): msg is userMessage {
  return (
    typeof msg === 'object' &&
    'id' in msg &&
    'who' in msg &&
    'content' in msg &&
    typeof msg.id === 'number' &&
    typeof msg.who === 'string' &&
    typeof msg.content === 'string'
  );
}

async function getGptQuery(): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 5000));
  return {
    user_id: 123,
    chatroom_id: 123,
    answer: 'apsalamalaicum',
    gpt_query1: 'gpt query1 dess',
    gpt_query2: 'gpt query2 imnida',
    gpt_query3: 'this is gpt query3',
    items: {
      21356917: [0.3, 1],
      21268753: [0.1, 3],
      20992177: [0.7, 0],
      21026589: [0.3, 1],
      21026514: [0.1, 3],
      21119012: [0.7, 0],
      13008132: [0.3, 1],
      15304907: [0.1, 3],
      15326529: [0.7, 0],
    },
  };
}

function Chat({
  navigation,
}: // route,
NativeStackScreenProps<RootStackParamList, 'Chat'>) {
  const [messages, setMessages] = useState<message[]>([
    {id: 1, who: 'Me', content: 'hihihi1'},
    {id: 2, who: 'Trytri', content: 'hihihi2'},
    {id: 3, who: 'Me', content: 'hihihi3'},
    {id: 4, who: 'Trytri', content: 'hihihi4'},
    {id: 5, who: 'Me', content: 'hihihi5'},
    {id: 6, who: 'Trytri', content: 'hihihi6'},
    {id: 7, who: 'Me', content: 'hihihi17'},
  ]);
  const [query, setQuery] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const flatlistRef = useRef<FlatList<message>>(null);

  const {nickname} = useSelector((state: RootState) => state.user);

  const scrollDownChats = useCallback(() => {
    flatlistRef.current?.scrollToEnd();
  }, []);

  const onChatRequest = useCallback(async () => {
    setDisableButton(true);

    const currQuery = query;
    setQuery('');

    // adding user chat to message list
    setMessages(prevMsg =>
      prevMsg.concat({
        id: prevMsg[prevMsg.length - 1].id + 1,
        who: nickname,
        content: currQuery,
      }),
    );

    const gptResponse = await getGptQuery();

    setMessages(prevMsg => {
      gptResponse.who = 'Trytri';
      gptResponse.id = prevMsg[prevMsg.length - 1].id + 1;
      return prevMsg.concat(gptResponse);
    });

    setDisableButton(false);
  }, [query, nickname]);

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
              <ChatBubble who={item.who} msg={item} navigation={navigation} />
            </View>
          )}
        />

        <View
          style={styles.inputTextContainer}
          onStartShouldSetResponder={() => true}>
          <TextInput
            onChangeText={text => setQuery(text)}
            value={query}
            placeholder="채팅을 입력해주세요"
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
            <Image
              style={styles.inputTextButtonImage}
              source={require('../assets/Icon/Send.png')}
            />
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

export default Chat;
