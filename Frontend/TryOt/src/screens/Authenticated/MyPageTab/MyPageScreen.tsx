import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Switch, Modal, Portal, PaperProvider, ActivityIndicator} from 'react-native-paper';
import CatalogItem from '../../../components/CatalogItem';
import userSlice from '../../../slices/user';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {RootState} from '../../../store/reducer';
import {color, fontSize, vh, vw} from '../../../constants/design';
import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {MyPageTabStackProps} from "./MyPageTab";
import {fetchClickLog} from "../../../api/userApi";
import {fetchFashionItemDetails} from "../../../api/itemDetailApi";
import {FashionItem} from "../../../models/FashionItem";
import {clickLogApi} from "../../../api/clickLogApi";
import EncryptedStorage from 'react-native-encrypted-storage';
import {useIsFocused} from "@react-navigation/native";

function MyPageScreen({
  navigation,
}: NativeStackScreenProps<MyPageTabStackProps>) {
  const {email, nickname, gender, username, gptUsable, id} = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [isGPTRefineOn, setIsGPTRefineOn] = React.useState(gptUsable);

  //holds only the item ids for the click log of the user
  const [clickLog, setClickLog] = React.useState<number[]>([]);
  const [items, setItems] = useState<FashionItem[]>([]);

  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);

  const showLogoutModal = () => setLogoutModalVisible(true);
  const hideLogoutModal = () => setLogoutModalVisible(false);

  //TODO: 로그아웃 시 로그아웃 모달 띄우기
  const handleLogout = async () => {
    await EncryptedStorage.removeItem('accessToken');
    dispatch(userSlice.actions.logoutUser());
    console.log(id);
  };

  const handlePasswordChange = () => {
    navigation.navigate('ChangePassword');
  };

  const handleGPTRefineOn = (newValue: boolean) => {
    setIsGPTRefineOn(newValue);
    dispatch(userSlice.actions.setGPTUsable(newValue));
  };

  //유저의 클릭 로그 받아옴 (최신순)
  useEffect(() => {
    fetchClickLog(id).then((response) => {
      response.sort((a, b) => b.search - a.search);

      const uniqueIdsSet = new Set<number>();
      const sortedIds: number[] = [];

      response.forEach(result => {
        if (!uniqueIdsSet.has(result.item)) {
          uniqueIdsSet.add(result.item);
          sortedIds.push(result.item);
        }
      });

      setClickLog(sortedIds);
    });
    fetchItemDetails();
  }, [isFocused]);

  //최근 아이템 디테일 불러오기
  const fetchItemDetails = useCallback(async () => {
    try {
      console.log(clickLog);
      const itemDetails = await Promise.all(
          clickLog.map(itemId => fetchFashionItemDetails(String(itemId))),
      );
      setItems([...itemDetails]);
    } catch (error) {
      console.error('Error fetching item detail data:', error);
    }
  }, [clickLog]);

  const navigateToItemDetail = (item: FashionItem) => {
    // @ts-ignore
    navigation.navigate('ItemDetail', {item});
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.userInfoContainer}>
          <View
            style={[
              styles.circle,
              {backgroundColor: 'black', width: 50, height: 50},
            ]}>
            <Text style={styles.letter}>{username.at(0)}</Text>
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
        <View style={styles.dividerBar} />
        <View style={styles.TableRow}>
          <Text style={styles.text}>Turn on/off GPT refinement</Text>
          <Switch value={isGPTRefineOn} onValueChange={handleGPTRefineOn} />
        </View>
        <TouchableOpacity onPress={handlePasswordChange}>
          <View style={styles.TableRow}>
            <Text style={styles.text}>Change Password</Text>
            <Icon name="chevron-forward-outline" size={20}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{showLogoutModal()}}>
          <View style={styles.TableRow}>
            <Text style={styles.text}>Logout</Text>
            <Icon name="chevron-forward-outline" size={20}/>
          </View>
        </TouchableOpacity>
        <View style={styles.dividerBar} />
        <View style={styles.viewedItemsContainer}>
          <Text style={styles.viewedItemsHeader}>Recently Viewed Items</Text>

          {items.length > 0 ? (
              <FlatList
                  style={styles.itemCatalog}
                  columnWrapperStyle={{ justifyContent: 'space-around' }}
                  data={items}
                  numColumns={items.length > 1 ? 2 : 1} // Adjust numColumns dynamically
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                      <CatalogItem
                          fashionItem={item}
                          onNavigateToDetail={navigateToItemDetail}
                      />
                  )}
                  contentContainerStyle={styles.catalogGrid}
                  onEndReachedThreshold={0.1}
              />
          ) : (
              <View style={styles.emptyMessageContainer}>
                <Text style={styles.emptyMessageText}>
                  Looks like you haven't started your search yet!
                </Text>
              </View>
          )}
        </View>
        <Portal>
          <Modal
            visible={logoutModalVisible}
            onDismiss={hideLogoutModal}
            contentContainerStyle={styles.modalContainerStyle}>
            <Text style={{padding: 10, color: 'black'}}>
              Do you really want to logout?
            </Text>
            <View
              style={{width: '100%', backgroundColor: 'black', height: 1}}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>
            <View
              style={{width: '100%', backgroundColor: 'black', height: 1}}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={hideLogoutModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    paddingTop: 5,
  },

  userInfoContainer: {
    padding: 10,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
  },

  userTextContainer: {
    paddingLeft: 10,
  },

  circle: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  username: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
  },

  email: {
    fontSize: fontSize.middle,
    fontWeight: 'normal',
  },

  dividerBar: {
    backgroundColor: color.backgroundGray,
    height: 8,
  },

  text: {
    color: 'black',
    fontSize: fontSize.middle,
    fontWeight: 'normal',
  },

  TableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 13,
    borderWidth: 1,
    borderColor: color.backgroundGray,
  },

  GenderTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 80 * vw,
    alignSelf: 'center',
    alignItems: 'center',
  },

  modalButton: {
    padding: 10,
    width: '100%',
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'black',
    textAlign: 'center',
  },

  viewedItemsContainer: {
    backgroundColor: 'white',
    padding: 13,
  },

  viewedItemsHeader: {
    color: 'black',
    fontSize: fontSize.large,
    fontWeight: 'bold',
  },
  itemCatalog: {
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  catalogGrid: {
    justifyContent: 'space-between',
    flexGrow: 1,
    margin: 8, // Adjust as needed
    padding: 16,
    backgroundColor: 'white', // Adjust as needed
    width: '100%',
  },
  emptyMessageContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessageText: {
    fontSize: fontSize.small,
     margin: 10 * vh,
    marginTop: 20 * vh,
    marginBottom: 50 * vh,
    textAlign: 'center',
  },
});

export default MyPageScreen;
