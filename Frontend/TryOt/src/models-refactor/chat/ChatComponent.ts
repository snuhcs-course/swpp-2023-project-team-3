import ProxyItem from '../items/ProxyItem';

type UserChatInfo = {
  content: string;
};

type GptChatInfo = {
  answer: string;
  items: ProxyItem[];
};

export type ChatInfo = (UserChatInfo | GptChatInfo)[];

abstract class ChatComponent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public add(component: ChatComponent): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public remove(component: ChatComponent): void {}

  public isUserChat(): boolean {
    return false;
  }

  public abstract getData(): ChatInfo;
}

export default ChatComponent;
