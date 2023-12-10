import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

interface TextLikeButtonProps {
  text: string;
  textColor: string;
  onPress?: () => void;
}
const TextLikeButton = (props: TextLikeButtonProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={{color: props.textColor, textDecorationLine: 'underline'}}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default TextLikeButton;
