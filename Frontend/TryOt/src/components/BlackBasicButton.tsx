import React from 'react';
import {Button} from 'react-native-paper';
import {ButtonProps} from 'react-native';

interface BlackBasicButtonProps extends ButtonProps {
  onClick?: () => void;
  buttonText: String;
  isButtonActive?: boolean;
}

const BlackBasicButton = (props: BlackBasicButtonProps) => {
  const activeColor = 'black';
  const inactiveColor = 'grey';

  const [isButtonActive, setIsButtonActive] = React.useState(
    props.isButtonActive ?? false,
  );

  return (
    <Button
      mode="contained"
      buttonColor={isButtonActive ? activeColor : inactiveColor}
      style={{padding: 5, borderRadius: 8, height: 50}}
      onPressIn={() => setIsButtonActive(true)}
      onPressOut={() => setIsButtonActive(false)}
      labelStyle={{fontSize: 16}}>
      {props.buttonText}
    </Button>
  );
};

export default BlackBasicButton;
