import HistoryVisitor from './visitor/HistoryVisitor';

interface HistoryElement {
  accept<T>(visitor: HistoryVisitor<T>): T;
}

export default HistoryElement;
