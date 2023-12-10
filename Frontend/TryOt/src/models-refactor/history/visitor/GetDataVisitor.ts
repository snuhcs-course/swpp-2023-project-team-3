import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import HistoryVisitor from './HistoryVisitor';
import {HistoryTabStackProps} from '../../../screens/Authenticated/HistoryTab/HistoryTab';
import ChatHistory from '../ChatHistory';
import SearchHistory from '../SearchHistory';

export type HistoryCellData = {
  title: string;
  timestamp: Date;
  emoji: 'comments' | 'search';
  searchType: 'Chat Search' | 'Catalog Search';
  onPress: () => void;
};

class GetDataVisitor implements HistoryVisitor<HistoryCellData> {
  private navigator: NativeStackNavigationProp<HistoryTabStackProps>;
  constructor(navigator: NativeStackNavigationProp<HistoryTabStackProps>) {
    this.navigator = navigator;
  }
  chatHistoryVisitor(element: ChatHistory): HistoryCellData {
    const history = element.getHistory();
    return {
      title: history.summary,
      timestamp: history.timestamp,
      emoji: 'comments',
      searchType: 'Chat Search',
      onPress: () => this.navigator.navigate('Chat', {chatroom: history.id}),
    };
  }
  searchHistoryVisitor(element: SearchHistory): HistoryCellData {
    const history = element.getHistory();
    return {
      title: history.query,
      timestamp: history.timestamp,
      emoji: 'search',
      searchType: 'Catalog Search',
      onPress: () =>
        this.navigator.navigate('Catalog', {
          searchQuery: history.query,
          gpt_query1: history.gpt_query1,
          gpt_query2: history.gpt_query2,
          gpt_query3: history.gpt_query3,
        }),
    };
  }
}

export default GetDataVisitor;
