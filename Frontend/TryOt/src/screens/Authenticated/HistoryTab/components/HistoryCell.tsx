import React from 'react';
import type {catalogHistory, chatHistory} from '../../../../api/historyDetailApi';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {HistoryScreenProps} from '../HistoryScreen';

type HistoryCellProps = {
  navigation: HistoryScreenProps['navigation'];
  history: catalogHistory | chatHistory;
};

function HistoryCell({navigation, history}: HistoryCellProps) {
  const isChat = 'summary' in history;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text>
            {history.timestamp.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </Text>
          <FontAwesome5
            name="circle"
            size={4}
            style={styles.headerIcon}
            solid
          />
          <FontAwesome5
            name={isChat ? 'comments' : 'search'}
            size={12}
            style={{...styles.headerIcon, ...{transform: [{scaleX: -1}]}}}
          />
          <Text>{isChat ? 'Chat Search' : 'Catalog Search'}</Text>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => {
            if (isChat) {
              navigation.navigate('Home', {
                screen: 'Chat',
                params: {searchQuery: '', chatroom: history.id},
              });
            } else {
              navigation.navigate('Home', {
                screen: 'Catalog',
                params: {
                  searchQuery: history.query,
                  gpt_query1: history.gpt_query1,
                  gpt_query2: history.gpt_query2,
                  gpt_query3: history.gpt_query3,
                },
              });
            }
          }}>
          <Text style={styles.buttonText}>Resume Search</Text>
        </Pressable>
      </View>
      <View style={styles.title}>
        <Text style={styles.titleFont}>
          {isChat ? history.summary : history.query}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#B5B5B5',
    fontSize: 12,
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#654EA1',
    borderRadius: 5,
  },
  buttonText: {
    color: '#654EA1',
    fontSize: 14,
    fontWeight: 'bold',
  },

  title: {marginVertical: 10},
  titleFont: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HistoryCell;
