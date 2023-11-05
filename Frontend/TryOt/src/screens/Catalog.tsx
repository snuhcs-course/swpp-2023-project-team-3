import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
import {RootStackParamList} from './Home';
import {searchItems} from '../api/searchItemsApi';
import {fetchFashionItemDetails} from '../api/itemDetailApi';
import {FashionItem} from '../models/FashionItem';
import CatalogItem from '../components/CatalogItem';
import QueryRefineModal from '../components/QueryRefineModal';
import {PaperProvider} from 'react-native-paper';
import {vw} from '../constants/design';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

type ItemSimilarityDictionary = {[key: string]: number};

function Catalog({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'Catalog'>) {
  const {gptUsable, id} = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>(route.params.searchQuery);
  const [items, setItems] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQueries, setSearchQueries] = useState<string[]>([query]);
  const [targetIndex, setTargetIndex] = useState<number[]>([]);

  //search results (+pagination)
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // Number of items to load per page
  const [searchResults, setSearchResults] = useState([]);


  const [itemDataArray, setItemDataArray] = useState<ItemSimilarityDictionary[]>([]);
  const [mergedIds, setMergedIds] = useState< [string, number][]>([]);

  //refine modal
  const [refineModalVisible, setLogoutModalVisible] = useState(false);
  const showRefineModal = () => setLogoutModalVisible(true);
  const hideRefineModal = () => setLogoutModalVisible(false);

  //refine search only changes the combination of gpt queries
  const handleRefineSearch = () => {
    mergeAndSortItemIds();
    fetchItemDetails().catch(error => {
      console.log(error);
    });
  };

  //for fetching entire data for one search
  async function fetchItemIds() {
    try {
      const response = await searchItems(id, query);
      setSearchQueries(response.text);

      const userQueryIds = response.items.query;
      const gpt1Ids = response.items.gpt_query1;
      const gpt2Ids = response.items.gpt_query2;
      const gpt3Ids = response.items.gpt_query3;

      setItemDataArray(() => {return [userQueryIds, gpt1Ids, gpt2Ids, gpt3Ids]});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  //for fetching the item details with pagination
  async function fetchItemDetails() {
    setLoading(true);
    try {
      // Calculate the range of item indexes to fetch for the current page
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const slicedItems = mergedIds.slice(startIndex, endIndex);
      const slicedMergedIds = Object.fromEntries(slicedItems);
      const itemIdsToFetch = Object.keys(slicedMergedIds);
      const itemDetails = await Promise.all(
        itemIdsToFetch.map(itemId => fetchFashionItemDetails(itemId)),
      );

      setItems(prevItems => [...prevItems, ...itemDetails]);
      setLoading(false);

      // If there are more items to fetch, increment the current page
      if (endIndex < mergedIds.length) {
        setPage(page + 1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  //for merging each query dictionary
  function mergeDictionaries(dictionaries: ItemSimilarityDictionary[]) {
    return dictionaries.reduce((result, dictionary) => {
      for (const key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
          if (result[key] === undefined || dictionary[key] > result[key]) {
            result[key] = dictionary[key];
          }
        }
      }
      return result;
    }, {});
  }

  //for sorting the merged dictionary (return is array)
  function sortDictionaryByValues(dictionary: ItemSimilarityDictionary) {
    return Object.entries(dictionary).sort((a, b) => b[1] - a[1]);
  }

  //for merging and sorting the fetched item ids and their similarities
  function mergeAndSortItemIds() {
    const mergedDictionary: ItemSimilarityDictionary = mergeDictionaries(itemDataArray);
    console.log(mergedDictionary);
    const sortedMergedDictionary = sortDictionaryByValues(mergedDictionary);
    setMergedIds(() => sortedMergedDictionary);
  }

  useEffect(() => {
    console.log("------Catalog is rendered------");
    const fetchData = async () => {
      if (gptUsable) {
        setTargetIndex([1, 1, 1, 1]);
      } else {
        setTargetIndex([1, 0, 0, 0]);
      }

      try {
        await fetchItemIds();
        mergeAndSortItemIds();
        await fetchItemDetails();
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [route.params.searchQuery, page]);


  const navigateToItemDetail = (item: FashionItem) => {
    // @ts-ignore
    navigation.navigate('ItemDetail', {item});
  };

  const changeQueryText = (text: string) => {
    setQuery(text);
    setTargetIndex([1, 0, 0, 0]);
    setSearchQueries([text]);
    //이때부터 새로운 지피티 use start
  };

  // @ts-ignore
  return (
    <PaperProvider>
      <View
        style={{
          backgroundColor: 'white',
          height: Dimensions.get('window').height,
        }}>
        <TextInput
          style={styles.searchQueryInput}
          value={query}
          onChangeText={changeQueryText}
          importantForAutofill="yes"
          returnKeyType="next"
          clearButtonMode="while-editing"
          onSubmitEditing={handleRefineSearch}
          blurOnSubmit={false}
        />
        <View
          style={styles.refinedQueryShow}
          onTouchStart={() => {
            showRefineModal();
          }}>
          <Image
            style={{resizeMode: 'contain', width: '5%', height: '100%'}}
            source={require('../assets/Icon/Vector.png')}
          />
          <Text style={{color: 'black', paddingRight: 5 * vw}}>
            GPT has refined your query into new queries
          </Text>
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
        <QueryRefineModal
          hideRefineModal={hideRefineModal}
          refinedQueries={searchQueries}
          onSearch={handleRefineSearch}
          refineModalVisible={refineModalVisible}
          setTargetIndex={setTargetIndex}
          targetIndex={targetIndex}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  searchQueryInput: {
    padding: 10,
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').height * 0.05,
    margin: Dimensions.get('screen').width * 0.05,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
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
    justifyContent: 'space-around',
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
