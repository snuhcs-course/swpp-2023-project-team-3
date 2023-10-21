// ItemDetailScreen.tsx
import {FashionItem} from '../models/FashionItem';
import React, {useState, useEffect} from 'react';
import {View, ScrollView, Text, StyleSheet, Animated} from 'react-native';

interface ItemDetailScreenProps {
  item: FashionItem;
}

function ItemDetailScreen() {
  const [scrollY] = useState(new Animated.Value(0));
  const [isBarVisible, setIsBarVisible] = useState(true);

  useEffect(() => {
    const scrollListener = scrollY.addListener(({value}) => {
      // You can adjust the threshold value as needed
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
        {/* Your scrollable content */}
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
          <Text>Fixed Bottom Bar</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16, // Adjust as needed
  },
  fixedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Adjust as needed
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItemDetailScreen;
