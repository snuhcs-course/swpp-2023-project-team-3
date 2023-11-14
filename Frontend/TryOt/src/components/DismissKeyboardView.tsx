import React from 'react';
import {
  Keyboard,
  StyleProp,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const DismissKeyboardView: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  enableAutomaticScroll?: boolean;
  bounces?: boolean;
}> = ({children, ...props}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView
      {...props}
      style={props.style}
      contentContainerStyle={[{flexGrow: 1}, props.contentStyle]}>
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
