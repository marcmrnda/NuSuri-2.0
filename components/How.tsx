 import React, { useMemo } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {router} from "expo-router"

type Step = {
  title: string;
  points: string[];
};

type HowToUseProps = {
  /** Called when the back button is pressed, e.g. () => navigation.goBack() or () => router.back() */
  onBackPress?: () => void;
};

const STEPS: Step[] = [
  {
    title: 'Start the application',
    points: ['Open NuSuri.', 'Tap Kickstart Triage to begin.'],
  },
  {
    title: 'Record your cough',
    points: [
      'Follow the on-screen instructions.',
      'Allow microphone access if requested.',
      'Record your cough when prompted.',
      'Make sure your cough is clearly captured.',
    ],
  },
  {
    title: 'Complete the symptom checker',
    points: [
      'Answer the questions about your current symptoms.',
      'Provide accurate answers to help improve the screening assessment.',
    ],
  },
  {
    title: 'Wait for the analysis',
    points: [
      'NuSuri processes your cough recording using its AI-powered cough analysis.',
      'Your cough analysis is combined with your symptom assessment.',
    ],
  },
  {
    title: 'View your screening result',
    points: [
      'Review your screening result.',
      'Follow the recommended next steps.',
      'Consult a healthcare professional for proper testing and diagnosis when necessary.',
    ],
  },
];

const COLORS = {
  white: '#FFFFFF',
  navy: '#012F59',
  yellow: '#FDC10E',
  navyText: 'rgba(1, 47, 89, 0.82)',
  navyBorder: 'rgba(1, 47, 89, 0.14)',
  yellowSoft: 'rgba(253, 193, 14, 0.55)',
};

// Design baseline is a 375pt wide phone. Scaling is capped so tablets don't get giant text.
const BASE_WIDTH = 375;

const onBackPress = () => {
    router.push("/help")
}

export default function HowToUse() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => {
    const s = (size: number) =>
      Math.round(size * Math.min(Math.max(width / BASE_WIDTH, 0.85), 1.3));
    const contentWidth = Math.min(width, 640);
    const circle = s(36);
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
      stepRow: { flexDirection: 'row' },
      rail: { width: circle, alignItems: 'center' },
      circle: {
        width: circle,
        height: circle,
        borderRadius: circle / 2,
        backgroundColor: COLORS.yellow,
        alignItems: 'center',
        justifyContent: 'center',
      },
      circleText: {
        color: COLORS.navy,
        fontSize: s(16),
        fontWeight: '800',
      },
      line: {
        flex: 1,
        width: 2,
        backgroundColor: COLORS.yellowSoft,
        marginVertical: s(4),
      },
      card: {
        flex: 1,
        marginLeft: s(12),
        marginBottom: s(16),
        padding: s(16),
        backgroundColor: COLORS.white,
        borderRadius: s(14),
        borderWidth: 1,
        borderColor: COLORS.navyBorder,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.navy,
        shadowColor: COLORS.navy,
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      },
      stepTitle: {
        fontSize: s(17),
        fontWeight: '700',
        color: COLORS.navy,
        marginBottom: s(8),
      },
      pointRow: { flexDirection: 'row', marginTop: s(6) },
      bullet: {
        width: s(7),
        height: s(7),
        borderRadius: s(3.5),
        backgroundColor: COLORS.yellow,
        marginTop: s(8),
        marginRight: s(10),
      },
      pointText: {
        flex: 1,
        fontSize: s(14),
        lineHeight: s(21),
        color: COLORS.navyText,
      },
      notice: {
        marginTop: s(4),
        padding: s(14),
        borderRadius: s(12),
        backgroundColor: COLORS.navy,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.yellow,
      },
      noticeText: {
        fontSize: s(12.5),
        lineHeight: s(18),
        color: COLORS.white,
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
            How to Use NuSuri
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
            Five simple steps to get your TB screening result.
          </Text>

          {STEPS.map((step, index) => {
            const isLast = index === STEPS.length - 1;
            return (
              <View key={step.title} style={styles.stepRow}>
                <View style={styles.rail}>
                  <View style={styles.circle}>
                    <Text style={styles.circleText}>{index + 1}</Text>
                  </View>
                  {!isLast && <View style={styles.line} />}
                </View>

                <View style={styles.card}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  {step.points.map((point) => (
                    <View key={point} style={styles.pointRow}>
                      <View style={styles.bullet} />
                      <Text style={styles.pointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              NuSuri is a screening and decision-support tool, not a medical
              diagnosis. Always consult a qualified healthcare professional.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}