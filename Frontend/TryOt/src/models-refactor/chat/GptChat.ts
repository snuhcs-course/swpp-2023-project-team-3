import ChatComponent from './ChatComponent';
import {GptChatResponse} from '../../api-refactor/gptChatApi';
import ProxyItem from '../items/ProxyItem';

class GptChat extends ChatComponent {
  private gptChat: GptChatResponse;
  private items: ProxyItem[] = [];

  constructor(gptChat: GptChatResponse) {
    super();
    this.gptChat = gptChat;

    for (const itemId of Object.keys(gptChat.items)) {
      this.items.push(new ProxyItem(itemId));
    }
  }

  public getData(): {}[] {
    return [{...this.gptChat, items: this.items}];
  }
}

export default GptChat;
