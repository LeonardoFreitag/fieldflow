import * as React from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
// import { useSharedValue } from 'react-native-reanimated';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';

interface SliderMainPageProps {
  photos: string[];
}

interface SliderItemProps {
  index: number;
  photo: string;
}

const { width } = Dimensions.get('window');

export function SliderMainPage({ photos }: SliderMainPageProps) {
  // const progress = useSharedValue<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);

  const imageList: SliderItemProps[] = photos.map((photo, index) => {
    return {
      index,
      photo: photo || '',
    };
  });

  function SliderItem({
    item,
    index,
  }: {
    item: SliderItemProps;
    index: number;
  }) {
    return (
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
        <Image
          source={{ uri: item.photo }}
          style={{ width, height: 245, borderRadius: 2 }}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width,
      }}
    >
      <Carousel
        ref={ref}
        // autoPlayInterval={2000}
        autoPlay={false}
        data={imageList}
        height={260}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={width}
        style={{
          width,
          height: 245,
          borderRadius: 8,
          alignSelf: 'center',
          marginHorizontal: 10,
        }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.88,
          parallaxScrollingOffset: 60,
        }}
        renderItem={({ item, index }) => (
          <SliderItem index={index} item={item} />
        )}
      />
    </View>
  );
}
