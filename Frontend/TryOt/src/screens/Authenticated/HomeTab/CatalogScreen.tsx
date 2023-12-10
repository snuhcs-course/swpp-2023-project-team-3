import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import CatalogItem from '../../../components/CatalogItem';
import QueryRefineModal from '../../../components/QueryRefineModal';
import {ActivityIndicator, PaperProvider} from 'react-native-paper';
import {vw} from '../../../constants/design';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducer';
import {clickLogApi} from '../../../api/clickLogApi';
import Search from '../../../models-refactor/search/Search';
import {FashionItem} from '../../../api-refactor/itemDetailApi';

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
  const [targetIndex, setTargetIndex] = useState<boolean[]>([]);
  const [finalSearchQuery, setFinalSearchQuery] = useState<string>(
    route.params.searchQuery,
  );
  const searchManager = useMemo(
    () => new Search(id, route.params),
    [id, route.params],
  );

  //refine modal
  const [refineModalVisible, setLogoutModalVisible] = useState(false);
  const showRefineModal = () => setLogoutModalVisible(true);
  const hideRefineModal = () => setLogoutModalVisible(false);

  const fetchData = useCallback(async () => {
    //초기화
    setItems([]);

    const isNavigatedFromItemDetails =
      route.params?.prevScreen === 'ItemDetails';

    let __targetIndex: boolean[] = [];
    if (gptUsable && !isNavigatedFromItemDetails) {
      __targetIndex = [true, true, true, true];
      setTargetIndex([true, true, true, true]);
    } else {
      //ItemDetails 에서 온거라면 GPT Index 는 모두 꺼져 있어야한다.
      __targetIndex = [true, false, false, false];
      setTargetIndex([true, false, false, false]);
    }

    try {
      setLoading(true);

      const response = await searchManager.search(
        searchQueries.length === 1 ? undefined : finalSearchQuery,
      );
      setLogId(response.log_id);
      setSearchQueries(response.text);
      searchManager.select(__targetIndex);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        console.error(error); // Log the error for debugging purposes
        Alert.alert('Notification', error.message);
        return;
      } else {
        console.error('An unknown error occurred:', error);
        Alert.alert('Notification', 'An unexpected error occurred');
        return;
      }
    }
  }, [
    finalSearchQuery,
    gptUsable,
    route.params?.prevScreen,
    searchManager,
    searchQueries.length,
  ]);

  //refine search only changes the combination of gpt queries
  const handleRefineSearch = useCallback(async () => {
    await searchManager?.select(targetIndex);
  }, [searchManager, targetIndex]);

  useEffect(() => {
    console.log('------Catalog is rendered------');
    searchManager.addObserver(setItems);
    setQuery(route.params.searchQuery);
    setFinalSearchQuery(route.params.searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(finalSearchQuery);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalSearchQuery]);

  useEffect(() => {
    if (targetIndex.length > 0) {
      searchManager.select(targetIndex).catch(() => {
        Alert.alert('Error occured', 'Try again', [
          {text: 'OK', onPress: () => navigation.pop()},
        ]);
      });
    }
  }, [navigation, searchManager, targetIndex]);

  const navigateToItemDetail = (item: FashionItem) => {
    // @ts-ignore
    if (logId !== 0) {
      clickLogApi(item.id, logId, 1);
      navigation.navigate('ItemDetail', {item});
    }
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
          onChangeText={(text: string) => {
            const englishOnlyText = text.replace(/[^a-zA-Z\s]/g, '');
            setQuery(englishOnlyText);
          }}
          importantForAutofill="yes"
          returnKeyType="next"
          clearButtonMode="while-editing"
          onSubmitEditing={() => setFinalSearchQuery(query)}
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
          onEndReached={async () => {
            await searchManager?.nextPage();
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
