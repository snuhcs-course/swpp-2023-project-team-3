import {Dimensions, Platform, StatusBar} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

const StatusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;
const bottomHeight =
  Platform.OS === 'ios' && isIphoneX() ? getBottomSpace() : 0;
export const safeAreaHeight =
  windowHeight - (StatusBarHeight ? StatusBarHeight : 0) - bottomHeight;

export const widthRatio = (width: number) => {
  return (width * windowWidth) / 393;
};
export const heightRatio = (height: number) => {
  return (height * windowHeight) / 852;
};
export const heightCorrection = (height: number) => {
  return (height * windowWidth) / 393;
};
