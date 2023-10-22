// ItemDetailScreen.tsx
import {FashionItem} from '../models/FashionItem';
import { fetchFashionItemDetails } from "../api/itemDetailApi";

import {View, ScrollView, Text, StyleSheet, Image, Linking} from 'react-native';
import BlackBasicButton from '../components/BlackBasicButton';
import {fontSize, vw} from '../constants/design';

import { useEffect, useState } from "react";

interface ItemDetailScreenProps {
  item: FashionItem;
}

function ItemDetailScreen() {
  const itemId = '19214697';
  const [item, setItem] = useState<FashionItem | null>(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    console.log('Fetching item details...');
    fetchFashionItemDetails(itemId)
      .then(fetchedItem => {
        // Modifying image size
        fetchedItem.imageUrl = fetchedItem.imageUrl.map(url =>
          url.replace(/_54/, '_500'),
        );
        setItem(fetchedItem);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching item details:", error);
        setLoading(false);
      });
  }, []);

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
        // Show a blank view while loading
        <View style={{ width: 0, height: 0 }} />
      ) : item ? (
        <ScrollView contentContainerStyle={styles.scrollContainer} scrollEventThrottle={16}>
          {/* Scroll View */}
          <View style={styles.imageContainer}>
            <Image style={{ width: 70 * vw, aspectRatio: 1 }} source={{ uri: item.imageUrl[0] }} />
          </View>
          <View style={styles.descriptionContainer}>
            <View style={styles.brandTitleContainer}>
              <Text style={styles.brandText}>{item.brand}</Text>
              <Text style={styles.shortDescriptionText}>{item.shortDescription}</Text>
            </View>
            <Text>$ {item.price}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
          <View style={styles.borderLine} />
          <View style={styles.queryLogContainer}>
            <Text>쿼리 기록 (Iteration 4)</Text>
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
    backgroundColor: 'lightgray',
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
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
