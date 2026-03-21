import React from "react";
import { View, ViewStyle } from "react-native";

type SpacerProps = {
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
};

const Spacer: React.FC<SpacerProps> = ({ width = "100%", height = 40 }) => {
  return <View style={{ width, height } as ViewStyle} />;
};

export default Spacer;
