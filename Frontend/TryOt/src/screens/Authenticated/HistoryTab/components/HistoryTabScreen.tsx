import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {StyleSheet, Text, View} from 'react-native';
import {LoadingAndError} from '../../../../components/LoadingAndError';
import {ActivityIndicator} from 'react-native-paper';
import HistoryCell from './HistoryCell';
import {HistoryCellData} from '../../../../models-refactor/history/visitor/GetDataVisitor';

const LoadingView = () => {
  return (
    <View style={loadingStyles.loadingContainer}>
      <ActivityIndicator size="large" color="black" />
      <Text>Loading...</Text>
    </View>
  );
};

const separatorItem = () => <View style={styles.separator} />;

export type HistoryTabScreenProps = {
  histories: HistoryCellData[];
  isLoading: boolean;
  isError: boolean;
};

function HistoryTabScreen({
  isLoading,
  isError,
  histories,
}: HistoryTabScreenProps) {
  return (
    <LoadingAndError
      isLoading={isLoading}
      isError={isError}
      errorMessage="Error occurred with fetching data"
      loadingComponent={<LoadingView />}>
      <View style={styles.container}>
        <FlatList
          style={styles.historyList}
          data={histories}
          ListEmptyComponent={<></>}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <HistoryCell history={item} />}
          ItemSeparatorComponent={separatorItem}
          ListHeaderComponent={separatorItem}
          keyExtractor={item => `${item.timestamp.getTime()}`}
        />
      </View>
    </LoadingAndError>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  historyList: {
    flexGrow: 1,
    width: '100%',
  },
  separator: {backgroundColor: '#EEEEEE', height: 5},
});

const loadingStyles = StyleSheet.create({
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HistoryTabScreen;
