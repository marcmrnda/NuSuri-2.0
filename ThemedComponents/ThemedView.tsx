import React from 'react';
import { View, useColorScheme, ViewProps } from 'react-native';
import { Colors } from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ThemedViewProps = ViewProps & {
  safe?: boolean;
};

const ThemedView: React.FC<ThemedViewProps> = ({ style, safe = false, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'] ?? Colors.dark;

  if (!safe) {
    return <View style={[{ backgroundColor: theme.background }, style]} {...props} />;
  }

  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedView;
