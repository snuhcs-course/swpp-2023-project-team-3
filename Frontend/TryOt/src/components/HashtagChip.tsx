import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {fontSize, vw} from '../constants/design';

interface HashtagChipProps {
  label: string;
  onClick: () => void;
}

const HashtagChip = (props: HashtagChipProps) => {
  return (
    <TouchableOpacity onPress={props.onClick}>
      <View style={styles.container}>
        <Text style={styles.label}>#{props.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(101, 78, 161, 0.2)', // Background color with 20% opacity
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#654EA1',
    fontSize: fontSize.middle,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
});

export default HashtagChip;
