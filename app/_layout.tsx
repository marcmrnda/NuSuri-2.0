import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Colors } from "../constants/Colors"
import {useColorScheme } from "react-native"

  const Layout: React.FC = () => {
  
    const colorScheme = useColorScheme()
    const theme = colorScheme ? Colors[colorScheme] : Colors.dark

  return (
    <>
      <StatusBar />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
        }}
      >
        {/* Screens inside the stack navigator */}
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
         <Stack.Screen
          name="recorder"
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerStyle: { backgroundColor: theme.recorderBG }
            // Note: If you want a back button with an icon, you might add a headerLeft component here
          }}
        />
        <Stack.Screen name="results" options={{ headerShown: false }} />
        <Stack.Screen name="firstBox" options={{ headerShown: false }} />
        <Stack.Screen name="secondBox" options={{ headerShown: false }} />
        <Stack.Screen name="thirdBox" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default Layout;