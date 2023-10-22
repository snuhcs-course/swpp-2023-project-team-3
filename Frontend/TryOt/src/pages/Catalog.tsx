import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import {RootStackParamList} from './Home';
import SlidingUpPanel from 'rn-sliding-up-panel';
import RefinedQuery from '../components/RefinedQuery';
import { searchItems } from "../api/searchItemsApi";
import { fetchFashionItemDetails } from "../api/itemDetailApi";
import { FashionItem } from "../models/FashionItem";
import CatalogItem from "../components/CatalogItem";

function Catalog({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Catalog'>) {
  const panelRef = useRef<SlidingUpPanel | null>(null);
  let slidingPanelHeight: number;
  const onLayout = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    slidingPanelHeight = height;
  };

  const [items, setItems] = useState<FashionItem[]>([]); // Provide an explicit type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call the searchItems API to get item IDs based on the search query
    searchItems(10, route.params.searchQuery)
      .then(ids => {
        Promise.all(ids.map(itemId => fetchFashionItemDetails(itemId)))
          .then((items) => {
            setItems(items);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching item details:', error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error searching for items:', error);
        setLoading(false);
      });
  }, [route.params.searchQuery]);

  const navigateToItemDetail = (item: FashionItem) => {
    // @ts-ignore
    navigation.navigate('ItemDetail', {item});
  };

  // @ts-ignore
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
      }}>
      <View style={styles.searchQueryInput}>
        <Text style={{color: 'black'}}>{route.params.searchQuery}</Text>
        <Text style={{color: 'gray'}}>x</Text>
      </View>
      <View
        style={styles.refinedQueryShow}
        onTouchStart={() => {
          panelRef.current?.show(slidingPanelHeight);
        }}>
        <Image
          style={{resizeMode: 'contain', width: '5%', height: '100%'}}
          source={require('../assets/Icon/Vector.png')}
        />
        <Text style={{color: 'black'}}>
          GPT has refined your query into new queries
        </Text>
        <Image
          style={{resizeMode: 'contain', width: '5%', height: '100%'}}
          source={require('../assets/Icon/Arrow.png')}
        />
      </View>
      <View style={styles.grayBar} />
      <ScrollView>
        <View style={styles.catalogGrid}>
          {items.map(item => (
            <CatalogItem
              key={item.id}
              fashionItem={item}
              onNavigateToDetail={navigateToItemDetail}
            />
          ))}
        </View>
      </ScrollView>
      <SlidingUpPanel
        ref={c => (panelRef.current = c)}
        // draggableRange={{top: Dimensions.get('window').height, bottom: 0}}
      >
        <View style={styles.slidingPanel} onLayout={onLayout}>
          <Pressable
            style={[
              styles.grayBar,
              {width: 50, marginVertical: 10, borderRadius: 10},
            ]}
            onPress={() => {
              panelRef.current?.hide();
            }}
          />
          <View style={{alignSelf: 'flex-start', paddingLeft: '5%'}}>
            <Text
              style={[
                styles.slidingPanelText,
                {fontSize: 20, marginVertical: '5%'},
              ]}>
              Query Refinement
            </Text>
            <Text style={[styles.slidingPanelText, {fontSize: 18}]}>
              Original Query
            </Text>
            <Text
              style={[
                styles.slidingPanelText,
                {fontSize: 15, fontWeight: 'normal'},
              ]}>
              {route.params.searchQuery}
            </Text>
            <Text
              style={[
                styles.slidingPanelText,
                {fontSize: 18, marginTop: '5%'},
              ]}>
              GPT Refined Query
            </Text>
            <RefinedQuery query="blah blah blah" />
            <RefinedQuery query="blah blah blah" />
            <RefinedQuery query="blah blah blah" />
            <RefinedQuery query="blah blah blah" />
          </View>
        </View>
      </SlidingUpPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  searchQueryInput: {
    padding: 10,
    paddingRight: 20,
    width: Dimensions.get('screen').width * 0.9,
    margin: Dimensions.get('screen').width * 0.05,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  refinedQueryShow: {
    padding: 10,
    width: Dimensions.get('screen').width * 0.9,
    marginLeft: Dimensions.get('screen').width * 0.05,
    marginBottom: 10,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grayBar: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 0.01,
    backgroundColor: '#eee',
  },
  itemList: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  slidingPanel: {
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '10%',
  },
  slidingPanelText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Catalog;
