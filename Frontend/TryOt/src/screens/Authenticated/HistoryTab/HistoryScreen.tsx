import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducer';
import HistoryTabScreen from './components/HistoryTabScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HistoryTabStackProps} from './HistoryTab';
import {fontSize} from '../../../constants/design';
import History from '../../../models-refactor/history/History';
import GetDataVisitor, {
  HistoryCellData,
} from '../../../models-refactor/history/visitor/GetDataVisitor';

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
  const [history, setHistory] = useState<HistoryCellData[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const historyManager = useMemo<History>(() => new History(id), [id]);

  const fetchingHistory = useCallback(async () => {
    try {
      await historyManager.getHistoryData();
      setHistory(historyManager.accept(new GetDataVisitor(navigation)));
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [historyManager, navigation]);

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
            />
          );
        case 'second':
          return (
            <HistoryTabScreen
              histories={history.filter(
                value => value.searchType === 'Chat Search',
              )}
              isLoading={isLoading}
              isError={isError}
            />
          );
        case 'third':
          return (
            <HistoryTabScreen
              histories={history.filter(
                value => value.searchType === 'Catalog Search',
              )}
              isLoading={isLoading}
              isError={isError}
            />
          );
        default:
          return null;
      }
    },
    [history, isError, isLoading],
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
