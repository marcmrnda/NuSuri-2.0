import React from "react";
import {
  Text,
  TextProps,
  StyleProp,
  TextStyle,
  useColorScheme,
} from "react-native";
import { Colors } from "../constants/Colors";

type ThemedBTNTextProps = TextProps & {
  style?: StyleProp<TextStyle>;
};

const ThemedBTNText: React.FC<ThemedBTNTextProps> = ({
  style,
  ...props
}) => {
 const colorScheme = useColorScheme(); // "light" | "dark" | null
const theme = colorScheme ? Colors[colorScheme] : Colors.dark;


  return (
    <Text
      style={[
        { color: theme.btnText},
        style,
      ]}
      {...props}
    >
    </Text>
  );
};

export default ThemedBTNText;
