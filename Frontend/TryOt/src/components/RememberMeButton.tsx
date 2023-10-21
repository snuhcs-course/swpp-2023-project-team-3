import React, {useState} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';

const RememberMeButton = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  return (
    <TouchableOpacity
      onPress={toggleCheck}
      style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={{fontSize: 16, color: 'black'}}>
        {isChecked ? '✓' : '▢'}
      </Text>
      <View>
        <Text style={{marginLeft: 8, color: 'black', fontSize: 14}}>
          Remember Me
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RememberMeButton;
