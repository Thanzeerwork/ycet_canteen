import React, { useState } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';

const ToggleButton = ({
  size = 50, // Default width of the toggle button
  onColor = '#4caf50',
  offColor = '#f44336',
  onToggle,
}) => {
  const [isOn, setIsOn] = useState(false);
  const animatedValue = useState(new Animated.Value(0))[0];

  const toggle = () => {
    setIsOn(!isOn);
    Animated.timing(animatedValue, {
      toValue: isOn ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (onToggle) {
      onToggle(!isOn); // Callback to parent component
    }
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [offColor, onColor],
  });

  const circlePosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, size - (size / 2 + 2)], // Adjust based on size
  });

  const height = size / 2; // Height is half of the width
  const circleSize = height - 4; // Circle size is slightly smaller than height

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={toggle}>
      <Animated.View
        style={[
          styles.toggleBackground,
          {
            width: size,
            height,
            borderRadius: height / 2,
            backgroundColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              transform: [{ translateX: circlePosition }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleBackground: {
    justifyContent: 'center',
    padding: 2,
  },
  circle: {
    backgroundColor: '#fff',
  },
});

export default ToggleButton;
