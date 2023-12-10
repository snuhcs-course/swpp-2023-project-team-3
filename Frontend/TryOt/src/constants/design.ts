import {Dimensions} from 'react-native';

export const {vw, vh} = {
  vw: Dimensions.get('window').width / 100,
  vh: Dimensions.get('window').height / 100,
};

export const fontSize = {
  small: 14,
  middle: 16,
  large: 20,
};

export const color = {
  button: {
    active: '#000000',
    inActive: '#D3D3D5',
  },
  background: '#ffffff',
  border: 'black',
  text: {
    title: '#000000',
    active: '#000000',
    inactive: '#D3D3D5',
  },
  backgroundGray: '#F4F4F4',
  pointPurple: '#654EA1',
};
