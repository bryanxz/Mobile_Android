import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { getOrders, updateOrderStatus } from './ordersBackend'; // Certifique-se de que o caminho está correto

export default function RestaurantScreen({ navigation }) {
  const [orders, setOrders] = useState([]);

  // Carrega pedidos ao montar o componente
  useEffect(() => {
    const loadOrders = () => {
      const initialOrders = getOrders(); // Obtém pedidos do backend
      setOrders(initialOrders);   
    };

    loadOrders(); // Carrega pedidos ao montar o componente

    const interval = setInterval(loadOrders, 3000); // Atualiza a cada 3 segundos
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  const handleStatusChange = (id) => {
    updateOrderStatus(id); // Atualiza o status do pedido no backend
    setOrders(getOrders()); // Atualiza a lista de pedidos local
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurante - Gerenciamento de Pedidos</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.itemText}>{item.id}. {item.description}</Text>
            <Text style={styles.statusText}>Status: {item.status}</Text>
            {item.status !== 'Entregue' && (
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => handleStatusChange(item.id)}
              >
                <Text style={styles.statusButtonText}>Atualizar Status</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Customer')}>
        <Text style={styles.buttonText}>Ir para Tela do Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: '90%',
  },
  itemText: {
    fontSize: 18,
  },
  statusText: {
    fontSize: 16,
    color: '#777',
    marginVertical: 5,
  },
  statusButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
