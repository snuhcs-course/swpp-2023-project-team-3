import {Dimensions, StyleSheet, Text, View} from 'react-native';
import { Switch } from 'react-native-paper';
import {useState} from 'react';

interface RefinedQueryProps {
  query: string;
  handleToggleSwitch: (index: number) => void;
  index: number,
}

export default function RefinedQuery({ query, handleToggleSwitch, index}: RefinedQueryProps) {
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    handleToggleSwitch(index);
  }

  return (
    <View style={styles.queryWrapper}>
      <Text style={[styles.refinedQuery, {fontSize: 15, fontWeight: 'normal'}]}>
        {query}
      </Text>
      <Switch value={isSwitchOn} onValueChange={onToggleSwitch}/>
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
