import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Display } from '../utils';

const Separator = ({ height = 0, color = '#ccc', margin = 0 }) => {
  return (
    <View
      style={[
        styles.separator,
        { height:Display.setheight(height), backgroundColor: color, marginVertical: margin,width:Display.setwidth(100) },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    width: '100%',
  },
});

export default Separator;
