import {chatHistory} from '../../api-refactor/historyDetailApi';
import HistoryElement from './HistoryElement';
import HistoryVisitor from './visitor/HistoryVisitor';

class ChatHistory implements HistoryElement {
  private history: chatHistory;

  constructor(history: chatHistory) {
    this.history = history;
  }

  accept<T>(visitor: HistoryVisitor<T>) {
    return visitor.chatHistoryVisitor(this);
  }

  public getHistory() {
    return this.history;
  }
}

export default ChatHistory;
