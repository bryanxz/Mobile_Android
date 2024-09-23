import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { addOrder, getOrders, updateOrderStatus } from './ordersBackend'; // Importa backend simulado
import { Picker } from '@react-native-picker/picker';

const Stack = createStackNavigator();

const Dishes = [
  'Pastel de carne',
  'Pastel de frango',
  'Pastel de queijo',
  'Pastel de pizza',
];

// Tela de Login
function LoginScreen({ navigation }) {
  const [userType] = useState('');

  const handleLogin = (userType) => {
    if (userType == 'cliente') {
      navigation.navigate('Customer');
    } else if (userType == 'restaurante') {
      navigation.navigate('Restaurante');
    } else {
      alert('Selecione "cliente" ou "restaurante"');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Entrar como cliente"
          onPress={() => handleLogin('cliente')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Entrar como Funcionario"
          onPress={() => handleLogin('restaurante')}
        />
      </View>
    </View>
  );
}

// Tela do Cliente
function CustomerScreen() {
  const [nome, setNome] = useState('');
  const [pedido, setPedido] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [items, setItems] = useState([]);
  const [pickValue, setPickvalue] = useState('');
  let ord = '';

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      { id: items.length + 1, title: pickValue },
    ]);
  };

  const handleSubmit = () => {
    ord = `Pedido de ${nome} - `;
    for(let i = 0; i < items.length; i++)
    {
      
      ord += items[i].title + ' ';
    }
    
    addOrder(ord); // Adiciona o pedido ao backend
   
    alert(`${nome} Seu pedido Enviado: ${pedido}`);
    setPedido(''); // Limpa o campo após o envio
    setNome('');
    setItems([]);
  };
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cliente - Fazer Pedido</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu Nome"
        value={nome}
        onChangeText={setNome}
      />
      <Picker
        selectedValue={pickValue}
        onValueChange={(pickValue) => setPickvalue(pickValue)}
        style={styles.picker}>
        {Dishes.map((dish, index) => (
          <Picker.Item key={index} label={dish} value={dish} />
        ))}
      </Picker>
      <Button title="Adicionar" onPress={addItem} />
      <Text style={styles.selectedValue}>Items escolhidos:</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

// Tela do Restaurante
function RestaurantScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(getOrders()); // Carrega pedidos ao montar o componente

    const interval = setInterval(() => {
      setOrders(getOrders()); // Atualiza a cada 3 segundos
    }, 3000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  const handleStatusChange = (id) => {
    updateOrderStatus(id); // Atualiza o status no backend
    setOrders(getOrders()); // Atualiza a lista local
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurante - Gerenciamento de Pedidos</Text>

      {orders.map((order) => (
        <View key={order.id} style={styles.orderItem}>
          <Text style={styles.itemText}>
            {order.id}. {order.description}
          </Text>
          <Text style={styles.statusText}>Status: {order.status}</Text>
          {order.status !== 'Entregue' && (
            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => handleStatusChange(order.id)}>
              <Text style={styles.statusButtonText}>Atualizar Status</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

// App principal com navegação
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Customer" component={CustomerScreen} />
        <Stack.Screen name="Restaurante" component={RestaurantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  orderItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  itemText: {
    fontSize: 18,
  },
  statusText: {
    marginVertical: 5,
    fontSize: 16,
    fontStyle: 'italic',
  },
  statusButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: 200,
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 18,
  },
  list: {
    marginTop: 0,
  },
  item: {
    marginVertical: 0,
  },
});
