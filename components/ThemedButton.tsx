import React from "react";
import {
  StyleSheet,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";

type ThemedButtonProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
};

const ThemedButton: React.FC<ThemedButtonProps> = ({ style, ...props }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
  btn: {
    padding: 10,
    borderRadius: 14,
    marginVertical: 10,
  },
});
