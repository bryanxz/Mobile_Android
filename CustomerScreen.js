import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { addOrder } from './ordersBackend'; // Certifique-se de que o caminho está correto

export default function CustomerScreen({ navigation }) {
  const [orderDescription, setOrderDescription] = useState('');

  const handlePlaceOrder = () => {
    if (orderDescription.trim()) {
      addOrder(orderDescription); // Adiciona o pedido ao backend
      setOrderDescription(''); // Limpa o campo de texto após o envio
      alert('Pedido realizado com sucesso!');
    } else {
      alert('Por favor, insira uma descrição para o pedido.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cliente - Realizar Pedido</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu pedido"
        value={orderDescription}
        onChangeText={setOrderDescription}
      />
      <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
        <Text style={styles.buttonText}>Fazer Pedido</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Restaurant')}>
        <Text style={styles.navButtonText}>Ir para Tela do Restaurante</Text>
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
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  navButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
