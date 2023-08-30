import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import VitalSign from './types/VitalSign';
import { Prompt_400Regular, useFonts, Prompt_600SemiBold, Prompt_500Medium_Italic } from '@expo-google-fonts/prompt';
import { Entypo } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);

  let [fontsLoaded] = useFonts({
    Prompt_400Regular,
    Prompt_600SemiBold,
    Prompt_500Medium_Italic
  });

  useEffect(() => {
    async function prepare() {
      try {
        const response = await fetch('https://climate.nasa.gov/api/v1/vital_signs')

        const { items } = await response.json()

        setVitalSigns(items.filter((item: VitalSign) => item.display_in_dashboard))
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady) {
    return null
  }

  return (
    <SafeAreaView
      style={styles.container}
      onLayout={onLayoutRootView}
    >
      <Video
        source={require('./assets/earth.mp4')}
        resizeMode={ResizeMode.COVER}
        isLooping
        style={styles.video}
        shouldPlay
      />

      <ScrollView
        contentContainerStyle={styles.vitalSigns}
      >
        {
          vitalSigns.map((vitalSign) => (
            <View style={styles.itemVitalSign}>
              <Text
                style={styles.textTitle}
              >
                {vitalSign.title}
              </Text>

              <View style={styles.itemVitalSignInfo}>
                {
                  vitalSign.rate_is_increasing
                    ?
                    <Entypo name="arrow-long-up" size={30} color="white" />
                    :
                    <Entypo name="arrow-long-down" size={30} color="white" />
                }
                <Text
                  style={styles.textValue}
                >
                  {Math.abs(+vitalSign.value).toFixed(1)}
                </Text>
                <Text
                  style={styles.textUnit}
                >
                  {vitalSign.units}
                </Text>
              </View>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.3,
  },
  vitalSigns: {
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    padding: 40
  },
  itemVitalSign: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#FFF3',
    width: '100%',
    padding: 5,
    borderRadius: 20
  },
  itemVitalSignInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTitle: {
    color: "#FFFF",
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Prompt_400Regular'
  },
  textValue: {
    color: "#FFFF",
    fontSize: 40,
    fontFamily: 'Prompt_600SemiBold',
    marginLeft: 5
  },
  textUnit: {
    color: "#FFFF",
    maxWidth: 100,
    marginLeft: 10,
    fontFamily: 'Prompt_500Medium_Italic'
  }
});
