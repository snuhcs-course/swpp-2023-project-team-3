import {historyDetailResponse} from '../../api/historyDetailApi';
import HistoryElement from './HistoryElement';
import HistoryFactory from './factory/HistoryFactory';
import HistoryVisitor from './visitor/HistoryVisitor';

class History {
  private histories: HistoryElement[] = [];

  constructor(histories: historyDetailResponse) {
    const historyFactory = new HistoryFactory();
    for (const history of histories) {
      this.histories.push(historyFactory.createHistory(history));
    }
  }

  accept<T>(visitor: HistoryVisitor<T>): T[] {
    const result: T[] = [];

    for (const history of this.histories) {
      result.push(history.accept<T>(visitor));
    }

    return result;
  }
}

export default History;
