import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { obterDadosMonitoramento, ResultadoMonitoramento } from '../services/api';

export default function DetalhesScreen() {
  const route = useRoute<any>();
  const { fazenda } = route.params;

  const [dados, setDados] = useState<ResultadoMonitoramento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      const resultado = await obterDadosMonitoramento(
        Number(fazenda.latitude),
        Number(fazenda.longitude)
      );

      if (resultado) {
        setDados(resultado);
      } else {
        setErro(true);
      }
      setIsLoading(false);
    };

    carregarDados();
  }, [fazenda]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#15803d" />
        <Text style={styles.loadingText}>Analisando dados de satélite e clima...</Text>
      </View>
    );
  }

  if (erro || !dados) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Não foi possível obter os dados da Open-Meteo.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{fazenda.nome}</Text>
      <Text style={styles.subtitle}>Lat: {fazenda.latitude} | Lon: {fazenda.longitude}</Text>

      {dados.alerta && (
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠️ ALERTA: {dados.alerta.tipo}</Text>
          <Text style={styles.alertText}>{dados.alerta.descricao}</Text>
          <Text style={styles.alertRisk}>Nível de Risco: {dados.alerta.nivelRisco}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardHeader}>Condições Climáticas Atuais</Text>
        <Text style={styles.cardText}>🌡️ Temperatura: {dados.clima.temperatura}°C</Text>
        <Text style={styles.cardText}>💧 Umidade: {dados.clima.umidade}%</Text>
        <Text style={styles.cardText}>🌧️ Precipitação: {dados.clima.precipitacao} mm</Text>
        <Text style={styles.cardText}>💨 Vento: {dados.clima.velocidadeVento} km/h</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>Análise de Vegetação (NDVI)</Text>
        <Text style={styles.cardText}>📊 Índice NDVI Estimado: {dados.ndvi}</Text>
        <Text style={styles.cardText}>🌱 Saúde da Plantação: {dados.saudeVegetacao}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#15803d',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  alertCard: {
    backgroundColor: '#fef2f2',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b91c1c',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 16,
    color: '#991b1b',
    marginBottom: 8,
  },
  alertRisk: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f1d1d',
  },
});