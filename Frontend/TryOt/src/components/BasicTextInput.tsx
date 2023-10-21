import React from 'react';
import {TextInput, TextInputProps} from 'react-native-paper';
import { Text, View } from "react-native";

interface BasicTextInput extends TextInputProps {
  label: string;
  isValid?: boolean;
  errorMessage?: string;
}

const BasicTextInput = (props: BasicTextInput) => {
  return (
    <View style={{paddingBottom: 10}}>
      <TextInput
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
        onChangeText={props.onChangeText}
        secureTextEntry={props.secureTextEntry}
        outlineStyle = {{
          borderRadius: 10,
        }}
      />
      {!props.isValid && props.errorMessage && (
        <Text style={{color: 'red'}}>{props.errorMessage}</Text>
      )}
    </View>
  );
};

export default BasicTextInput;
