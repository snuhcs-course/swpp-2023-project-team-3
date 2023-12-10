import React, {StyleSheet, Text, View} from 'react-native';
import {useCallback, useEffect, useState} from 'react';

import {vw} from '../constants/design';
import {FashionItem} from '../models/FashionItem';
import ImageGridItem from './ImageGridItem';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackProps} from '../screens/Authenticated/HomeTab/HomeTab';
import {ChatInfo} from '../models-refactor/chat/ChatComponent';
import {clickLogApi} from '../api/clickLogApi';

type ChatBubbleProps = {
  who: string;
  info: ChatInfo[number];
  navigation: NativeStackNavigationProp<HomeStackProps, 'Chat', undefined>;
};

export default function ChatBubble({who, info, navigation}: ChatBubbleProps) {
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
    if ('items' in info) {
      const itemData = await Promise.all(
        info.items.map(val => val.getDetail()),
      );
      return itemData;
    } else {
      return [];
    }
  }, [info]);

  useEffect(() => {
    fetchData()
      .then(data => {
        setFashionItems(data);
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, [fetchData]);

  return (
    <View
      style={[
        styles.container,
        who == 'Tryot' ? styles.otherContainer : styles.userContainer,
      ]}>
      <View
        style={[
          styles.triangle,
          who == 'Tryot' ? styles.triangleLeft : styles.triangleRight,
        ]}
      />
      <Text style={{alignSelf: who == 'Tryot' ? 'flex-start' : 'flex-end'}}>
        {who}
      </Text>
      {'content' in info ? (
        <Text style={styles.content}>{info.content}</Text>
      ) : (
        <>
          <Text style={styles.content}>{info.answer}</Text>
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
    maxWidth: 81 * vw,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#e9cff5', // point purple
  },
  otherContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff', // Light gray for others
    borderWidth: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    position: 'absolute',
  },
  triangleRight: {
    // borderRightWidth: 25,
    // borderBottomWidth: 20,
    // borderLeftColor: 'transparent',
    // borderRightColor: 'transparent',
    // borderBottomColor: '#c3b1cb', // Match user container color
    // bottom: 10,
    // right: -10,
  },
  triangleLeft: {
    // borderLeftWidth: 25,
    // borderBottomWidth: 20,
    // borderLeftColor: 'transparent',
    // borderRightColor: 'transparent',
    // borderBottomColor: '#000', // Match other container color
    // bottom: 10,
    // left: -10,
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
