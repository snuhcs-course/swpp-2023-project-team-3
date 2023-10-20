import {Image, Text, View} from 'react-native';

export default function FashionItem({
  imageSrc,
  title,
  detail,
}: {
  imageSrc: string;
  title: string;
  detail: string;
}) {
  //   return <Text>{imageSrc}</Text>;
  return <Image source={require(imageSrc)} />;
}
