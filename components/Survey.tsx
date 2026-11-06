import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  ScrollView,
  Pressable,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React from 'react'
import ThemedView from '../ThemedComponents/ThemedView'
import { CheckBox, Dialog } from '@rneui/themed'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import ThemedText from '../ThemedComponents/ThemedText'
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_500Medium } from '@expo-google-fonts/poppins'
import { Outfit_500Medium, Outfit_600SemiBold } from '@expo-google-fonts/outfit'
import { useFonts } from 'expo-font'
import ThemedTextInput from '../ThemedComponents/ThemedTextInput'
import ThemedButton from '../ThemedComponents/ThemedButton'
import ThemedBTNText from '../ThemedComponents/ThemedButtonText'
import { Colors } from '../constants/Colors'
import { router } from 'expo-router'

// --- Type Definitions ---
interface SurveyData {
  moreThan2WeeksCough: string
  youCoughSputum: string
  youHaveFever: string
  lossWeightRecently: string
  nightSweats: string
  youFatigue: string
  appetiteLoss: string
  contactHistory: string
  treatmentHistory: string
  hivStatus: string
  diabetesStatus: string
}

interface SurveyDataNumeric {
  cough_duration: string
  weightLossDuration: string
}

interface DoneSteps {
  1: boolean
  2: boolean
  3: boolean
}

interface Option {
  label: string
  value: string
}

type Scale = (size: number) => number

// --- Responsive helpers ---
const BASE_WIDTH = 375 // design reference (iPhone 11 / most Android phones)
const MAX_CONTENT_WIDTH = 600 // keeps the form readable on large phones / tablets

// --- Option sets ---
const YES_NO: Option[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

const SPUTUM_OPTIONS: Option[] = [
  { label: 'No cough', value: 'No cough' },
  { label: 'Dry cough', value: 'Dry cough' },
  { label: 'Wet cough with sputum', value: 'Wet cough with sputum' },
  { label: 'Wet cough with sputum with blood', value: 'Wet cough with sputum with blood' },
]

const CONTACT_OPTIONS: Option[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Not Sure', value: 'not sure' },
]

const TREATMENT_OPTIONS: Option[] = [
  { label: 'Yes - currently in treatment', value: 'yes - currently in treatment' },
  { label: 'Yes - had in the past', value: 'yes - had in the past' },
  { label: 'No', value: 'no' },
]

const HIV_OPTIONS: Option[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Prefer not to say', value: 'prefer not to say' },
]

const DIABETES_OPTIONS: Option[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Not sure', value: 'not sure' },
]

// --- Reusable pieces ---
const QuestionCard = ({
  question,
  rs,
  styles,
  children,
}: {
  question: string
  rs: Scale
  styles: ReturnType<typeof createStyles>
  children: React.ReactNode
}) => (
  <View style={styles.questionarierView}>
    <ThemedText secondary={false} title={true} style={styles.questionText}>
      {question}
    </ThemedText>
    {children}
  </View>
)

const RadioGroup = ({
  options,
  selected,
  onSelect,
  rs,
  styles,
}: {
  options: Option[]
  selected: string
  onSelect: (value: string) => void
  rs: Scale
  styles: ReturnType<typeof createStyles>
}) => (
  <View style={styles.checkBoxView}>
    {options.map(opt => (
      <Pressable
        key={opt.value}
        style={styles.optionRow}
        onPress={() => onSelect(opt.value)}
        hitSlop={4}
        accessibilityRole="radio"
        accessibilityState={{ selected: selected === opt.value }}
      >
        <CheckBox
          checked={selected === opt.value}
          onPress={() => onSelect(opt.value)}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          size={rs(22)}
          containerStyle={styles.checkBoxContainer}
        />
        <ThemedText secondary={false} title={false} style={styles.optionLabel}>
          {opt.label}
        </ThemedText>
      </Pressable>
    ))}
  </View>
)

// --- Survey Component ---
const Survey = () => {
  const [steps, setSteps] = React.useState<number>(1)
  const [done, setDone] = React.useState<DoneSteps>({ 1: false, 2: false, 3: false })
  const [surveyData, setSurveyData] = React.useState<SurveyData>({
    moreThan2WeeksCough: '',
    youCoughSputum: '',
    youHaveFever: '',
    lossWeightRecently: '',
    nightSweats: '',
    youFatigue: '',
    appetiteLoss: '',
    contactHistory: '',
    treatmentHistory: '',
    hivStatus: '',
    diabetesStatus: '',
  })
  const [surveyDataNumeric, setSurveyDataNumeric] = React.useState<SurveyDataNumeric>({
    cough_duration: '',
    weightLossDuration: '',
  })
  const [isVisible, setIsVisible] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  // Theme setup
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? 'light'] ?? Colors.dark

  // Responsive sizing (recomputed on rotation / split-screen / font-size changes)
  const { width } = useWindowDimensions()
  const rs = React.useCallback<Scale>(
    size => {
      const factor = Math.min(Math.max(width / BASE_WIDTH, 0.85), 1.25)
      return Math.round(size * factor)
    },
    [width]
  )
  const styles = React.useMemo(() => createStyles(rs), [rs])

  // Font loading
  const [loaded] = useFonts({
    Poppins_400Regular,
    Outfit_500Medium,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Outfit_600SemiBold,
  })

  if (!loaded) return null

  // Handlers
  const handleChange = (field: keyof SurveyData, value: string) => {
    setSurveyData(prev => ({ ...prev, [field]: value }))
  }

  const handleNumericChange = (field: keyof SurveyDataNumeric, value: string) => {
    setSurveyDataNumeric(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (steps < 3) {
      setDone(prev => ({ ...prev, [steps as keyof DoneSteps]: true }))
      setSteps(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (steps > 1) {
      setDone(prev => ({ ...prev, [(steps - 1) as keyof DoneSteps]: false }))
      setSteps(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    router.navigate('/recorder')
  }

  const toggleDialog1 = () => {
    setIsVisible(!isVisible)
  }

  if (isLoading) {
    return (
      <View style={styles.anotherContainer}>
        <ActivityIndicator size="large" color={theme.button2} />
      </View>
    )
  }

  const activeColor = '#FFC300'

  // Small shorthand so each question stays one readable block
  const group = (field: keyof SurveyData, options: Option[]) => (
    <RadioGroup
      options={options}
      selected={surveyData[field]}
      onSelect={value => handleChange(field, value)}
      rs={rs}
      styles={styles}
    />
  )

  return (
    <ThemedView safe style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Progress checkpoints */}
            <View style={styles.checkpointView}>
              <MaterialCommunityIcons
                name="numeric-1-circle"
                size={rs(30)}
                color={done[1] ? activeColor : theme.checkpoints!}
              />
              <View
                style={[styles.checkpointLine, { borderBottomColor: done[1] ? activeColor : theme.checkpoints! }]}
              />
              <MaterialCommunityIcons
                name="numeric-2-circle"
                size={rs(30)}
                color={done[2] ? activeColor : theme.checkpoints!}
              />
              <View
                style={[styles.checkpointLine, { borderBottomColor: done[2] ? activeColor : theme.checkpoints! }]}
              />
              <MaterialCommunityIcons
                name="numeric-3-circle"
                size={rs(30)}
                color={done[3] ? activeColor : theme.checkpoints!}
              />
            </View>

            {/* STEP 1 */}
            {steps === 1 && (
              <>
                <QuestionCard
                  question="Do you have a cough that has lasted for more than 2 weeks?"
                  rs={rs}
                  styles={styles}
                >
                  {group('moreThan2WeeksCough', YES_NO)}

                  <ThemedText secondary={false} style={styles.inputLabel} title={true}>
                    Number of Weeks been coughing?
                  </ThemedText>
                  <ThemedTextInput
                    style={styles.textInput1}
                    keyboardType="numeric"
                    value={surveyDataNumeric.cough_duration}
                    onChangeText={(text: string) => handleNumericChange('cough_duration', text)}
                    placeholder="Cough Duration"
                  />
                </QuestionCard>

                <QuestionCard
                  question="Are you coughing up sputum (phlegm)? If yes, is there blood in it?"
                  rs={rs}
                  styles={styles}
                >
                  {group('youCoughSputum', SPUTUM_OPTIONS)}
                </QuestionCard>

                <QuestionCard
                  question="Have you had fever in the past month/s that lasts more than a few days?"
                  rs={rs}
                  styles={styles}
                >
                  {group('youHaveFever', YES_NO)}
                </QuestionCard>

                <ThemedButton style={styles.actionButton} onPress={handleNext}>
                  <ThemedBTNText style={styles.buttonText}>Next</ThemedBTNText>
                </ThemedButton>
              </>
            )}

            {/* STEP 2 */}
            {steps === 2 && (
              <>
                <QuestionCard question="Have you lost weight recently without trying?" rs={rs} styles={styles}>
                  {group('lossWeightRecently', YES_NO)}

                  {surveyData.lossWeightRecently === 'yes' && (
                    <>
                      <ThemedText secondary={false} style={styles.inputLabel} title={true}>
                        How many kilograms lost?
                      </ThemedText>
                      <ThemedTextInput
                        style={styles.textInput1}
                        keyboardType="numeric"
                        value={surveyDataNumeric.weightLossDuration}
                        onChangeText={(text: string) => handleNumericChange('weightLossDuration', text)}
                        placeholder="Weight Loss Duration"
                      />
                    </>
                  )}
                </QuestionCard>

                <QuestionCard
                  question="Do you experience night sweats (waking up with drenched sheets)?"
                  rs={rs}
                  styles={styles}
                >
                  {group('nightSweats', YES_NO)}
                </QuestionCard>

                <QuestionCard question="Have you been unusually fatigued or weak lately?" rs={rs} styles={styles}>
                  {group('youFatigue', YES_NO)}
                </QuestionCard>

                <QuestionCard question="Has your appetite decreased recently?" rs={rs} styles={styles}>
                  {group('appetiteLoss', YES_NO)}
                </QuestionCard>

                <View style={styles.navigationButtons}>
                  <ThemedButton style={styles.navigationButton} onPress={handlePrevious}>
                    <ThemedBTNText style={styles.buttonText}>Previous</ThemedBTNText>
                  </ThemedButton>

                  <ThemedButton style={styles.navigationButton} onPress={handleNext}>
                    <ThemedBTNText style={styles.buttonText}>Next</ThemedBTNText>
                  </ThemedButton>
                </View>
              </>
            )}

            {/* STEP 3 */}
            {steps === 3 && (
              <>
                <QuestionCard
                  question="Have you been in close contact with someone known to have TB?"
                  rs={rs}
                  styles={styles}
                >
                  {group('contactHistory', CONTACT_OPTIONS)}
                </QuestionCard>

                <QuestionCard
                  question="Have you had TB in the past, or are you currently on TB treatment?"
                  rs={rs}
                  styles={styles}
                >
                  {group('treatmentHistory', TREATMENT_OPTIONS)}
                </QuestionCard>

                <QuestionCard question="Do you suffer from HIV?" rs={rs} styles={styles}>
                  {group('hivStatus', HIV_OPTIONS)}
                </QuestionCard>

                <QuestionCard question="Do you have diabetes?" rs={rs} styles={styles}>
                  {group('diabetesStatus', DIABETES_OPTIONS)}
                </QuestionCard>

                <View style={styles.navigationButtons}>
                  <ThemedButton style={styles.navigationButton} onPress={handlePrevious}>
                    <ThemedBTNText style={styles.buttonText}>Previous</ThemedBTNText>
                  </ThemedButton>

                  <ThemedButton style={styles.navigationButton} onPress={handleSubmit}>
                    <ThemedBTNText style={styles.buttonText}>Submit</ThemedBTNText>
                  </ThemedButton>
                </View>
              </>
            )}

            <Dialog isVisible={isVisible} onBackdropPress={toggleDialog1}>
              <Dialog.Title title="Required Input" />
              <Text>Some field are not inputted! Please field all as it is required.</Text>
            </Dialog>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

export default Survey

// --- Styles (built from the responsive scale so they adapt to every screen width) ---
const createStyles = (rs: Scale) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      alignItems: 'center', // centers the capped-width content on large screens
      paddingHorizontal: rs(16),
      paddingVertical: rs(16),
      paddingBottom: rs(40),
    },
    content: {
      width: '100%',
      maxWidth: MAX_CONTENT_WIDTH,
    },
    checkpointView: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rs(8),
      justifyContent: 'center',
      width: '100%',
      marginBottom: rs(16),
    },
    checkpointLine: {
      flex: 1,
      borderBottomWidth: 1,
    },
    questionarierView: {
      width: '100%',
      marginTop: rs(20),
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    questionText: {
      fontSize: rs(18),
      lineHeight: rs(26),
      marginVertical: rs(8),
      paddingHorizontal: rs(8),
      fontFamily: 'Outfit_500Medium',
    },
    // Options wrap onto new lines instead of overflowing on narrow phones
    checkBoxView: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      columnGap: rs(8),
      rowGap: rs(2),
      marginTop: rs(6),
      marginBottom: rs(8),
      width: '100%',
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      maxWidth: '100%',
      paddingRight: rs(8),
    },
    checkBoxContainer: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      marginLeft: 0,
      marginRight: rs(2),
      paddingHorizontal: rs(6),
      paddingVertical: rs(6),
    },
    optionLabel: {
      flexShrink: 1, // long labels wrap inside the screen instead of being cut off
      fontSize: rs(15),
      lineHeight: rs(22),
      fontWeight: '500',
      fontFamily: 'Poppins_500Medium',
      color: '#FFC300',
    },
    inputLabel: {
      fontFamily: 'Outfit_500Medium',
      fontSize: rs(16),
      paddingHorizontal: rs(8),
      marginTop: rs(6),
      marginBottom: rs(8),
    },
    textInput1: {
      width: '100%',
      fontFamily: 'Poppins_400Regular',
      fontSize: rs(15),
      paddingHorizontal: rs(16),
      paddingVertical: rs(12),
    },
    actionButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: rs(20),
      minHeight: rs(48),
      backgroundColor: '#0a1e3f',
    },
    navigationButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: rs(20),
      minHeight: rs(48),
      backgroundColor: '#0a1e3f',
    },
    navigationButtons: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: rs(12),
      marginTop: rs(16),
    },
    buttonText: {
      fontSize: rs(17),
      fontFamily: 'Outfit_500Medium',
      color: '#FFFFFF',
    },
    anotherContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
  })