import React, { useEffect, useRef, useState } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, 
  Animated, Pressable, ScrollView, Dimensions, Platform
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './_firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Home() {
  const router = useRouter();
  
  const [windowWidth, setWindowWidth] = useState(width);
  useEffect(() => {
    const updateWidth = () => setWindowWidth(Dimensions.get('window').width);
    const subscription = Dimensions.addEventListener('change', updateWidth);
    return () => subscription?.remove();
  }, []);

  const isDesktop = Platform.OS === 'web' && windowWidth > 800;

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoutScale = useRef(new Animated.Value(1)).current;
  const actionScale = useRef(new Animated.Value(1)).current;

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/Login');
    } catch (error) {
      router.replace('/Login');
    }
  };

  const animatePressIn = (animObject: Animated.Value) => {
    Animated.spring(animObject, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const animatePressOut = (animObject: Animated.Value) => {
    Animated.spring(animObject, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const StatCard = ({ icon, title, value, gradient }: { icon: any, title: string, value: string, gradient: string[] }) => (
    <LinearGradient colors={gradient} start={{x:0, y:0}} end={{x:1, y:1}} style={[styles.statCard, isDesktop && styles.statCardDesktop]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={28} color="#FFF" />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <ImageBackground 
      source={require('../assets/images/eco_background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView 
          contentContainerStyle={isDesktop ? styles.scrollContainerDesktop : styles.scrollContainerMobile}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.dashboardContainer, 
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            {/* Header Area */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Hello, Admin</Text>
                <Text style={styles.subtitle}>Your garden is thriving today 🌿</Text>
              </View>
              
              <AnimatedPressable
                onPressIn={() => animatePressIn(logoutScale)}
                onPressOut={() => animatePressOut(logoutScale)}
                onPress={handleLogout}
                style={[styles.logoutBtn, { transform: [{ scale: logoutScale }] }]}
              >
                <Ionicons name="log-out-outline" size={24} color={Colors.light.danger} />
              </AnimatedPressable>
            </View>

            <View style={isDesktop ? styles.contentSplitDesktop : styles.contentSplitMobile}>
              
              {/* Left Column (Web) / Top Column (Mobile) */}
              <View style={isDesktop ? styles.leftColumn : styles.fullWidth}>
                {/* Diagnose Action Card - The Hero Action */}
                <AnimatedPressable 
                  onPressIn={() => animatePressIn(actionScale)}
                  onPressOut={() => animatePressOut(actionScale)}
                  onPress={() => router.push('/Diagnose')}
                  style={{ transform: [{ scale: actionScale }] }}
                >
                  <LinearGradient
                    colors={[Colors.light.primary, '#1E5622']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.diagnoseCard}
                  >
                    <View style={styles.diagnoseIconBox}>
                      <Ionicons name="scan" size={36} color={Colors.light.primary} />
                    </View>
                    <View style={styles.diagnoseContent}>
                      <Text style={styles.diagnoseTitle}>Plant AI Doctor</Text>
                      <Text style={styles.diagnoseDesc}>Take a photo to identify diseases instantly</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={28} color="#fff" />
                  </LinearGradient>
                </AnimatedPressable>

                {/* Stats Grid - Bento Box Style */}
                <View style={styles.statsGrid}>
                  <StatCard icon="leaf" title="Total Plants" value="24" gradient={['#4CAF50', '#2E7D32']} />
                  <StatCard icon="water" title="Needs Water" value="3" gradient={['#42A5F5', '#1565C0']} />
                  <StatCard icon="sunny" title="Good Light" value="18" gradient={['#FFCA28', '#F57C00']} />
                  <StatCard icon="warning" title="Attention" value="1" gradient={['#EF5350', '#C62828']} />
                </View>
              </View>

              {/* Right Column (Web) / Bottom Column (Mobile) */}
              <View style={isDesktop ? styles.rightColumn : styles.fullWidth}>
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <Text style={styles.seeAll}>See All</Text>
                  </View>
                  
                  <View style={styles.activityCard}>
                    <View style={[styles.activityIcon, {backgroundColor: '#E3F2FD'}]}>
                      <Ionicons name="water" size={20} color="#1565C0" />
                    </View>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityName}>Watered Monstera</Text>
                      <Text style={styles.activityTime}>2 hours ago</Text>
                    </View>
                  </View>
                  
                  <View style={styles.activityCard}>
                    <View style={[styles.activityIcon, {backgroundColor: '#E8F5E9'}]}>
                      <Ionicons name="leaf" size={20} color="#2E7D32" />
                    </View>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityName}>Added Snake Plant</Text>
                      <Text style={styles.activityTime}>Yesterday</Text>
                    </View>
                  </View>

                  <View style={[styles.activityCard, { borderBottomWidth: 0 }]}>
                    <View style={[styles.activityIcon, {backgroundColor: '#FFF8E1'}]}>
                      <Ionicons name="sunny" size={20} color="#F57C00" />
                    </View>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityName}>Moved Aloe to sunlight</Text>
                      <Text style={styles.activityTime}>2 days ago</Text>
                    </View>
                  </View>
                </View>
              </View>

            </View>
          </Animated.View>
        </ScrollView>
      </View>
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
    backgroundColor: 'rgba(240,244,240,0.85)', // A light, nature-inspired overlay
  },
  scrollContainerMobile: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },
  scrollContainerDesktop: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 40,
    paddingTop: 80,
  },
  dashboardContainer: {
    width: '100%',
    maxWidth: 1200, // Wide container for desktop
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    marginTop: 5,
    fontWeight: '600',
  },
  logoutBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  contentSplitDesktop: {
    flexDirection: 'row',
    gap: 30,
  },
  contentSplitMobile: {
    flexDirection: 'column',
  },
  leftColumn: {
    flex: 2,
  },
  rightColumn: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  diagnoseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 25,
    marginBottom: 25,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  diagnoseIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  diagnoseContent: {
    flex: 1,
  },
  diagnoseTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  diagnoseDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 25,
  },
  statCard: {
    width: '47%', // 2 columns on mobile
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  statCardDesktop: {
    width: '23%', // 4 columns on wide screens
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statInfo: {
    justifyContent: 'flex-end',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  section: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '700',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: Colors.light.icon,
    fontWeight: '500',
  }
});
