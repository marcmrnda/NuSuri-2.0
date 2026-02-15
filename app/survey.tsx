import { View, Text, StyleSheet, useColorScheme, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import ThemedView from '../components/ThemedView'
import { CheckBox, Dialog } from '@rneui/themed'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ThemedText from '../components/ThemedText';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_500Medium } from '@expo-google-fonts/poppins'
import { Outfit_500Medium, Outfit_600SemiBold} from '@expo-google-fonts/outfit'
import { useFonts } from 'expo-font'
import ThemedTextInput from '../components/ThemedTextInput';
import ThemedButton from '../components/ThemedButton';
import ThemedBTNText from '../components/ThemedButtonText';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';

// --- Type Definitions ---
// Define the structure for the survey data state
interface SurveyData {
    moreThan2WeeksCough: string;
    youCoughSputum: string;
    youHaveFever: string;
    lossWeightRecently: string;
    nightSweats: string;
    youFatigue: string;
    appetiteLoss: string;
    contactHistory: string;
    treatmentHistory: string;
    hivStatus: string;
    diabetesStatus: string;
}

interface SurveyDataNumeric {
  cough_duration: string,
  weightLossDuration: string
}

// Define the structure for the 'done' checkpoints state
interface DoneSteps {
    1: boolean;
    2: boolean;
    3: boolean;
}

// --- Survey Component ---

const Survey = () => {
    // State initialization
    const [steps,setSteps] = React.useState<number>(1)
    const [done,setDone] = React.useState<DoneSteps>({
      1: false,
      2: false,
      3: false
    })
    const [surveyData, setSurveyData] = React.useState<SurveyData>({
      moreThan2WeeksCough: "",
      youCoughSputum: "",
      youHaveFever:"",
      lossWeightRecently:"",
      nightSweats:"",
      youFatigue:"",
      appetiteLoss:"",
      contactHistory:"",
      treatmentHistory:"",
      hivStatus: "",
      diabetesStatus: ""
    });
    const [surveyDataNumeric, setSurveyDataNumeric] = React.useState<SurveyDataNumeric>({
      cough_duration: "",
      weightLossDuration: ""
    })
    const [isVisible, setIsVisible] = React.useState<boolean>(false)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    // Theme setup
    const colorScheme = useColorScheme()
    // Using a non-null assertion '!' on theme.checkpoints in the JSX since theme is guaranteed to be non-null.
    const theme = Colors[colorScheme ?? 'light'] ?? Colors.dark 

    // Font loading
      const [loaded] = useFonts({
          Poppins_400Regular, Outfit_500Medium, Poppins_600SemiBold, Poppins_500Medium, Outfit_600SemiBold
      })
    
      if (!loaded) return null

    // Handlers
    const handleChange = (field: keyof SurveyData, value: string) => {
        setSurveyData(prev => ({ ...prev, [field]: value }));
    }

    const handleNumericChange = (field: keyof SurveyDataNumeric, value: string) => {
        setSurveyDataNumeric(prev => ({ ...prev, [field]: value }));
    }

    const handleNext = () => {
        if (steps < 3) {
            setDone(prev => ({...prev, [steps as keyof DoneSteps]: true}));
            setSteps(prev => prev + 1);
        }
    }

    const handlePrevious = () => {
        if (steps > 1) {
            setDone(prev => ({...prev, [steps - 1 as keyof DoneSteps]: false}));
            setSteps(prev => prev - 1);
        }
    }

    const handleSubmit = () => {
        router.navigate('/recorder')
    }

    const toggleDialog1 = () => {
        setIsVisible(!isVisible);
    };

    if(isLoading) {
        return (
              <View style={styles.anotherContainer}>
                <ActivityIndicator size="large" color={theme.button2} />
              </View>
            );
    }


  return (
    <>
      <ThemedView safe={true} style={styles.container}>
        <View style={styles.checkpointView}>
          <MaterialCommunityIcons name="numeric-1-circle" size={30} color={done[1] ? "#FFC300" : theme.checkpoints!} />
          <View style={{height: 0, borderBottomColor: done[1] ? "#FFC300" : theme.checkpoints!, width: 100, borderBottomWidth: 1}} />
          <MaterialCommunityIcons name="numeric-2-circle" size={30} color={done[2] ? "#FFC300" : theme.checkpoints!} />
          <View style={{height: 0, borderBottomColor: done[2] ? "#FFC300" : theme.checkpoints!, width: 100, borderBottomWidth: 1}} />
          <MaterialCommunityIcons name="numeric-3-circle" size={30} color={done[3] ? "#FFC300" : theme.checkpoints!} />
        </View>

        {steps === 1 && (
          <>
            <View style={styles.questionarierView}>
              <ThemedText secondary={false} title={true} style={{fontSize: 20, marginVertical: 10, paddingHorizontal: 20, fontFamily:"Outfit_500Medium"}}>Do you have a cough that has lasted for more than 2 weeks?</ThemedText>

              <View style={styles.checkBoxView}>
                <CheckBox
                    checked={surveyData.moreThan2WeeksCough === "yes"}
                    onPress={() => handleChange('moreThan2WeeksCough', 'yes')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.moreThan2WeeksCough === "no"}
                    onPress={() => handleChange('moreThan2WeeksCough', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       No
                   </ThemedText>
               </View>

               <ThemedText secondary={false}  style={[styles.textInput,{marginTop:1}]} title={true}>Number of Weeks been coughing?</ThemedText>
               <ThemedTextInput style={styles.textInput1} keyboardType="numeric" onChangeText={(text: string) => handleNumericChange("cough_duration",text)} placeholder="Cough Duration"/>
            </View>

            <View style={[styles.questionarierView, {marginTop: 10}]}> 
              <ThemedText secondary={false} title={true} style={{fontSize: 20, marginVertical: 10, paddingHorizontal: 20, fontFamily:"Outfit_500Medium"}}>Are you coughing up sputum (phlegm)? If yes, is there blood in it?</ThemedText>

              <View style={[styles.checkBoxView, {flexWrap: 'wrap'}]}>
                <CheckBox
                    checked={surveyData.youCoughSputum === "No cough"}
                    onPress={() => handleChange('youCoughSputum', 'No cough')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       No cough
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.youCoughSputum === "Dry cough"}
                    onPress={() => handleChange('youCoughSputum', 'Dry cough')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                     containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Dry cough
                   </ThemedText>

                   <CheckBox
                    checked={surveyData.youCoughSputum === "Wet cough with sputum"}
                    onPress={() => handleChange('youCoughSputum', 'Wet cough with sputum')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", paddingRight: 50, color: "#FFC300"}}>
                       Wet cough with sputum
                   </ThemedText>

                   <CheckBox
                    checked={surveyData.youCoughSputum === "Wet cough with sputum with blood"}
                    onPress={() => handleChange('youCoughSputum', 'Wet cough with sputum with blood')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Wet cough with sputum with blood
                   </ThemedText>
               </View>
            </View>

            <View style={[styles.questionarierView, {marginTop: -20}]}> 
              <ThemedText secondary={false} title={true} style={{fontSize: 20, marginVertical: 10, paddingHorizontal: 20, fontFamily:"Outfit_500Medium",fontWeight: "600"}}>Have you had fever in the past month/s that lasts more than a few days?</ThemedText>

              <View style={styles.checkBoxView}>
                <CheckBox
                    checked={surveyData.youHaveFever === "yes"}
                    onPress={() => handleChange('youHaveFever', 'yes')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.youHaveFever === "no"}
                    onPress={() => handleChange('youHaveFever', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       No
                   </ThemedText>
               </View>
            </View>

            <ThemedButton style={{width: 344, height: 65.54, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "#0a1e3f"}} onPress={handleNext}>
              <ThemedBTNText style={{fontSize: 18, fontFamily: "Outfit_500Medium",color: "#FFFFFF"}}>
                Next
              </ThemedBTNText>
            </ThemedButton>
          </>
        )}

        {steps === 2 && (
            <>
            <View style={styles.questionarierView}>
              <ThemedText secondary={false}  title={true} style={{fontSize: 20, marginVertical: 10, paddingHorizontal: 20, fontFamily:"Outfit_500Medium"}}>Have you lost weight recently without trying?</ThemedText>

              <View style={styles.checkBoxView}>
                <CheckBox
                    checked={surveyData.lossWeightRecently === "yes"}
                    onPress={() => handleChange('lossWeightRecently', 'yes')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.lossWeightRecently === "no"}
                    onPress={() => handleChange('lossWeightRecently', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       No
                   </ThemedText>
               </View>

               {surveyData.lossWeightRecently === "yes" && (
                 <>
                   <ThemedText secondary={false} style={[styles.textInput,{marginTop:1}]} title={true}>How many kilograms lost?</ThemedText>
                   <ThemedTextInput style={styles.textInput1} keyboardType="numeric" onChangeText={(text: string) => handleNumericChange("weightLossDuration",text)} placeholder="Weight Loss Duration"/>
                 </>
               )}
            </View>

            <View style={[styles.questionarierView, {marginTop: 10}]}> 
              <ThemedText secondary={false} title={true} style={{fontSize: 20, marginVertical: 10, paddingHorizontal: 20, fontFamily:"Outfit_500Medium"}}>Do you experience night sweats (waking up with drenched sheets)?</ThemedText>

              <View style={[styles.checkBoxView, {flexWrap: 'wrap'}]}>
                                <CheckBox
                    checked={surveyData.nightSweats === "yes"}
                    onPress={() => handleChange('nightSweats', 'yes')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.nightSweats === "no"}
                    onPress={() => handleChange('nightSweats', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       No
                   </ThemedText>
               </View>
            </View>

            <View style={[styles.questionarierView, {marginTop: -20}]}> 
              <ThemedText secondary={false}  title={true} style={{fontSize: 20, marginVertical: 10, paddingHorizontal: 20, fontFamily:"Outfit_500Medium",fontWeight: "600"}}>Have you been unusually fatigued or weak lately?</ThemedText>

              <View style={styles.checkBoxView}>
                <CheckBox
                    checked={surveyData.youFatigue === "yes"}
                    onPress={() => handleChange('youFatigue', 'yes')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.youFatigue === "no"}
                    onPress={() => handleChange('youFatigue', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       No
                   </ThemedText>
               </View>
            </View>

              <View style={[styles.questionarierView, {marginTop: -20}]}> 
              <ThemedText secondary={false} title={true} style={{fontSize: 20, marginVertical: 15, paddingHorizontal: 20, fontFamily:"Outfit_500Medium",left: -6}}>Has your appetite decreased recently?</ThemedText>

              <View style={[styles.checkBoxView,{left: -6}]}>
                <CheckBox
                    checked={surveyData.appetiteLoss === "yes"}
                    onPress={() => handleChange('appetiteLoss', 'yes')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.appetiteLoss === "no"}
                    onPress={() => handleChange('appetiteLoss', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       No
                   </ThemedText>
               </View>
            </View>


            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 360, top: surveyData.lossWeightRecently === "yes"? -15 : 85}}>
                <ThemedButton style={{width: 170, height: 65.54, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "#0a1e3f"}} onPress={handlePrevious}>
              <ThemedBTNText  style={{fontSize: 18, fontFamily: "Outfit_500Medium",color: "#FFFFFF"}}>
                Previous
              </ThemedBTNText>
            </ThemedButton>

            <ThemedButton style={{width: 170, height: 65.54, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "#0a1e3f"}} onPress={handleNext}>
              <ThemedBTNText  style={{fontSize: 18, fontFamily: "Outfit_500Medium",color: "#FFFFFF"}}>
                Next
              </ThemedBTNText>
            </ThemedButton>
            </View>
            
            </> 
        )}

        {steps === 3 && (
            <>
            <View style={styles.questionarierView}>
              <ThemedText secondary={false} title={true} style={{fontSize: 20, marginVertical: 10, paddingHorizontal: 20, fontFamily:"Outfit_500Medium"}}>Have you been in close contact with someone known to have TB?</ThemedText>

              <View style={styles.checkBoxView}>
                <CheckBox
                    checked={surveyData.contactHistory === "yes"}
                    onPress={() => handleChange('contactHistory', 'yes')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.contactHistory === "no"}
                    onPress={() => handleChange('contactHistory', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       No
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.contactHistory === "not sure"}
                    onPress={() => handleChange('contactHistory', 'not sure')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Not Sure
                   </ThemedText>
               </View>

            </View>

            <View style={[styles.questionarierView, {marginTop: -5}]}> 
              <ThemedText secondary={false}  title={true} style={{fontSize: 20, marginVertical: 10, paddingHorizontal: 20, fontFamily:"Outfit_500Medium"}}>Have you had TB in the past, or are you currently on TB treatment?</ThemedText>

              <View style={[styles.checkBoxView, {flexWrap: 'wrap'}]}>
                                <CheckBox
                    checked={surveyData.treatmentHistory === "yes - currently in treatment"}
                    // NOTE: This onPress seems to have a typo in the original code, as it sets 'nightSweats' instead of 'treatmentHistory'. Correcting to 'treatmentHistory'.
                    onPress={() => handleChange('treatmentHistory', 'yes - currently in treatment')} 
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium",paddingRight: 30, color: "#FFC300"}}>
                       Yes - currently in treatment
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.treatmentHistory === "yes - had in the past"}
                    onPress={() => handleChange('treatmentHistory', 'yes - had in the past')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes - had in the past
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.treatmentHistory === "no"}
                    onPress={() => handleChange('treatmentHistory', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       No
                   </ThemedText>
               </View>
            </View>

            <View style={[styles.questionarierView, {marginTop: -20}]}> 
              <ThemedText secondary={false}  title={true} style={{fontSize: 20, marginVertical: 10, paddingHorizontal: 20, fontFamily:"Outfit_500Medium",fontWeight: "600"}}>Do you suffer from HIV?</ThemedText>

              <View style={[styles.checkBoxView,{flexWrap: 'wrap'}]}>
                <CheckBox
                    checked={surveyData.hivStatus === "yes"}
                    onPress={() => handleChange('hivStatus', 'yes')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.hivStatus === "no"}
                    onPress={() => handleChange('hivStatus', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", paddingRight: 100, color: "#FFC300"}}>
                       No
                   </ThemedText>
                    <CheckBox
                    checked={surveyData.hivStatus === "prefer not to say"}
                    onPress={() => handleChange('hivStatus', 'prefer not to say')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Prefer not to say
                   </ThemedText>
               </View>
            </View>

              <View style={[styles.questionarierView, {marginTop: -20, left:10}]}> 
              <ThemedText secondary={false}  title={true} style={{fontSize: 20, marginVertical: 15, paddingHorizontal: 20, fontFamily:"Outfit_500Medium",left: -6}}>Do you have diabetes?</ThemedText>

              <View style={[styles.checkBoxView,{flexWrap: 'wrap',marginTop:-2, left:-10}]}>
                <CheckBox
                    checked={surveyData.diabetesStatus === "yes"}
                    onPress={() => handleChange('diabetesStatus', 'yes')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Yes
                   </ThemedText>
                   <CheckBox
                    checked={surveyData.diabetesStatus === "no"}
                    onPress={() => handleChange('diabetesStatus', 'no')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                     containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", paddingRight: 100, color: "#FFC300"}}>
                       No
                   </ThemedText>
                    <CheckBox
                    checked={surveyData.diabetesStatus === "not sure"}
                    onPress={() => handleChange('diabetesStatus', 'not sure')}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}
                   />
                   <ThemedText secondary={false} title={false} style={{fontSize: 16,  marginRight: 20, fontWeight: '500', fontFamily: "Poppins_500Medium", color: "#FFC300"}}>
                       Not sure
                   </ThemedText>
               </View>
            </View>


            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 360, top:-25}}>
                <ThemedButton style={{width: 170, height: 65.54, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "#0a1e3f"}} onPress={handlePrevious}>
              <ThemedBTNText  style={{fontSize: 18, fontFamily: "Outfit_500Medium",color: "#FFFFFF"}}>
                Previous
              </ThemedBTNText>
            </ThemedButton>

            <ThemedButton style={{width: 170, height: 65.54, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: "#0a1e3f"}} onPress={handleSubmit}>
              <ThemedBTNText style={{fontSize: 18, fontFamily: "Outfit_500Medium",color: "#FFFFFF"}}>
                Submit
              </ThemedBTNText>
            </ThemedButton>
            </View>
            
            </>
        )}


        <Dialog
        isVisible={isVisible}
        onBackdropPress={toggleDialog1}
        >
        <Dialog.Title title="Required Input"/>
        <Text>Some field are not inputted! Please field all as it is required.</Text>
        </Dialog>


      </ThemedView>
    </>
  )
}

export default Survey

// --- Styles ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    checkBoxView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 10
    },
    checkpointView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        justifyContent: 'center',
        top: 20
    }, 
    questionarierView: {
        marginTop: 40,
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 5
    },
    textInput: {
        fontFamily: "Outfit_500Medium",
        fontSize: 16,
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10

    },
    textInput1: {
        marginHorizontal: 17,
        width: 350,
        height: 70,
        fontFamily: "Poppins_400Regular"
    },
    anotherContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Fully transparent black
    backgroundColor: 'rgba(0, 0, 0, 0)', 
}

})