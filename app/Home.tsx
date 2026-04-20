import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 }
});
