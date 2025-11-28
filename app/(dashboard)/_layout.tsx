import 'react-native-url-polyfill/auto'; 
import { Redirect, Tabs, useSegments } from 'expo-router'
import { Colors } from "../../constants/Colors"
import { useColorScheme } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'



const DashboardLayout = () => {
    const colorScheme = useColorScheme()
    const theme = colorScheme ? Colors[colorScheme] : Colors.dark
    const insets = useSafeAreaInsets()


    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.navBackground,
                    paddingBottom: insets.bottom,
                    height: 75 + insets.bottom
                    
                },
                tabBarActiveTintColor: theme.iconColorFocused,
                tabBarInactiveTintColor: theme.iconColor,
                tabBarIconStyle: {
                    marginVertical: 10
                }
            }}>

                 <Tabs.Screen name='about' options={{
                title: "About", tabBarIcon: ({ focused }) => (
                    <Ionicons
                        size={28}
                        name={focused ? "people-sharp" : "people-outline"}
                        color={focused ? "#FFC300" : theme.iconColor}
                    />
                ), tabBarLabel: ({ focused }) => {
                    return <Ionicons
                        size={6}
                        name={focused ? "ellipse-sharp" : "ellipse-outline"}
                        color={focused ? "#FFC300" : theme.iconColor}
                    />
                }
            }} />

            <Tabs.Screen name='home' options={{
                title: "Home",
                tabBarIcon: ({ focused }) => (
                    <Ionicons
                        size={28}
                        name={focused ? "home-sharp" : "home-outline"}
                        color={focused ? "#FFC300" : theme.iconColor}
                    />
                ),
                tabBarLabel: ({ focused }) => {
                    return <Ionicons
                        size={6}
                        name={focused ? "ellipse-sharp" : "ellipse-outline"}
                        color={focused ? "#FFC300" : theme.iconColor}
                    />
                }
            }} />

           

            <Tabs.Screen name='help' options={{
                title: "Help", tabBarIcon: ({ focused }) => (
                    <Ionicons
                        size={28}
                        name={focused ? "help-circle-sharp" : "help-circle-outline"}
                        color={focused ? "#FFC300" : theme.iconColor}
                    />
                ), tabBarLabel: ({ focused }) => {
                    return <Ionicons
                        size={6}
                        name={focused ? "ellipse-sharp" : "ellipse-outline"}
                        color={focused ? "#FFC300" : theme.iconColor}
                    />
                }
            }} />
            
        </Tabs>

            
        
    )

}

export default DashboardLayout