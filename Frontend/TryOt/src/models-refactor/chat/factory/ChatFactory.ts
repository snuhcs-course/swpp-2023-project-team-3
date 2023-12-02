import {ChatHistory} from '../../../api-refactor/chatHistoryApi';
import {GptChatResponse} from '../../../api-refactor/gptChatApi';
import ChatComponent from '../ChatComponent';
import GptChat from '../GptChat';
import UserChat from '../UserChat';

class ChatFactory {
  createChat(data: string | ChatHistory): ChatComponent {
    if (typeof data === 'string') {
      return new UserChat(data);
    } else {
      let idx = 0;
      let startingChat!: ChatComponent;
      for (const chatHistoryEntity of data.user_chat) {
        const userChat = new UserChat(chatHistoryEntity.query);
        const gptChat = new GptChat({
          ...chatHistoryEntity.gpt_chat[0],
          items: chatHistoryEntity.items.reduce(
            (prev, curr) => ({...prev, [curr]: [curr, curr]}),
            {},
          ) as GptChatResponse['items'],
          chatroom: data.id,
          query: chatHistoryEntity.query,
        });

        userChat.add(gptChat);
        if (idx === 0) {
          startingChat = userChat;
          idx += 1;
        } else {
          startingChat.add(userChat);
        }
      }
      return startingChat;
    }
  }
}

export default ChatFactory;
