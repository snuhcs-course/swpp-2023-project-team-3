import ChatHistory from '../ChatHistory';
import SearchHistory from '../SearchHistory';

interface HistoryVisitor<T> {
  chatHistoryVisitor(element: ChatHistory): T;
  searchHistoryVisitor(element: SearchHistory): T;
}

export default HistoryVisitor;
