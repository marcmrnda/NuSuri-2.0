import { TextInput, useColorScheme, TextInputProps, StyleProp, TextStyle } from 'react-native'
import { Colors } from '../constants/Colors'


type ThemedTextInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>

}


const ThemedTextInput: React.FC<ThemedTextInputProps> = ({style, ...props}) => {
    const colorScheme = useColorScheme()
    const theme = colorScheme ? Colors[colorScheme] : Colors.dark

  return (
    <TextInput style={[{color: theme.text, backgroundColor: "transparent", padding: 20, borderRadius:10, borderWidth: 2, borderColor: theme.uiBackground},style]} placeholderTextColor={theme.uiBackground}  {...props} />
  )
}

export default ThemedTextInput