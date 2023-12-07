// ItemDetailScreen.tsx
import {FashionItem} from '../../../models/FashionItem';
import {View, ScrollView, Text, StyleSheet, Image, Linking} from 'react-native';
import BlackBasicButton from '../../../components/BlackBasicButton';
import {fontSize, vw} from '../../../constants/design';

import {useEffect, useState} from 'react';
import {HomeStackProps} from './HomeTab';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {reloadSearchQueryHistory} from "../../../api/itemDetailApi";
import {SearchQueryHistoryItem} from "../../../models/SearchQueryHistoryItem";

import HashtagChip from "../../../components/HashtagChip";
import {MyPageTabStackProps} from "../MyPageTab/MyPageTab";

export type ItemDetailScreenProps = {
  ItemDetail: {
    item: FashionItem;
  };
}

type ItemDetailScreenPropType = NativeStackScreenProps<HomeStackProps, 'ItemDetail'> | NativeStackScreenProps<MyPageTabStackProps, 'ItemDetail'>;

function ItemDetailScreen({
                            navigation,
                            route,
                          }: ItemDetailScreenPropType) {
  const item: FashionItem | null = route.params && 'item' in route.params ? route.params.item : null;
  const imageUrl = item ? `https://tryot.s3.ap-northeast-2.amazonaws.com/item_img/${item.id}.jpg` : '';
  const [loading, setLoading] = useState(!item); // Set loading to true if item is null
  const [uniqueQueries, setUniqueQueries] = useState<SearchQueryHistoryItem[]>([]);

  //첫 클릭에서만 하면 됨.
  useEffect(() => {
    if (item) {
      reloadSearchQueryHistory(item.id).then((response) => {

        // Function to filter out duplicate queries
        const filterUniqueQueries = (history: SearchQueryHistoryItem[]) => {
          const uniqueQueries: { [key: string]: boolean } = {};
          return history.filter((item) => {
            if (!uniqueQueries[item.query]) {
              uniqueQueries[item.query] = true;
              return true;
            }
            return false;
          });
        };
        // Use the filtered queries to render HashtagChips
        setUniqueQueries(filterUniqueQueries(response));
      });
    }
  }, []);

  useEffect(() => {
    if (item) {
      setLoading(false);
    }
  }, [item]);

  const handleHashtagClick = (query: string) => {
    (navigation as any).navigate('Catalog', {
      searchQuery: query,
    });
  };

  const openPurchaseURl = () => {
    if (item) {
      Linking.openURL(item.itemUrl)
        .then(() => {
          console.log(`Opened URL: ${item.itemUrl}`);
        })
        .catch(error => {
          console.error(`Error opening URL: ${item.itemUrl}`, error);
        });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{width: 0, height: 0}} />
      ) : item ? (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          scrollEventThrottle={16}>
          <View style={styles.imageContainer}>
            <Image
              style={{width: 60 * vw, height: 100 * vw, margin: 3 * vw}} //TODO: 배율 조정하기
              source={{uri: imageUrl}}
            />
          </View>
          <View style={styles.descriptionContainer}>
            <View style={styles.brandTitleContainer}>
              <Text style={styles.brandText}>{item.brand}</Text>
              <Text style={styles.shortDescriptionText}>
                {item.shortDescription}
              </Text>
            </View>
            <Text>{item.price}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
          <View style={styles.borderLine} />
          <View style={styles.queryLogContainer}>
            {uniqueQueries.map((item, index) => (
                <HashtagChip key={index} label={item.query} onClick={() => handleHashtagClick(item.query)} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text>Error loading item details.</Text>
      )}
      <View style={styles.fixedBar}>
        <BlackBasicButton
          buttonText={'Purchase Now'}
          isButtonActive={true}
          title={'PurchaseButton'}
          onClick={openPurchaseURl}
        />
      </View>
    </View>
  );
}

ItemDetailScreen.navigationOptions = {
  tabBarVisible: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  borderLine: {
    width: 100 * vw,
    height: 1,
    backgroundColor: '#F4F4F4',
  },

  scrollContainer: {
    padding: 0, // Adjust as needed
  },

  imageContainer: {
    width: 100 * vw,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },

  brandText: {
    color: 'black',
    fontSize: fontSize.large,
    fontWeight: 'bold',
  },

  queryLogContainer: {
    padding: 10,
    marginBottom: 80,
  },

  shortDescriptionText: {
    color: 'black',
    fontSize: fontSize.middle,
    fontWeight: 'normal',
  },

  descriptionText: {
    color: 'black',
    fontSize: fontSize.small,
    fontWeight: 'normal',
    paddingTop: 3 * vw,
    paddingBottom: 3 * vw,
  },

  descriptionContainer: {
    padding: 3 * vw,
    paddingBottom: vw,
    backgroundColor: 'white',
    flex: 1,
  },

  brandTitleContainer: {
    paddingBottom: 3 * vw,
  },

  fixedBar: {
    width: 100 * vw,
    padding: 3 * vw,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
  },
});

export default ItemDetailScreen;
