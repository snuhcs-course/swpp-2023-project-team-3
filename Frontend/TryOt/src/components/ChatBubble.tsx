import React, {StyleSheet, Text, View} from 'react-native';
import {vw} from '../constants/design';

export default function ChatBubble({
  who,
  content,
}: {
  who: string;
  content: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{who}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: ((vw * 10) / 360) * 100,
  },
  title: {
    color: '#999',
    fontSize: 12,
  },
  content: {
    color: 'black',
    fontSize: 14,
  },
});
