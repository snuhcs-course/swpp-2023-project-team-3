import React, {StyleSheet, Text, View} from 'react-native';
import {useCallback, useEffect, useState} from 'react';

import {vw} from '../constants/design';
import {isUserMessage, message} from '../screens/Chat';
import {FashionItem} from '../models/FashionItem';
import {fetchFashionItemDetails} from '../api/itemDetailApi';
import ImageGridItem from './ImageGridItem';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../screens/Home';

type ChatBubbleProps = {
  who: string;
  msg: message;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat', undefined>;
};

export default function ChatBubble({who, msg, navigation}: ChatBubbleProps) {
  const [fashionItems, setFashionItems] = useState<FashionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const navigateToItemDetail = useCallback(
    (item: FashionItem) => {
      navigation.navigate('ItemDetail', {item});
    },
    [navigation],
  );
  const fetchData = useCallback(async () => {
    if (!isUserMessage(msg)) {
      const itemData = await Promise.all(
        Object.keys(msg.items).map(val => fetchFashionItemDetails(val)),
      );
      return itemData;
    } else {
      return [];
    }
  }, [msg]);

  useEffect(() => {
    fetchData()
      .then(data => {
        setFashionItems(data);
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, [fetchData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{who}</Text>
      {isUserMessage(msg) ? (
        <Text style={styles.content}>{msg.content}</Text>
      ) : (
        <>
          <Text style={styles.content}>{msg.answer}</Text>
          {isError ? (
            <Text style={styles.errormessage}>Error occurred</Text>
          ) : isLoading ? (
            <></>
          ) : (
            <View style={styles.imageGrid}>
              {fashionItems.map(item => (
                <ImageGridItem
                  key={item.id}
                  fashionItem={item}
                  onNavigateToDetail={navigateToItemDetail}
                />
              ))}
            </View>
          )}
        </>
      )}
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
  errormessage: {
    color: 'red',
    fontSize: 14,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
});
