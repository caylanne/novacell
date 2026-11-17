import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { C } from './src/theme';
import { AuthProvider } from './src/auth';
import Home from './src/screens/Home';
import Catalogo from './src/screens/Catalogo';
import Detalhe from './src/screens/Detalhe';
import Assistencia from './src/screens/Assistencia';
import Simulador from './src/screens/Simulador';
import Conta from './src/screens/Conta';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ICONES = { 'Início': 'home', 'Catálogo': 'phone-portrait', 'Assistência': 'construct', 'Simulador': 'card', 'Conta': 'person' };
const hdr = { headerTintColor: C.primary, headerStyle: { backgroundColor: C.bg }, headerTitleStyle: { color: C.text, fontWeight: '800' } };

function CatalogoStack() {
  return (
    <Stack.Navigator screenOptions={hdr}>
      <Stack.Screen name="Lista" component={Catalogo} options={{ title: 'Catálogo' }} />
      <Stack.Screen name="Detalhe" component={Detalhe} options={{ title: 'Aparelho' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: C.bg } }}>
        <StatusBar style="auto" />
        <Tab.Navigator screenOptions={({ route }) => ({
          ...hdr, tabBarActiveTintColor: C.primary, tabBarInactiveTintColor: C.muted,
          tabBarIcon: ({ color, size }) => <Ionicons name={ICONES[route.name]} size={size} color={color} />,
        })}>
          <Tab.Screen name="Início" component={Home} options={{ headerShown: false }} />
          <Tab.Screen name="Catálogo" component={CatalogoStack} options={{ headerShown: false }} />
          <Tab.Screen name="Assistência" component={Assistencia} options={{ title: 'Assistência técnica' }} />
          <Tab.Screen name="Simulador" component={Simulador} options={{ title: 'Simulador de cartão' }} />
          <Tab.Screen name="Conta" component={Conta} options={{ title: 'Conta' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
