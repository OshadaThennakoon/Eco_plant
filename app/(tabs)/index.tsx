import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './_layout';
import Login from '../Login';
import Signup from '../Signup';
import Home from '../Home';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
// Login.tsx
const navigation = useNavigation();

// Use navigation.navigate to go to 'Home' screen
navigation.navigate('Home');


export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
