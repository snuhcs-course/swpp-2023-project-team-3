import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  Dimensions,
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
import DismissKeyboardView from '../components/DismissKeyboardView';
import ChatBubble from '../components/ChatBubble';
import {vh, vw} from '../constants/design';

type message = {
  id: number;
  who: string;
  content: string;
};

function Chat({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Chat'>) {
  const [messages, setMessages] = useState<message[]>([
    {id: 1, who: 'Me', content: 'hihihi'},
    {id: 2, who: 'Trytri', content: 'hihihi'},
    {id: 3, who: 'Me', content: 'hihihi'},
    {id: 4, who: 'Trytri', content: 'hihihi'},
    {id: 5, who: 'Me', content: 'hihihi'},
    {id: 6, who: 'Trytri', content: 'hihihi'},
    {id: 7, who: 'Me', content: 'hihihi'},
  ]);

  return (
    // <DismissKeyboardView style={styles.container}>
    //   <View
    //     style={{
    //       height: Dimensions.get('window').height - 100,
    //     }}>
    //     <View>
    //       <Pressable
    //         style={{width: vw * 5, height: vh * 5}}
    //         onPress={() => {
    //           navigation.pop();
    //         }}>
    //         <Image
    //           source={require('../assets/Icon/LeftArrow.png')}
    //           style={{resizeMode: 'contain', width: '100%', height: '100%'}}
    //         />
    //       </Pressable>

    //       <ChatBubble
    //         who="username"
    //         content={`please find [${route.params.searchQuery}]`}
    //       />
    //       <ChatBubble
    //         who="Trytri"
    //         content={'A summer dress for ~~ blah blah blah'}
    //       />
    //       <ChatBubble
    //         who="username"
    //         content={'A summer dress for ~~ blah blah blah'}
    //       />
    //     </View>
    //     <View style={styles.inputText}>
    //       <TextInput
    //         placeholder="채팅을 입력해주세요"
    //         placeholderTextColor="#666"
    //         importantForAutofill="yes"
    //         returnKeyType="next"
    //         clearButtonMode="while-editing"
    //         blurOnSubmit={false}
    //       />
    //       <Image
    //         style={{resizeMode: 'contain', width: '8%', height: '100%'}}
    //         source={require('../assets/Icon/Send.png')}
    //       />
    //     </View>
    //   </View>
    // </DismissKeyboardView>

    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButtonPressable}
            onPress={() => {
              navigation.pop();
            }}>
            <Image
              source={require('../assets/Icon/LeftArrow.png')}
              style={styles.backButtonImage}
            />
          </Pressable>
        </View>

        <FlatList
          style={styles.chatting}
          data={messages}
          ListEmptyComponent={<></>}
          renderItem={({item}) => (
            <ChatBubble who={item.who} content={item.content} />
          )}
          keyExtractor={item => `${item.id}`}
          onEndReachedThreshold={0.4}
          inverted
        />

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
            style={styles.inputTextButton}
            source={require('../assets/Icon/Send.png')}
          />
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

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    width: '100%',
    paddingTop: ((vh * 15) / 644) * 100,
  },
  backButtonPressable: {
    justifyContent: 'center',
    alignItems: 'center',

    width: ((vw * 24) / 360) * 100,
    height: ((vw * 24) / 360) * 100,
  },
  backButtonImage: {
    resizeMode: 'contain',
    width: '66%',
    height: '66%',
  },

  chatting: {
    flexGrow: 1,
    alignSelf: 'flex-start',
    width: '100%',
  },

  inputText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

    width: vw * 90,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    paddingHorizontal: vw * 3,
    marginVertical: vw * 3,
  },
  inputTextButton: {
    resizeMode: 'contain',
    width: '8%',
    height: '100%',
  },
});

export default Chat;
