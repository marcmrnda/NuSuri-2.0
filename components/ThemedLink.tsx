import {useColorScheme,StyleProp,TextStyle } from 'react-native'
import { Colors } from '../constants/Colors'
import { Link, LinkProps } from 'expo-router'


type ThemedLinkProps = LinkProps & {
    style? : StyleProp<TextStyle>,
    secondButton: boolean
}


const ThemedLink: React.FC<ThemedLinkProps> = ({style,  secondButton=false, ...props}) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.dark

  return (
    <Link style={[{color: theme.navBackground, backgroundColor: secondButton ? theme.button2 : theme.button1},style]} {...props} />
  )
}

export default ThemedLink