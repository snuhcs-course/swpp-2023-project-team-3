import React, {StyleSheet, Text, View} from 'react-native';
import {useCallback, useEffect, useState} from 'react';

import {vw} from '../constants/design';
import {
  isUserMessage,
  message,
} from '../screens/Authenticated/HomeTab/ChatScreen';
import {FashionItem} from '../models/FashionItem';
import {fetchFashionItemDetails} from '../api/itemDetailApi';
import ImageGridItem from './ImageGridItem';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackProps} from '../screens/Authenticated/HomeTab/HomeTab';

type ChatBubbleProps = {
  who: string;
  msg: message;
  isErrorMsg: boolean;
  navigation: NativeStackNavigationProp<HomeStackProps, 'Chat', undefined>;
};

export default function ChatBubble({
  who,
  msg,
  isErrorMsg,
  navigation,
}: ChatBubbleProps) {
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
    if (!isUserMessage(msg) && !isErrorMsg) {
      const itemData = await Promise.all(
        msg.items.map(val => fetchFashionItemDetails(`${val}`)),
      );
      return itemData;
    } else {
      return [];
    }
  }, [isErrorMsg, msg]);

  useEffect(() => {
    fetchData()
      .then(data => {
        setFashionItems(data);
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, [fetchData]);

  return (
    <View style={[styles.container, who=="Trytri" ? styles.otherContainer : styles.userContainer]}>
      <View style={[styles.triangle, who=="Trytri" ? styles.triangleLeft : styles.triangleRight]} />
      {/* <Text style={who=="Trytri" ? styles.title : styles.userTitle}>{who}</Text> */}
      {isUserMessage(msg) ? (
        isErrorMsg ? (
          <Text style={styles.errormessage}>{msg.content}</Text>
        ) : (
          <Text style={styles.content}>{msg.content}</Text>
        )
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
    margin: ((vw * 10) / 360) * 100,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
    maxWidth : 81*vw
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50', // Green for user
  },
  otherContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#000', // Light gray for others
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    position: 'absolute',
  },
  triangleRight: {
    borderRightWidth: 25,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#4CAF50', // Match user container color
    bottom: 10,
    right: -10,
  },
  triangleLeft: {
    borderLeftWidth: 25,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000', // Match other container color
    bottom: 10,
    left: -10,
  },
  title: {
    color: '#aaa',
    fontSize: 12,
  },
  userTitle : {
    color: '#000',
    alignSelf : 'flex-end'
  },
  content: {
    color: '#fff',
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
