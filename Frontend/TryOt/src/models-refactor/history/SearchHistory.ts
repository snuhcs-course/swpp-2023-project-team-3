import {catalogHistory} from '../../api-refactor/historyDetailApi';
import HistoryElement from './HistoryElement';
import HistoryVisitor from './visitor/HistoryVisitor';

class SearchHistory implements HistoryElement {
  private history: catalogHistory;

  constructor(history: catalogHistory) {
    this.history = history;
  }

  accept<T>(visitor: HistoryVisitor<T>) {
    return visitor.searchHistoryVisitor(this);
  }
}

export default SearchHistory;
