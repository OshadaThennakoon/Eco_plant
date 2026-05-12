import React, { useState, useEffect, useRef } from 'react';
import { 
  View, TextInput, Text, StyleSheet, Alert, ImageBackground, 
  Animated, Pressable, Keyboard, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const isWebLarge = Platform.OS === 'web' && width > 768;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnimPrimary = useRef(new Animated.Value(1)).current;
  const scaleAnimSecondary = useRef(new Animated.Value(1)).current;

  const [windowWidth, setWindowWidth] = useState(width);
  
  useEffect(() => {
    const updateWidth = () => setWindowWidth(Dimensions.get('window').width);
    const subscription = Dimensions.addEventListener('change', updateWidth);
    return () => subscription?.remove();
  }, []);

  const isDesktop = Platform.OS === 'web' && windowWidth > 768;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleSignup = () => {
    if (!email || !password || !name) {
      Alert.alert('Hold on!', 'Please fill out all fields.');
      return;
    }
    Alert.alert('Success', 'Account created successfully! (Mock)', [
      { text: 'OK', onPress: () => router.replace('/Login') }
    ]);
  };

  const animatePressIn = (animObject: Animated.Value) => {
    Animated.spring(animObject, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = (animObject: Animated.Value) => {
    Animated.spring(animObject, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderFormContent = () => (
    <Animated.View 
      style={[
        styles.formPanel, 
        isDesktop ? styles.formPanelDesktop : styles.formPanelMobile,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.headerContainer}>
        <View style={styles.iconSpaced}>
          <Ionicons name="person-add" size={40} color={Colors.light.primary} />
        </View>
        <Text style={styles.title}>Join Us</Text>
        <Text style={styles.subtitle}>Start your green journey today</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color={Colors.light.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#757575"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color={Colors.light.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#757575"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.light.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#757575"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.actionContainer}>
        <AnimatedPressable
          onPressIn={() => animatePressIn(scaleAnimPrimary)}
          onPressOut={() => animatePressOut(scaleAnimPrimary)}
          onPress={handleSignup}
          style={{ transform: [{ scale: scaleAnimPrimary }] }}
        >
          <LinearGradient
            colors={[Colors.light.primary, '#1E5622']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, styles.primaryButton]}
          >
            <Text style={styles.primaryButtonText}>SIGN UP</Text>
          </LinearGradient>
        </AnimatedPressable>

        <AnimatedPressable
          onPressIn={() => animatePressIn(scaleAnimSecondary)}
          onPressOut={() => animatePressOut(scaleAnimSecondary)}
          onPress={() => router.back()}
          style={{ transform: [{ scale: scaleAnimSecondary }] }}
        >
          <View style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
          </View>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );

  // Desktop Split View
  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        <View style={styles.desktopLeft}>
          <ImageBackground 
            source={require('../assets/images/eco_background.png')} 
            style={styles.background}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(27, 94, 32, 0.6)']}
              style={styles.gradientOverlay}
            />
          </ImageBackground>
        </View>
        <View style={styles.desktopRight}>
          {renderFormContent()}
        </View>
      </View>
    );
  }

  // Mobile / Tablet Portrait View
  return (
    <ImageBackground 
      source={require('../assets/images/eco_background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
        style={styles.gradientOverlay}
      />
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}>
          <View style={styles.centerTargetMobile}>
            {renderFormContent()}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardContainer: {
    flex: 1,
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
  },
  desktopLeft: {
    flex: 1.2,
    position: 'relative',
  },
  desktopRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  centerTargetMobile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formPanel: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  formPanelMobile: {
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.92)', 
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  formPanelDesktop: {
    maxWidth: 450,
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconSpaced: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.icon,
    marginTop: 8,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 60,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    height: '100%',
    outlineStyle: 'none',
  },
  actionContainer: {
    gap: 15,
  },
  button: {
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '700',
  }
});
