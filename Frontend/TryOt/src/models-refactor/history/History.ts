import {historyDetailApi} from '../../api-refactor';
import HistoryElement from './HistoryElement';
import HistoryFactory from './factory/HistoryFactory';
import HistoryVisitor from './visitor/HistoryVisitor';

class History {
  private userId: number;
  private histories: HistoryElement[] = [];

  constructor(userId: number) {
    this.userId = userId;
  }

  accept<T>(visitor: HistoryVisitor<T>): T[] {
    const result: T[] = [];

    for (const history of this.histories) {
      result.push(history.accept<T>(visitor));
    }

    return result;
  }

  public async getHistoryData() {
    const allHistory = await historyDetailApi(this.userId);
    const sortedHistory = allHistory.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
    const historyFactory = new HistoryFactory();
    for (const history of sortedHistory) {
      this.histories.push(historyFactory.createHistory(history));
    }
  }
}

export default History;
