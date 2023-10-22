import React, {useState} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';

export default function useCheckBox(description : string) : [boolean, ()=>React.JSX.Element]{
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  return [
    isChecked
    ,()=><TouchableOpacity
      onPress={toggleCheck}
      style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={{fontSize: 16, color: 'black'}}>
        {isChecked ? '✓' : '▢'}
      </Text>
      <View>
        <Text style={{marginLeft: 8, color: 'black', fontSize: 14}}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  ];
};
