import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Switch } from 'react-native-paper';
import { useState } from 'react';

interface RefinedQueryProps {
  query: string;
  isSwitchOn: boolean;
  handleToggleSwitch: (index: number) => void;
  gptIndex: number;
}

export default function RefinedQuery({
                                       query,
                                       isSwitchOn,
                                       handleToggleSwitch,
                                       gptIndex,
                                     }: RefinedQueryProps) {
  const onToggleSwitch = () => {
    console.log(
        'Toggled switch for gpt index ' +
        gptIndex +
        ' from ' +
        isSwitchOn +
        ' to ' +
        !isSwitchOn
    );
    handleToggleSwitch(gptIndex);
  };

  return (
      <View style={styles.queryWrapper}>
        <Text style={styles.refinedQuery}>{query}</Text>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      </View>
  );
}

const styles = StyleSheet.create({
  queryWrapper: {
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items in the center vertically
    marginTop: 10,
    width: '100%',
  },
  refinedQuery: {
    flex: 1, // Allow text to take up remaining space
    color: 'black',
    fontSize: 15,
    fontWeight: 'normal',
    marginRight: 10, // Add some spacing between text and switch
  },
});

