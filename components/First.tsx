
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';

import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

import { Outfit_500Medium } from '@expo-google-fonts/outfit';

import TBFamily from "../assets/firstBox1.png"
import ph from "../assets/ph.png"
import hp from "../assets/hp.png"

import ThemedBTNText from '../ThemedComponents/ThemedButtonText';
import { Link } from 'expo-router';

interface story {
  id: number,
  image: number,
  title: string,
  desc: string
}

const st: story[] = [{
  id: 1,
  image: TBFamily,
  title: "A Family Broken Every 15 Minutes",
  desc: "Every single day, nearly 100 Filipinos die from Tuberculosis. That is 100 families who lose a father, a mother, or a child to a silent killer."
},
{
  id: 2,
  image: ph,
  title: "Our #1 Invisible Enemy",
  desc: "Tuberculosis is the top infectious killer in the Philippines. It takes more lives than any other communicable disease, yet it often spreads unnoticed until it’s too late."
},
{
  id: 3,
  image: hp,
  title: "A Preventable Tragedy",
  desc: "The worst part? TB is curable. We built NuSuri to detect it early—so no family has to say goodbye too soon."
}];


const First = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = useState(0);

  const [loaded] = useFonts({
    Poppins_400Regular,
    Outfit_500Medium,
    Poppins_600SemiBold,
  });

  if (!loaded) return null;

  const handleScroll = (e: any) => {
    const newIndex = Math.round(
      e.nativeEvent.contentOffset.x / width
    );
    setIndex(newIndex);
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={st}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <ImageBackground
            style={[
              styles.container,
              {
                paddingTop: insets.top + 24,
                paddingBottom: insets.bottom + 24,
                paddingLeft: insets.left + 20,
                paddingRight: insets.right + 20,
                width,
              },
            ]}
            resizeMode="cover"
            source={item.image}
          >
            {/* Dark photo overlay */}
            <View style={styles.imageOverlay} />

            <View style={styles.pageContent}>
              <View style={styles.story}>
                <Text style={styles.title}>
                  {item.title}
                </Text>

                <Text style={styles.text}>
                  {item.desc}
                </Text>
              </View>

              <View style={styles.footer}>
                <View style={styles.dotsInside}>
                  {st.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        {
                          width: width * 0.02,
                          height: width * 0.02,
                          borderRadius: width * 0.01,
                        },
                        index === i && {
                          width: width * 0.05,
                          backgroundColor: '#FFFFFF',
                        },
                      ]}
                    />
                  ))}
                </View>

                {index === st.length - 1 && (
                  <TouchableOpacity
                    style={styles.button}
                    accessibilityRole="button"
                    accessibilityLabel="Done"
                  >
                    <Link
                      href="/about"
                      style={styles.buttonLink}
                    >
                      <ThemedBTNText style={styles.buttonText}>
                        Done
                      </ThemedBTNText>
                    </Link>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ImageBackground>
        )}
      />
    </View>
  );
};

export default First;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },

  container: {
    flex: 1,
  },

  // Dark transparent overlay for photo readability
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  pageContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  story: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },

  // White title with strong dark shadow
  title: {
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: '#FFFFFF',

    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 8,

    elevation: 5,
  },

  // Soft white description with readable shadow
  text: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    fontWeight: '500',
    color: '#F5F5F5',
    marginBottom: 4,
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 23,

    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,

    elevation: 5,
  },

  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    marginHorizontal: 5,
  },

  dotsInside: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },

  footer: {
    width: '100%',
    alignItems: 'center',
  },

  // NuSuri green button
  button: {
    width: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fdc10e',

    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  buttonLink: {
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 20,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
