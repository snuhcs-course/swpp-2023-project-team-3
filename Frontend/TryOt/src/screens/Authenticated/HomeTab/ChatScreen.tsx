import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {HomeStackProps} from "./HomeTab";
import ChatBubble from '../../../components/ChatBubble';
import {fontSize, vh, vw} from '../../../constants/design';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducer';
import {gptChatApi} from '../../../api/gptChatApi';
import {chatHistoryApi} from '../../../api/chatHistoryApi';

type userMessage = {
  id: number;
  who: string;
  content: string;
};
type gptMessage = {
  id: number;
  who: string;
  user?: number;
  chatroom: number;
  summary?: string;
  answer: string;
  gpt_query1: string;
  gpt_query2: string;
  gpt_query3: string;
  items: number[];
};
type errorMessage = {
  id: number;
  who: string;
  content: string;
  isError: boolean;
};

export type message = userMessage | gptMessage | errorMessage;

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

export type ChatScreenProps = {
  Chat: {
    searchQuery: string;
    chatroom?: number;
  };
}

function ChatScreen({
  navigation,
  route,
}: NativeStackScreenProps<HomeStackProps, 'Chat'>) {
  const {searchQuery} = route.params;
  // states
  const [messages, setMessages] = useState<message[]>([]);
  const [query, setQuery] = useState<string>('');
  const [chatroom, setChatroom] = useState<number | undefined>(
    route.params.chatroom,
  );
  const [disableButton, setDisableButton] = useState<boolean>(false);
  // flatlist ref
  const flatlistRef = useRef<FlatList<message>>(null);
  // get user info
  const {id, nickname} = useSelector((state: RootState) => state.user);

  //scroll down function
  const scrollDownChats = useCallback(() => {
    flatlistRef.current?.scrollToEnd();
  }, []);

  // query gptChat
  const queryGpt = useCallback(
    async (currQuery: string) => {
      try {
        const gptResponse = await gptChatApi(currQuery, id, chatroom);
        let gptMessage: {
          summary?: string;
          answer: string;
          gpt_query1: string;
          gpt_query3: string;
          query: string;
          gpt_query2: string;
          chatroom: number;
          id: number;
          user?: number;
          items: { [p: number]: [number, number] };
          who: string
        } = {
          ...gptResponse,
          id: 0,
          who: 'Trytri',
        };
// @ts-ignore
        gptMessage.items = Object.keys(gptMessage.items).map(
            (value: string) => +value,
        );
        if (chatroom !== gptMessage.chatroom) {
          setChatroom(gptMessage.chatroom);
        }
        console.log(gptMessage);
        setMessages(prevMsg => {
          gptMessage.id = prevMsg[prevMsg.length - 1].id + 1;
          // @ts-ignore
          return prevMsg.concat(gptMessage);
        });
      } catch {
        setMessages(prevMsg =>
          prevMsg.concat({
            id: prevMsg[prevMsg.length - 1].id + 1,
            who: 'Trytri',
            content: 'Error occurred with GPT. Please try again',
            isError: true,
          }),
        );
      }
    },
    [chatroom, id],
  );

  // chat request function
  const onChatRequest = useCallback(async () => {
    setDisableButton(true);

    const currQuery = query;
    setQuery('');

    // adding user chat to message list
    setMessages(prevMsg =>
      prevMsg.concat({
        id: prevMsg.length > 0 ? prevMsg[prevMsg.length - 1].id + 1 : 0,
        who: nickname,
        content: currQuery,
      }),
    );
    await queryGpt(currQuery).then(() => setDisableButton(false));
  }, [query, queryGpt, nickname]);

  useEffect(() => {
    async function setChattingroom() {
      if (chatroom === undefined) {
        setDisableButton(true);
        setMessages([{id: 0, who: nickname, content: searchQuery}]);
        await queryGpt(searchQuery).then(() => setDisableButton(false));
      } else {
        await chatHistoryApi(chatroom).then(chatHistory => {
          let messageId = 0;
          let historyMessages: message[] = [];
          for (const history of chatHistory.user_chat) {
            historyMessages = [
              ...historyMessages,
              {id: messageId, who: nickname, content: history.query},
              {
                id: messageId + 1,
                who: 'Trytri',
                chatroom: chatroom,
                answer: history.gpt_chat[0].answer,
                gpt_query1: history.gpt_chat[0].gpt_query1,
                gpt_query2: history.gpt_chat[0].gpt_query2,
                gpt_query3: history.gpt_chat[0].gpt_query3,
                items: history.items,
              },
            ];
            messageId += 2;
          }
          setMessages(historyMessages);
        });
      }
    }
    setChattingroom();
  }, []);

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
                who={item.who}
                msg={item}
                isErrorMsg={'isError' in item && item.isError}
                navigation={navigation}
              />
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
              source={require('../../../assets/Icon/Send.png')}
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
