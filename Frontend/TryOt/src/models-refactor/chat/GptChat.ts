import ChatComponent from './ChatComponent';
import ProxyItem from '../items/ProxyItem';

class GptChat extends ChatComponent {
  private answer: string;
  private items: ProxyItem[] = [];

  constructor(answer: string, items: (number | string)[]) {
    super();
    this.answer = answer;

    for (const itemId of items) {
      this.items.push(new ProxyItem(String(itemId)));
    }
  }

  public getData() {
    return [{answer: this.answer, items: this.items}];
  }
}

export default GptChat;
