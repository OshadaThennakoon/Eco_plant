import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, 
  Animated, Pressable, Image, ActivityIndicator, Dimensions, Platform, ScrollView, Easing
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const VEGETABLES = [
  { id: 'tomato', name: 'Tomato', icon: 'leaf' },
  { id: 'chili', name: 'Chili', icon: 'flame' },
  { id: 'brinjal', name: 'Brinjal', icon: 'egg' },
  { id: 'cassava', name: 'Cassava', icon: 'nutrition' },
  { id: 'bean', name: 'Bean', icon: 'podium' }
];

export default function Diagnose() {
  const router = useRouter();
  
  const [selectedVeg, setSelectedVeg] = useState('tomato');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ disease: string; confidence: number; vegetable: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [windowWidth, setWindowWidth] = useState(width);
  useEffect(() => {
    const updateWidth = () => setWindowWidth(Dimensions.get('window').width);
    const subscription = Dimensions.addEventListener('change', updateWidth);
    return () => subscription?.remove();
  }, []);

  const isDesktop = Platform.OS === 'web' && windowWidth > 800;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const resultFade = useRef(new Animated.Value(0)).current;
  const resultSlide = useRef(new Animated.Value(20)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;
  const backScale = useRef(new Animated.Value(1)).current;
  
  // Scanner Animation
  const scannerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scannerAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scannerAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      scannerAnim.setValue(0);
      scannerAnim.stopAnimation();
    }
  }, [loading]);

  const animatePressIn = (animObject: Animated.Value) => {
    Animated.spring(animObject, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const animatePressOut = (animObject: Animated.Value) => {
    Animated.spring(animObject, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const pickImage = async () => {
    setErrorMsg(null);
    setResult(null);
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    resultFade.setValue(0);
    resultSlide.setValue(20);

    try {
      const formData = new FormData();
      
      if (Platform.OS === 'web') {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append('image', blob, 'plant.jpg');
      } else {
        formData.append('image', {
          uri: image,
          name: 'plant_upload.jpg',
          type: 'image/jpeg',
        } as any);
      }

      formData.append('vegetable', selectedVeg);

      const baseUrl = Platform.OS === 'web' ? 'http://localhost:5001' : 'http://10.199.111.226:5001';
      const res = await fetch(`${baseUrl}/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Server error');
      }

      setResult({
        disease: data.disease,
        confidence: data.confidence || 1.0,
        vegetable: data.vegetable
      });

      Animated.parallel([
        Animated.timing(resultFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(resultSlide, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to analyze image. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const getResultConfig = (disease: string) => {
    if (disease.toLowerCase().includes('healthy')) return { color: '#2E7D32', icon: 'checkmark-circle' };
    if (disease.toLowerCase().includes('mosaic')) return { color: '#F57C00', icon: 'warning' };
    return { color: '#D32F2F', icon: 'alert-circle' }; 
  };

  return (
    <ImageBackground 
      source={require('../assets/images/eco_background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient colors={['rgba(240,244,240,0.85)', 'rgba(255,255,255,0.95)']} style={styles.overlay}>
        <View style={isDesktop ? styles.containerDesktop : styles.containerMobile}>
          
          <Animated.View style={[
            styles.mainCard, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
            
            {/* Header */}
            <View style={styles.header}>
              <AnimatedPressable
                onPressIn={() => animatePressIn(backScale)}
                onPressOut={() => animatePressOut(backScale)}
                onPress={() => router.back()}
                style={[styles.backBtn, { transform: [{ scale: backScale }] }]}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
              </AnimatedPressable>
              <Text style={styles.title}>Plant Doctor AI</Text>
              <View style={{width: 44}} />
            </View>

            {/* Content Body */}
            <View style={isDesktop ? styles.desktopSplit : styles.mobileStack}>
              
              {/* Left Side / Top Side */}
              <View style={isDesktop ? styles.desktopLeft : styles.fullWidth}>
                <View style={styles.selectorContainer}>
                  <Text style={styles.sectionLabel}>Select Plant Type</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
                    {VEGETABLES.map((veg) => {
                      const isActive = selectedVeg === veg.id;
                      return (
                        <Pressable
                          key={veg.id}
                          onPress={() => setSelectedVeg(veg.id)}
                        >
                          <LinearGradient
                            colors={isActive ? [Colors.light.primary, '#1E5622'] : ['#F5F5F5', '#E0E0E0']}
                            start={{x:0, y:0}} end={{x:1, y:1}}
                            style={[styles.vegChip, isActive && styles.vegChipActive]}
                          >
                            <Ionicons 
                              name={veg.icon as any} 
                              size={18} 
                              color={isActive ? '#fff' : '#757575'} 
                              style={{marginRight: 8}}
                            />
                            <Text style={[styles.vegText, isActive && styles.vegTextActive]}>
                              {veg.name}
                            </Text>
                          </LinearGradient>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Upload Area */}
                <Text style={styles.sectionLabel}>Upload Image</Text>
                <Pressable onPress={pickImage} style={[styles.uploadArea, { aspectRatio: isDesktop ? 1.5 : 1 }]}>
                  {image ? (
                    <View style={styles.imageWrapper}>
                      <Image source={{ uri: image }} style={styles.previewImage} />
                      {loading && (
                        <Animated.View style={[
                          styles.scannerLine,
                          {
                            transform: [{
                              translateY: scannerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, isDesktop ? 300 : 250] // Match approx height of image wrapper
                              })
                            }]
                          }
                        ]}>
                          <LinearGradient
                            colors={['transparent', 'rgba(76, 175, 80, 0.8)', 'transparent']}
                            style={styles.scannerGradient}
                          />
                        </Animated.View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <View style={styles.uploadIconCircle}>
                        <Ionicons name="camera" size={32} color={Colors.light.primary} />
                      </View>
                      <Text style={styles.uploadText}>Tap to upload or take a photo</Text>
                      <Text style={styles.uploadSubtext}>Supports JPG, PNG (Max 5MB)</Text>
                    </View>
                  )}
                </Pressable>
              </View>

              {/* Right Side / Bottom Side */}
              <View style={isDesktop ? styles.desktopRight : styles.fullWidth}>
                {errorMsg && (
                  <View style={styles.errorBox}>
                    <Ionicons name="warning" size={24} color={Colors.light.danger} />
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                )}

                {/* Analyze Button */}
                <AnimatedPressable
                  onPressIn={() => animatePressIn(scaleBtn)}
                  onPressOut={() => animatePressOut(scaleBtn)}
                  onPress={analyzeImage}
                  disabled={!image || loading}
                  style={{ transform: [{ scale: scaleBtn }], width: '100%' }}
                >
                  <LinearGradient
                    colors={(!image || loading) ? ['#BDBDBD', '#9E9E9E'] : [Colors.light.primary, '#1E5622']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={[styles.analyzeBtn, (!image || loading) && styles.analyzeBtnDisabled]}
                  >
                    {loading ? (
                      <View style={styles.loadingRow}>
                        <ActivityIndicator color="#fff" style={{marginRight: 10}} />
                        <Text style={styles.analyzeBtnText}>Analyzing with AI...</Text>
                      </View>
                    ) : (
                      <>
                        <Ionicons name="sparkles" size={22} color="#fff" style={{marginRight: 10}} />
                        <Text style={styles.analyzeBtnText}>Analyze {VEGETABLES.find(v => v.id === selectedVeg)?.name}</Text>
                      </>
                    )}
                  </LinearGradient>
                </AnimatedPressable>

                {/* Result Area */}
                {result && (
                  <Animated.View style={[
                    styles.resultCard, 
                    { opacity: resultFade, transform: [{ translateY: resultSlide }] }
                  ]}>
                    <View style={styles.resultHeaderRow}>
                      <View style={[styles.resultIconBox, { backgroundColor: getResultConfig(result.disease).color + '15' }]}>
                        <Ionicons name={getResultConfig(result.disease).icon as any} size={36} color={getResultConfig(result.disease).color} />
                      </View>
                      <View style={styles.resultDetails}>
                        <Text style={styles.resultLabel}>Diagnosis Complete</Text>
                        <Text style={[styles.resultName, { color: getResultConfig(result.disease).color }]}>
                          {result.disease}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.confidenceBarContainer}>
                      <View style={styles.confidenceRow}>
                        <Text style={styles.confidenceText}>AI Confidence Score</Text>
                        <Text style={styles.confidencePercent}>{(result.confidence * 100).toFixed(1)}%</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <Animated.View style={[
                          styles.progressBarFill, 
                          { 
                            width: `${result.confidence * 100}%`,
                            backgroundColor: getResultConfig(result.disease).color
                          }
                        ]} />
                      </View>
                    </View>
                  </Animated.View>
                )}
              </View>

            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  containerMobile: {
    width: '100%',
    paddingHorizontal: 20,
  },
  containerDesktop: {
    width: '100%',
    maxWidth: 1000,
    paddingHorizontal: 20,
  },
  mainCard: {
    width: '100%',
    backgroundColor: Colors.light.background,
    borderRadius: 32,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.light.text,
  },
  desktopSplit: {
    flexDirection: 'row',
    gap: 40,
  },
  mobileStack: {
    flexDirection: 'column',
  },
  desktopLeft: {
    flex: 1.2,
  },
  desktopRight: {
    flex: 1,
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectorContainer: {
    marginBottom: 25,
  },
  scrollList: {
    gap: 12,
    paddingRight: 10,
    paddingBottom: 10, // For shadow
  },
  vegChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  vegChipActive: {
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  vegText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#757575',
  },
  vegTextActive: {
    color: '#fff',
  },
  uploadArea: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 30,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  scannerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 40,
    zIndex: 10,
  },
  scannerGradient: {
    flex: 1,
    opacity: 0.8,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadText: {
    fontSize: 18,
    color: Colors.light.text,
    fontWeight: '700',
    marginBottom: 5,
  },
  uploadSubtext: {
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  analyzeBtn: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  analyzeBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  analyzeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  resultDetails: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: '#9E9E9E',
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  resultName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  confidenceBarContainer: {
    width: '100%',
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '600',
  },
  confidencePercent: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '800',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  errorBox: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#D32F2F',
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  }
});
