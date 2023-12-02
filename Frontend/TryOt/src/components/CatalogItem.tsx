import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {FashionItem} from '../models/FashionItem';
import {fontSize, vw} from '../constants/design';

const CatalogItem = ({
  fashionItem,
  onNavigateToDetail,
}: {
  fashionItem: FashionItem;
  onNavigateToDetail: (item: FashionItem) => void;
}) => {
  const navigateToDetail = () => {
    onNavigateToDetail(fashionItem);
  };

  const imageUrl = `https://tryot.s3.ap-northeast-2.amazonaws.com/item_img/${fashionItem.id}.jpg`;

  return (
    <TouchableOpacity onPress={navigateToDetail} style={styles.container}>
      <Image
        source={{uri: imageUrl}}
        style={styles.image}
      />
      <Text style={styles.brand}>{fashionItem.brand}</Text>
      <Text style={styles.shortDescription}>
        {fashionItem.shortDescription}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={[styles.price]}>${fashionItem.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 50 * vw,
  },
  brand: {
    fontWeight: 'bold',
    fontSize: fontSize.middle,
    color: 'black',
  },
  shortDescription: {
    fontSize: fontSize.small,
    color: 'black',
    marginBottom: 10 * vw,
  },
  priceContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  price: {
    fontSize: fontSize.middle,
    color: 'black',
  },
});

export default CatalogItem;
