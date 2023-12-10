import React from 'react';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import {FashionItem} from '../models/FashionItem';
import {vw} from '../constants/design';

const ImageGridItem = ({
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
      <Image source={{uri: imageUrl}} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 25 * vw,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 20 * vw,
  },
});

export default ImageGridItem;
