import React from 'react';
import type {
  catalogHistory,
  chatHistory,
} from '../../../../api/historyDetailApi';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HistoryTabStackProps} from '../HistoryTab';
import {color} from '../../../../constants/design';

type HistoryCellProps = {
  navigation: NativeStackNavigationProp<HistoryTabStackProps>;
  history: catalogHistory | chatHistory;
};

function HistoryCell({navigation, history}: HistoryCellProps) {
  const isChat = 'summary' in history;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (isChat) {
          navigation.navigate('Chat', {
            chatroom: history.id,
          });
        } else {
          navigation.navigate('Catalog', {
            searchQuery: history.query,
            gpt_query1: history.gpt_query1,
            gpt_query2: history.gpt_query2,
            gpt_query3: history.gpt_query3,
          });
        }
      }}>
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
          <Text style={styles.headerText}>
            {isChat ? 'Chat Search' : 'Catalog Search'}
          </Text>
        </View>
      </View>
      <View style={styles.title}>
        <Text style={styles.titleFont}>
          {isChat ? history.summary : history.query}
        </Text>
      </View>
    </TouchableOpacity>
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
    color: '#cfcade',
  },
  headerText: {},
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: color.pointPurple,
    borderRadius: 5,
  },
  buttonText: {
    color: color.pointPurple,
    fontSize: 14,
    fontWeight: 'bold',
  },

  title: {marginVertical: 3},
  titleFont: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default HistoryCell;
