import {
  catalogHistory,
  chatHistory,
} from '../../../api-refactor/historyDetailApi';
import ChatHistory from '../ChatHistory';
import SearchHistory from '../SearchHistory';

class HistoryFactory {
  createHistory(history: catalogHistory | chatHistory) {
    if ('gpt_query1' in history) {
      return new SearchHistory(history);
    } else {
      return new ChatHistory(history);
    }
  }
}

export default HistoryFactory;
