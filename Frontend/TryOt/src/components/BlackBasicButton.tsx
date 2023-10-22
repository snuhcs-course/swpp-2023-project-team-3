import React from 'react';
import {Button} from 'react-native-paper';
import {ButtonProps} from 'react-native';

interface BlackBasicButtonProps extends ButtonProps {
  onClick?: () => void;
  buttonText: String;
  isButtonActive: boolean;
}

const BlackBasicButton = (props: BlackBasicButtonProps) => {
  const activeColor = 'black';
  const inactiveColor = 'grey';

  return (
    <Button
      mode="contained"
      buttonColor={props.isButtonActive ? activeColor : inactiveColor}
      style={{padding: 5, borderRadius: 8, height: 50}}
      labelStyle={{fontSize: 16}}
      onPress={props.onClick}
      >
      {props.buttonText}
    </Button>
  );
};

export default BlackBasicButton;
