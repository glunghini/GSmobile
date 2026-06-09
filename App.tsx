import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CadastroFazendaScreen from './src/screens/CadastroFazendaScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Telas de Autenticação (Sem cabeçalho) */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />

        {/* Telas do App (Com cabeçalho verde) */}
        <Stack.Group screenOptions={{
          headerStyle: { backgroundColor: '#15803d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Minhas Fazendas', headerBackVisible: false }} 
          />
          <Stack.Screen 
            name="Cadastro" 
            component={CadastroFazendaScreen} 
            options={{ title: 'Cadastrar Fazenda' }} 
          />
          <Stack.Screen 
            name="Detalhes" 
            component={DetalhesScreen} 
            options={{ title: 'Monitoramento' }} 
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}