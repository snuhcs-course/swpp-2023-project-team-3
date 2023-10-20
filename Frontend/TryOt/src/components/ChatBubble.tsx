import {StyleSheet, Text, View} from 'react-native';

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
    margin: '3%',
  },
  title: {
    color: '#999',
    fontSize: 15,
  },
  content: {
    color: 'black',
    fontSize: 17,
  },
});
