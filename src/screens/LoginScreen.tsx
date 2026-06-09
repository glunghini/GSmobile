import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha o e-mail e a senha.');
      return;
    }

    try {
      const accountData = await AsyncStorage.getItem('@user_account');
      
      if (!accountData) {
        Alert.alert('Erro', 'Nenhuma conta encontrada. Faça o cadastro.');
        return;
      }

      const userAccount = JSON.parse(accountData);

      if (userAccount.email === email.toLowerCase() && userAccount.senha === senha) {
        // Usa o reset/replace para o usuário não conseguir voltar pra tela de login apertando "voltar"
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert('Erro', 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um problema ao fazer o login.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>AgroSatMobile</Text>
      <Text style={styles.subtitle}>Acesso ao Painel</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se aqui.</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#15803d', // Fundo verde para dar contraste na tela de entrada
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#dcfce7',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f0fdf4',
    fontSize: 16,
    color: '#14532d',
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#15803d',
    fontWeight: 'bold',
    fontSize: 18,
  },
  linkText: {
    color: '#dcfce7',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});