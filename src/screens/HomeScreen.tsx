import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export interface Fazenda {
  id: string;
  nome: string;
  latitude: string;
  longitude: string;
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const carregarFazendas = async () => {
    try {
      setIsLoading(true);
      const jsonValue = await AsyncStorage.getItem('@fazendas_salvas');
      const fazendasSalvas = jsonValue != null ? JSON.parse(jsonValue) : [];
      setFazendas(fazendasSalvas);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarRemocao = (id: string, nome: string) => {
    Alert.alert(
      'Remover Fazenda',
      `Tem certeza que deseja remover a ${nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removerFazenda(id) }
      ]
    );
  };

  const removerFazenda = async (id: string) => {
    try {
      const novasFazendas = fazendas.filter(fazenda => fazenda.id !== id);
      setFazendas(novasFazendas);
      await AsyncStorage.setItem('@fazendas_salvas', JSON.stringify(novasFazendas));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a fazenda.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarFazendas();
    }, [])
  );

  const renderItem = ({ item }: { item: Fazenda }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardText}>
        Lat: {item.latitude} | Lon: {item.longitude}
      </Text>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => confirmarRemocao(item.id, item.nome)}
        >
          <Text style={styles.deleteButtonText}>Remover 🗑️</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('Detalhes', { fazenda: item })}
        >
          <Text style={styles.cardLink}>Ver Monitoramento ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AgroSatMobile</Text>
        <Text style={styles.subtitle}>Painel de Monitoramento</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#166534" style={styles.loader} />
      ) : fazendas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma fazenda cadastrada ainda.
          </Text>
        </View>
      ) : (
        <FlatList
          data={fazendas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#14532d',
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 16,
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  deleteButton: {
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  linkButton: {
    paddingVertical: 6,
  },
  cardLink: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    backgroundColor: '#15803d',
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});