import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CadastroFazendaScreen() {
  const navigation = useNavigation();
  const [nomeFazenda, setNomeFazenda] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const obterLocalizacaoAtual = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à localização.');
        setIsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    } finally {
      setIsLoading(false);
    }
  };

  const salvarFazenda = async () => {
    if (!nomeFazenda || !latitude || !longitude) {
      Alert.alert('Erro', 'Preencha todos os campos ou capture a localização.');
      return;
    }

    try {
      const novaFazenda = {
        id: Date.now().toString(),
        nome: nomeFazenda,
        latitude,
        longitude
      };

      const fazendasSalvas = await AsyncStorage.getItem('@fazendas_salvas');
      const fazendas = fazendasSalvas ? JSON.parse(fazendasSalvas) : [];
      
      fazendas.push(novaFazenda);
      
      await AsyncStorage.setItem('@fazendas_salvas', JSON.stringify(fazendas));
      
      Alert.alert('Sucesso', 'Fazenda cadastrada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a fazenda.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Fazenda</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Fazenda"
        value={nomeFazenda}
        onChangeText={setNomeFazenda}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput, { marginRight: 8 }]}
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.halfInput, { marginLeft: 8 }]}
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={styles.gpsButton}
        onPress={obterLocalizacaoAtual}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.gpsButtonText}>📍 Capturar Minha Localização</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={salvarFazenda}>
        <Text style={styles.saveButtonText}>Salvar Fazenda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
  },
  gpsButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  gpsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#15803d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});