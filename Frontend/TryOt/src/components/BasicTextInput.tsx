import React, { useState } from 'react';
import {TextInput, TextInputProps} from 'react-native-paper';
import {Alert, Text, View} from 'react-native';
import DropDownPicker, { DropDownPickerProps, ItemType } from 'react-native-dropdown-picker';
import { DropDownPropsInterface } from 'react-native-paper-dropdown';

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
        outlineStyle={{
          borderRadius: 10,
        }}
      />
      {!props.isValid && props.errorMessage && (
        <Text style={{color: 'red'}}>{props.errorMessage}</Text>
      )}
    </View>
  );
};

interface BasicOptionInput{
  items : {label : string, value : string}[];
  isValid?: boolean;
  errorMessage?: string;
  onSelectItem? : (item : ItemType<string>)=>void
}

export const BasicOptionInput = (props : BasicOptionInput) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(props.items);

  return (
    <View style={{paddingBottom: 10}}>
      <DropDownPicker
        placeholder='Gender'
        onSelectItem={props.onSelectItem}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={{
          marginTop : 5,
          backgroundColor: 'transparent',
          height: 50,
          paddingLeft : 15
        }}
        textStyle={{
          fontSize : 16
        }}
      />
      {!props.isValid && props.errorMessage && (
        <Text style={{color: 'red'}}>{props.errorMessage}</Text>
      )}
    </View>
    
  );
}

export default BasicTextInput;
