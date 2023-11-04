import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {
    Button,
    Dimensions,
    Image,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
    ScrollView, TextInput, TouchableOpacity,
} from 'react-native';
import {RootStackParamList} from './Home';
import SlidingUpPanel from 'rn-sliding-up-panel';
import RefinedQuery from '../components/RefinedQuery';
import {searchItems} from '../api/searchItemsApi';
import {fetchFashionItemDetails} from '../api/itemDetailApi';
import {FashionItem} from '../models/FashionItem';
import CatalogItem from '../components/CatalogItem';
import QueryRefineModal from "../components/QueryRefineModal";
import { PaperProvider } from 'react-native-paper';
import Icon from "react-native-vector-icons/Ionicons";
import {vw} from "../constants/design";

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

  const [query, setQuery] = useState<string>(route.params.searchQuery);
  const [items, setItems] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQueries, setSearchQueries] = useState<string[]>([query]);
  const [targetIndex,setTargetIndex] = useState<number[]>([1,0,0,0]); //TODO: 이거 글로벌 값으로 대체
    const [gptUsable, setGPTUsable] = useState<number>(0); //TODO: 이거 글로벌 값으로 대체

    const [refineModalVisible, setLogoutModalVisible] = useState(false);
    const showRefineModal = () => setLogoutModalVisible(true);
    const hideRefineModal = () => setLogoutModalVisible(false);

    const handleRefineSearch = () => {
        fetchData().catch(error => {
            console.log(error);
        });
    }

    async function fetchData() {
        setItems([]);
        console.log("call fetch data");
        setLoading(true);
        try {
            const response = await searchItems(10, searchQueries, gptUsable, targetIndex);
            console.log("current gpt usable: ", gptUsable);
            setTargetIndex(response.target_index);
            //setSearchQueries(response.text);

            setSearchQueries(["oroginal", "text 1", "text 2", "text 3"]);

            //TODO: fix to use flat list and pagination
            const first20ItemIds = response.item_ids.slice(0, 20); // Extract the first 20 item_ids
            console.log(first20ItemIds);
            const itemDetails = await Promise.all(first20ItemIds.map(itemId => fetchFashionItemDetails(itemId)));
            setItems(itemDetails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData().catch(error => {
            console.log(error);
        });
    }, [route.params.searchQuery]);


    const navigateToItemDetail = (item: FashionItem) => {
    // @ts-ignore
    navigation.navigate('ItemDetail', {item});
  };

    const changeQueryText = (text: string) => {
        setQuery(text);
        setTargetIndex([1,0,0,0]);
        setSearchQueries([text]);
        //이때부터 새로운 지피티 use start
    }

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
          <Text style={{color: 'black', paddingRight: 5*vw}}>
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
          <QueryRefineModal hideRefineModal={hideRefineModal} refinedQueries={searchQueries} onSearch={fetchData} refineModalVisible={refineModalVisible} setTargetIndex={setTargetIndex} targetIndex={targetIndex} />
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
