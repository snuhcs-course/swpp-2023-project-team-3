import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {color} from '../../../../constants/design';
import {HistoryCellData} from '../../../../models-refactor/history/visitor/GetDataVisitor';

type HistoryCellProps = {
  history: HistoryCellData;
};

function HistoryCell({history}: HistoryCellProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={history.onPress}>
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
            name={history.emoji}
            size={12}
            style={{...styles.headerIcon, ...{transform: [{scaleX: -1}]}}}
          />
          <Text style={styles.headerText}>{history.searchType}</Text>
        </View>
      </View>
      <View style={styles.title}>
        <Text style={styles.titleFont}>{history.title}</Text>
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
