import {Dimensions, StyleSheet, Text, View} from 'react-native';

export default function RefinedQuery({query}: {query: string}) {
  return (
    <View style={styles.queryWrapper}>
      <Text style={[styles.refinedQuery, {fontSize: 15, fontWeight: 'normal'}]}>
        blah blah blah
      </Text>
      <Text style={[styles.refinedQuery, {fontSize: 15, color: 'gray'}]}>
        X
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  queryWrapper: {
    padding: 10,
    width: Dimensions.get('window').width * 0.9,
    marginBottom: 5,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginTop: 10,
  },
  refinedQuery: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'normal',
  },
});
