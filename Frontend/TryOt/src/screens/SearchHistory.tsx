import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function SearchHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Developing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  text: {
    color: 'black',
    fontSize: 15,
  },
});

export default SearchHistory;
