import { Image, useColorScheme,
  ImageProps, StyleProp, TextStyle
 } from 'react-native'
import LightLogo from '../assets/logo.png'
import DarkLogo from '../assets/logo.png'

type ThemedImageProps = ImageProps & {
    style?:StyleProp<TextStyle>;
}

const ThemedImage: React.FC<ThemedImageProps> = ({style, ...props}) => {
    const colorScheme = useColorScheme()
    
    const imageSource = colorScheme == "dark" ? DarkLogo : LightLogo

  return (
    <Image source={imageSource} style={style} {...props}/>
  )
}

export default ThemedImage