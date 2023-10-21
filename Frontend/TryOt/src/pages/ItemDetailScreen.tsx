// ItemDetailScreen.tsx
import {FashionItem} from '../models/FashionItem';
import React, {useState, useEffect} from 'react';
import { View, ScrollView, Text, StyleSheet, Animated, Image, Dimensions } from "react-native";
import BlackBasicButton from "../components/BlackBasicButton";
import { color, fontSize, vw } from '../constants/design';

//일단은 샘플 데이터로 하기
import sampleFashionItem from "../models/FashionItem";

interface ItemDetailScreenProps {
  item: FashionItem;
}

function ItemDetailScreen() {
  const item: FashionItem = sampleFashionItem[0]; //sample item

  const [scrollY] = useState(new Animated.Value(0));
  const [isBarVisible, setIsBarVisible] = useState(true);

  useEffect(() => {
    const scrollListener = scrollY.addListener(({value}) => {
      if (value > 100) {
        setIsBarVisible(false);
      } else {
        setIsBarVisible(true);
      }
    });

    return () => {
      scrollY.removeListener(scrollListener);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: false,
          },
        )}
        scrollEventThrottle={16}>
        {/* Scroll View */}
        <View style={styles.imageContainer}>
          <Image
            style={{width: 70*vw, aspectRatio:1}}
            source={{uri: item.imageUrl[0]}} />
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
      {isBarVisible && (
        <Animated.View
          style={[
            styles.fixedBar,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, -100],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}>
          <BlackBasicButton buttonText={"Purchase Now"} isButtonActive={true} title={"PurchaseButton"}/>
        </Animated.View>
      )}
    </View>
  );
}

ItemDetailScreen.navigationOptions = {
  tabBarVisible: false
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent:'center',
  },

  borderLine: {
    width: 100*vw,
    height: 1,
    backgroundColor: "#F4F4F4",
  },

  scrollContainer: {
    padding: 0, // Adjust as needed
  },

  imageContainer: {
    width: 100*vw,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },

  brandText: {
    color: "black",
    fontSize: fontSize.large,
    fontWeight: "bold",
  },

  queryLogContainer: {
    backgroundColor: "lightgray",
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },

  shortDescriptionText: {
    color: "black",
    fontSize: fontSize.middle,
    fontWeight: "regular"
  },

  descriptionText: {
    color: "black",
    fontSize: fontSize.small,
    fontWeight: "regular",
    paddingTop: 3*vw,
    paddingBottom: 3*vw,
  },

  descriptionContainer: {
    padding: 3*vw,
    backgroundColor: 'white',
    flex: 1,
  },

  brandTitleContainer: {
    paddingBottom: 3*vw,

  },

  fixedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItemDetailScreen;
