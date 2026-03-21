import { Text, useColorScheme, TextProps, StyleProp, TextStyle } from 'react-native'
import { Colors } from '../constants/Colors'

type ThemedTextProps = TextProps & {
  style?: StyleProp<TextStyle>
  title: boolean
  secondary: boolean
}


const ThemedText: React.FC<ThemedTextProps> = ({style, title=false, secondary=false, ...props}) => {
    const colorScheme = useColorScheme()
    const theme = colorScheme ? Colors[colorScheme] : Colors.dark

    const textColor = title ? theme.title : theme.text
  return (
    <Text style={[{color: secondary ? theme.secondaryTitle : textColor},style]} {...props} />
  )
}

export default ThemedText