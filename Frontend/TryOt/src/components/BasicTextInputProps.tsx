import React from 'react';
import {TextInput, TextInputProps} from 'react-native-paper';
import {Text} from 'react-native';

interface BasicTextInputProps extends TextInputProps {
  label: string;
  width?: number;
  height?: number;
  isValid?: boolean;
  errorMessage?: string;
}

const BasicTextInput = (props: BasicTextInputProps) => {
  return (
    <>
      <TextInput
        onChangeText={props.onChangeText}
        label={props.label}
        mode="outlined"
        outlineColor={'grey'}
        activeOutlineColor={'grey'}
        style={{
          backgroundColor: 'transparent',
          borderRadius: 20,
          height: 50,
          fontSize: 16,
        }}
        outlineStyle = {{
          borderRadius: 10,
        }}
      />
      {!props.isValid && props.errorMessage && (
        <Text style={{color: 'red'}}>{props.errorMessage}</Text>
      )}
    </>
  );
};

export default BasicTextInput;
