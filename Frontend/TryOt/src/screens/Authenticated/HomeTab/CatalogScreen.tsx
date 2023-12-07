/* eslint-disable react-hooks/exhaustive-deps */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {HomeStackProps} from './HomeTab';
import {searchItems} from '../../../api/searchItemsApi';
import {fetchFashionItemDetails} from '../../../api/itemDetailApi';
import {FashionItem} from '../../../models/FashionItem';
import CatalogItem from '../../../components/CatalogItem';
import QueryRefineModal from '../../../components/QueryRefineModal';
import {ActivityIndicator, PaperProvider} from 'react-native-paper';
import {vw} from '../../../constants/design';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducer';
import {clickLogApi} from '../../../api/clickLogApi';
import Search from '../../../models-refactor/search/Search';

type ItemSimilarityDictionary = {[key: string]: number};

export type CatalogScreenProps = {
  Catalog: {
    searchQuery: string;
    gpt_query1?: string;
    gpt_query2?: string;
    gpt_query3?: string;
    prevScreen?: string;
  };
};

function CatalogScreen({
  navigation,
  route,
}: NativeStackScreenProps<HomeStackProps, 'Catalog'>) {
  const [logId, setLogId] = useState<number>(0);
  const {gptUsable, id} = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>(route.params.searchQuery);
  const [items, setItems] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQueries, setSearchQueries] = useState<string[]>([query]);
  const [targetIndex, setTargetIndex] = useState<number[]>([]);

  //search results (+pagination)
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // Number of items to load per page

  const [itemDataArray, setItemDataArray] = useState<
    ItemSimilarityDictionary[]
  >([]);
  const [sortedIds, setSortedIds] = useState<string[]>([]);

  //refine modal
  const [refineModalVisible, setLogoutModalVisible] = useState(false);
  const showRefineModal = () => setLogoutModalVisible(true);
  const hideRefineModal = () => setLogoutModalVisible(false);

  //for fetching entire data for one search
  const fetchItemIds = useCallback(async () => {
    try {
      let apiBody: typeof route.params;
      if (searchQueries.length === 1) {
        apiBody = route.params;
      } else {
        apiBody = {searchQuery: query};
      }
      const response = await searchItems(id, apiBody);
      setSearchQueries(response.text);

      const userQueryIds = response.items.query;
      const gpt1Ids = response.items.gpt_query1;
      const gpt2Ids = response.items.gpt_query2;
      const gpt3Ids = response.items.gpt_query3;
      setLogId(response.log_id);

      const results = [userQueryIds, gpt1Ids, gpt2Ids, gpt3Ids];
      setItemDataArray(results);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error); // Log the error for debugging purposes
        Alert.alert('Notification', error.message);
      } else {
        console.error('An unknown error occurred:', error);
        Alert.alert('Notification', 'An unexpected error occurred');
      }
    }
  }, [id, query]);

  //for fetching the item details with pagination
  const fetchItemDetails = useCallback(async () => {
    setLoading(true);
    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const slicedIds = sortedIds.slice(startIndex, endIndex);
      const itemDetails = await Promise.all(
        slicedIds.map(itemId => fetchFashionItemDetails(itemId)),
      );
      setItems(prevItems => [...prevItems, ...itemDetails]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching item detail data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortedIds]);

  //for merging each query dictionary
  const mergeDictionaries = useCallback(() => {
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
  }, [itemDataArray, targetIndex]);

  //for sorting the merged dictionary (return is array)
  const sortDictionaryByValues = useCallback(
    (dictionary: ItemSimilarityDictionary) => {
      return Object.entries(dictionary).sort((a, b) => b[1] - a[1]);
    },
    [],
  );

  //for merging and sorting the fetched item ids and their similarities
  const mergeAndSortItemIds = useCallback(() => {
    const mergedDictionary: ItemSimilarityDictionary = mergeDictionaries();
    const sortedMergedDictionary = sortDictionaryByValues(mergedDictionary);
    const idArrays = sortedMergedDictionary.map(([id, _]) => id);
    setSortedIds(idArrays);
  }, [mergeDictionaries, sortDictionaryByValues]);

  const fetchData = useCallback(async () => {
    //초기화
    setItems([]);
    setPage(1);

    const isNavigatedFromItemDetails = route.params?.prevScreen === 'ItemDetails';

    if (gptUsable && !isNavigatedFromItemDetails) {
      setTargetIndex([1, 1, 1, 1]);
    } else {
      //ItemDetails 에서 온거라면 GPT Index 는 모두 꺼져 있어야한다.
      setTargetIndex([1, 0, 0, 0]);
    }
    try {
      await fetchItemIds();
    } catch (error) {
      console.log(error);
    }
  }, [fetchItemIds, gptUsable]);

  //refine search only changes the combination of gpt queries
  const handleRefineSearch = useCallback(() => {
    setItems([]); //보일 아이템들은 초기화
    mergeAndSortItemIds();
    fetchItemDetails().catch(error => {
      console.log(error);
    });
  }, [fetchItemDetails, mergeAndSortItemIds]);

  useEffect(() => {
    console.log('------Catalog is rendered------');
    fetchData();
  }, []);

  const navigateToItemDetail = (item: FashionItem) => {
    // @ts-ignore
    if (logId !== 0) {
      clickLogApi(item.id, logId, 1);
      navigation.navigate('ItemDetail', {item});
    }
  };

  useEffect(() => {
    if (itemDataArray.length !== 0) {
      mergeAndSortItemIds();
    }
  }, [itemDataArray]);

  useEffect(() => {
    if (sortedIds.length !== 0) {
      fetchItemDetails();
    }
  }, [sortedIds]);

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
          onChangeText={(text: string) => {
            setQuery(text);
          }}
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
            source={require('../../../assets/Icon/Vector.png')}
          />
          <Text style={{color: 'black', paddingRight: 5 * vw}}>
            GPT has refined your query into new queries
          </Text>
        </View>
        <View style={styles.grayBar} />
        <FlatList
          style={styles.itemCatalog}
          columnWrapperStyle={{justifyContent: 'space-around'}}
          data={items}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <CatalogItem
              fashionItem={item}
              onNavigateToDetail={navigateToItemDetail}
            />
          )}
          contentContainerStyle={styles.catalogGrid}
          onEndReached={() => {
            setPage(page + 1);
            if (items.length !== 0) {
              fetchItemDetails();
            }
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
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
  itemCatalog: {
    alignSelf: 'center',
    backgroundColor: 'white',
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

export default CatalogScreen;
