import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import {
  type catalogHistory,
  type chatHistory,
  historyDetailApi,
  type historyDetailResponse,
} from '../../../api/historyDetailApi';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducer';
import HistoryTabScreen from './components/HistoryTabScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HistoryTabStackProps} from './HistoryTab';
import {fontSize} from '../../../constants/design';

export type HistoryScreenProps = {
  History: undefined;
};

function HistoryScreen({
  navigation,
}: NativeStackScreenProps<HistoryTabStackProps>) {
  // about tab bar
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'All'},
    {key: 'second', title: 'Chat'},
    {key: 'third', title: 'Catalog'},
  ]);

  // about fetching history
  const {id} = useSelector((state: RootState) => state.user);
  const [history, setHistory] = useState<historyDetailResponse>([]);
  const [catalogHistory, setCatalogHistory] = useState<catalogHistory[]>([]);
  const [chatHistory, setChatHistory] = useState<chatHistory[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchingHistory = useCallback(async () => {
    try {
      const allHistory = await historyDetailApi(id);
      const sortedHistory = allHistory.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      );
      setHistory(sortedHistory);
      let cataloges: catalogHistory[] = [];
      let chats: chatHistory[] = [];
      for (const hist of sortedHistory) {
        if ('query' in hist) {
          cataloges = [...cataloges, hist];
        } else {
          chats = [...chats, hist];
        }
      }
      setCatalogHistory(cataloges);
      setChatHistory(chats);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      fetchingHistory();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const renderScene = useCallback(
    ({route}: {route: (typeof routes)[0]}) => {
      switch (route.key) {
        case 'first':
          return (
            <HistoryTabScreen
              histories={history}
              isLoading={isLoading}
              isError={isError}
              navigation={navigation}
            />
          );
        case 'second':
          return (
            <HistoryTabScreen
              histories={chatHistory}
              isLoading={isLoading}
              isError={isError}
              navigation={navigation}
            />
          );
        case 'third':
          return (
            <HistoryTabScreen
              histories={catalogHistory}
              isLoading={isLoading}
              isError={isError}
              navigation={navigation}
            />
          );
        default:
          return null;
      }
    },
    [catalogHistory, chatHistory, history, isError, isLoading, navigation],
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Search Histories</Text>
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        animationEnabled={true}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            renderLabel={({route, focused}) => (
              <Text style={focused ? styles.focusedTabLabel : styles.tabLabel}>
                {route.title}
              </Text>
            )}
            indicatorStyle={styles.tabIndicator}
            pressColor={'white'}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  header: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 11,
  },

  tabBar: {
    backgroundColor: 'white',
  },
  focusedTabLabel: {
    color: '#654EA1',
    fontSize: fontSize.middle,
    fontWeight: 'bold',
    width: 100,
    height: 50,
  },
  tabLabel: {
    color: '#B5B5B5',
    fontSize: 12,
  },
  tabIndicator: {
    backgroundColor: '#654EA1',
  },
});

export default HistoryScreen;
