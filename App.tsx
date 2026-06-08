import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CadastroFazendaScreen from './src/screens/CadastroFazendaScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#15803d' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Minhas Fazendas' }} 
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}