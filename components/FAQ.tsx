import React, { useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Android needs this flag for LayoutAnimation (ignored where unsupported).
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  try {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  } catch {
    // no-op
  }
}
import { router } from 'expo-router';

type FaqItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  /** Called when the back button is pressed, e.g. () => navigation.goBack() or () => router.back() */
  onBackPress?: () => void;
};


const FAQS: FaqItem[] = [
  {
    question: 'What is NuSuri?',
    answer:
      'NuSuri is an AI-powered tuberculosis screening solution designed to help identify potential TB risks through cough sound analysis and symptom assessment.',
  },
  {
    question: 'Who is NuSuri for?',
    answer:
      'NuSuri is designed for community health centers, clinics, healthcare workers, and individuals who need accessible preliminary TB screening support.',
  },
  {
    question: 'How does NuSuri work?',
    answer:
      'NuSuri records cough audio and processes it into a Mel spectrogram. A CNN-based AI model analyzes the spectrogram to identify potential cough patterns associated with tuberculosis. The result is combined with symptom assessment to provide a screening result.',
  },
  {
    question: 'Is NuSuri a replacement for medical diagnosis?',
    answer:
      'No. NuSuri is a screening and decision-support tool. It does not provide a definitive medical diagnosis. Always consult a qualified healthcare professional for proper testing and diagnosis.',
  },
  {
    question: 'Why is early TB screening important?',
    answer:
      'Early screening helps identify individuals who may need further testing and medical attention. It also supports timely intervention and helps reduce the potential spread of tuberculosis.',
  },
  {
    question: 'Does NuSuri require internet access?',
    answer:
      'NuSuri is designed to perform its screening process offline, allowing users to access its screening features without requiring an active internet connection.',
  },
  {
    question: 'Does NuSuri store my cough recordings?',
    answer:
      'NuSuri is designed with privacy in mind and aims to avoid storing patient cough recordings. Your cough audio is processed for screening purposes.',
  },
  {
    question: 'How long does screening take?',
    answer:
      'The screening process is designed to provide results quickly, typically within approximately one minute.',
  },
  {
    question: 'What happens if my cough recording is unclear?',
    answer:
      'If your cough recording is unclear or insufficient, follow the on-screen instructions and try recording your cough again to help ensure better audio quality.',
  },
  {
    question: 'Can NuSuri detect all cases of TB?',
    answer:
      'No. NuSuri cannot guarantee the detection of all tuberculosis cases. A low-risk result does not completely rule out TB. Further medical evaluation and confirmatory testing may still be necessary.',
  },
  {
    question: 'What should I do if I receive a high-risk result?',
    answer:
      'If you receive a high-risk result, visit a healthcare facility or consult a qualified healthcare professional for further evaluation and confirmatory TB testing.',
  },
  {
    question: 'Does a low-risk result mean I do not have TB?',
    answer:
      'No. A low-risk result does not guarantee that you are free from tuberculosis. If you experience persistent symptoms or have concerns about TB, seek medical advice and appropriate testing.',
  },
];

const COLORS = {
  white: '#FFFFFF',
  navy: '#012F59',
  yellow: '#FDC10E',
  navyText: 'rgba(1, 47, 89, 0.82)',
  navyBorder: 'rgba(1, 47, 89, 0.14)',
};

const BASE_WIDTH = 375;

const onBackPress = () => {
    router.push("/help")
}

export default function FAQ() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex((current) => (current === index ? null : index));
  };

  const styles = useMemo(() => {
    const s = (size: number) =>
      Math.round(size * Math.min(Math.max(width / BASE_WIDTH, 0.85), 1.3));
    const contentWidth = Math.min(width, 640);
    const backSize = Math.max(s(40), 44);

    return StyleSheet.create({
      root: { flex: 1, backgroundColor: COLORS.white },
      headerSafe: { backgroundColor: COLORS.navy },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: s(12),
        paddingVertical: s(10),
      },
      backButton: {
        width: backSize,
        height: backSize,
        borderRadius: backSize / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
      },
      chevron: {
        width: s(12),
        height: s(12),
        borderLeftWidth: 3,
        borderBottomWidth: 3,
        borderColor: COLORS.yellow,
        transform: [{ rotate: '45deg' }],
        marginLeft: s(4),
      },
      headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: s(18),
        fontWeight: '800',
        color: COLORS.white,
      },
      headerSpacer: { width: backSize },
      accentBar: { height: 3, backgroundColor: COLORS.yellow },
      scroll: {
        alignItems: 'center',
        paddingTop: s(20),
        paddingHorizontal: s(16),
        paddingBottom: s(24) + insets.bottom,
      },
      container: { width: '100%', maxWidth: contentWidth },
      subheading: {
        marginBottom: s(20),
        fontSize: s(14),
        lineHeight: s(21),
        color: COLORS.navyText,
      },
      item: {
        backgroundColor: COLORS.white,
        borderRadius: s(14),
        borderWidth: 1.5,
        borderColor: COLORS.navyBorder,
        marginBottom: s(12),
        overflow: 'hidden',
      },
      itemOpen: { borderColor: COLORS.yellow },
      headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: s(16),
        paddingHorizontal: s(16),
        minHeight: 48,
      },
      question: {
        flex: 1,
        fontSize: s(15.5),
        lineHeight: s(22),
        fontWeight: '700',
        color: COLORS.navy,
        paddingRight: s(12),
      },
      iconWrap: {
        width: s(28),
        height: s(28),
        borderRadius: s(14),
        backgroundColor: COLORS.navy,
        alignItems: 'center',
        justifyContent: 'center',
      },
      iconWrapOpen: { backgroundColor: COLORS.yellow },
      icon: {
        fontSize: s(18),
        lineHeight: s(20),
        fontWeight: '700',
        color: COLORS.white,
      },
      iconOpen: { color: COLORS.navy },
      answerWrap: {
        paddingHorizontal: s(16),
        paddingBottom: s(16),
      },
      divider: {
        height: 1,
        backgroundColor: COLORS.navyBorder,
        marginBottom: s(12),
      },
      answer: {
        fontSize: s(14),
        lineHeight: s(22),
        color: COLORS.navyText,
      },
    });
  }, [width, insets.bottom]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBackPress}
            activeOpacity={0.7}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <View style={styles.chevron} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Frequently Asked Questions
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.accentBar} />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.subheading}>
            Quick answers about NuSuri and TB screening.
          </Text>

          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <View
                key={item.question}
                style={[styles.item, isOpen && styles.itemOpen]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggle(index)}
                  style={styles.headerRow}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isOpen }}
                  accessibilityLabel={item.question}
                >
                  <Text style={styles.question}>{item.question}</Text>
                  <View style={[styles.iconWrap, isOpen && styles.iconWrapOpen]}>
                    <Text style={[styles.icon, isOpen && styles.iconOpen]}>
                      {isOpen ? '–' : '+'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.answerWrap}>
                    <View style={styles.divider} />
                    <Text style={styles.answer}>{item.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}