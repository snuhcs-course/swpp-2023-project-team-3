import {chatHistoryApi, gptChatApi} from '../../api-refactor';
import ChatComponent, {ChatInfo} from './ChatComponent';
import GptChat from './GptChat';
import UserChat from './UserChat';

class ChatFacade {
  private searchQuery: string | undefined;
  private chatroom: number | undefined;
  private user: number;

  private chatManager?: ChatComponent;
  private observer: React.Dispatch<React.SetStateAction<ChatInfo>>[] = [];

  constructor(
    searchQuery: string | undefined,
    chatroom: number | undefined,
    user: number,
  ) {
    this.searchQuery = searchQuery;
    this.chatroom = chatroom;
    this.user = user;
  }

  async createOrLoadChatroom() {
    if (this.searchQuery) {
      this.chatManager = await this.sendMessage(this.searchQuery);
    } else if (this.chatroom) {
      this.chatManager = await chatHistoryApi(this.chatroom);
    }

    this.notifyObserver();
  }

  async sendMessage(query: string) {
    // set UserChat
    const userChat = new UserChat(query);
    this.chatManager?.add(userChat);
    // notify to observer
    this.notifyObserver();

    // call gpt chat api
    const gptResponse = await gptChatApi(query, this.user, this.chatroom);
    userChat.add(
      new GptChat(gptResponse.answer, Object.keys(gptResponse.items)),
    );
    // notify to observer
    this.notifyObserver();

    // set chatroom id
    this.chatroom = gptResponse.chatroom;

    return userChat;
  }

  addObserver(observer: React.Dispatch<React.SetStateAction<ChatInfo>>) {
    this.observer.push(observer);
  }

  notifyObserver() {
    if (this.chatManager) {
      for (const observer of this.observer) {
        observer(this.chatManager.getData());
      }
    }
  }
}

export default ChatFacade;
