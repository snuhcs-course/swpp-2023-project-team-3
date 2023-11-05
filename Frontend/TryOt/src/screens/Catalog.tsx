import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
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
  const [loading, setLoading] = useState(false);
  const [searchQueries, setSearchQueries] = useState<string[]>([query]);
  const [targetIndex, setTargetIndex] = useState<number[]>([]);

  //search results (+pagination)
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // Number of items to load per page

  const [itemDataArray, setItemDataArray] = useState<ItemSimilarityDictionary[]>([]);
  const [sortedIds, setSortedIds] = useState< string[]>(['']);

  //refine modal
  const [refineModalVisible, setLogoutModalVisible] = useState(false);
  const showRefineModal = () => setLogoutModalVisible(true);
  const hideRefineModal = () => setLogoutModalVisible(false);

  //refine search only changes the combination of gpt queries
  const handleRefineSearch = () => {
    setItems([]); //보일 아이템들은 초기화
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
      console.error('Error fetching id data:', error);
    }
  }

  //for fetching the item details with pagination
  async function fetchItemDetails() {
    setLoading(true);
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const slicedIds = sortedIds.slice(startIndex, endIndex);
      const itemDetails = await Promise.all(
        slicedIds.map(itemId => fetchFashionItemDetails(itemId)),
      );
      setItems(prevItems => [...prevItems, ...itemDetails]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching item detail data:', error);
      setLoading(false);
    }
  }

  //for merging each query dictionary
  function mergeDictionaries() {
    return itemDataArray.reduce((result, dictionary, index) => {
      if (targetIndex[index] === 1) {
        for (const key in dictionary) {
          if (dictionary.hasOwnProperty(key)) {
            if (result[key] === undefined || dictionary[key] > result[key]) {
              result[key] = dictionary[key];
            }
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
    const mergedDictionary: ItemSimilarityDictionary = mergeDictionaries();
    const sortedMergedDictionary = sortDictionaryByValues(mergedDictionary);
    const idArrays = sortedMergedDictionary.map(([id, _]) => id);
    setSortedIds(idArrays);
  }

  const fetchData = async () => {
    //초기화
    setItems([]);
    setPage(1);

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

  useEffect(() => {
    console.log("------Catalog is rendered------");
    fetchData();
  }, []);


  const navigateToItemDetail = (item: FashionItem) => {
    // @ts-ignore
    navigation.navigate('ItemDetail', {item});
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
          onChangeText={(text: string) => {setQuery(text)}}
          importantForAutofill="yes"
          returnKeyType="next"
          clearButtonMode="while-editing"
          onSubmitEditing={() => fetchData()}
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
        <FlatList
            data={items}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <CatalogItem
                    fashionItem={item}
                    onNavigateToDetail={navigateToItemDetail}
                />
            )}
            contentContainerStyle={styles.catalogGrid}
            onEndReached={() => {
              setPage((prevPage) => prevPage + 1);
            }}
            onEndReachedThreshold={0.1}
        />
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
    justifyContent: 'space-between',
    flexGrow: 1,
    margin: 8, // Adjust as needed
    padding: 16,
    backgroundColor: 'white', // Adjust as needed
    width: '100%',
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
