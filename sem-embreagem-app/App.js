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
import { addOrder as backendAddOrder, getOrders, updateOrderStatus } from './ordersBackend';
import { Picker } from '@react-native-picker/picker';
import Objects from './Objetcs';

const Stack = createStackNavigator();

// Sample Dishes
const Dishes = [
  new Objects('Pastel de Frango', 5.50),
  new Objects('Pastel de Carne', 6.20),
  new Objects('Pastel de Queijo', 4.10),
  new Objects('Pastel de Pizza', 7.70),
];

// Login Screen Component
function LoginScreen({ navigation }) {
  const handleLogin = (userType) => {
    if (userType === 'cliente') {
      navigation.navigate('Customer');
    } else if (userType === 'restaurante') {
      navigation.navigate('Restaurante');
    } else {
      alert('Selecione "cliente" ou "restaurante"');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <View style={styles.buttonContainer}>
        <Button title="Entrar como cliente" onPress={() => handleLogin('cliente')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Entrar como Funcionário" onPress={() => handleLogin('restaurante')} />
      </View>
    </View>
  );
}

// Customer Screen Component
function CustomerScreen() {
  const [nome, setNome] = useState('');
  const [items, setItems] = useState([]);
  const [pickValue, setPickValue] = useState(Dishes[0].getName());
  const [totalOrder, setTotalOrder] = useState(0);
  const [pedidoCompleto, setPedidoCompleto] = useState('');

  // Function to add item to the order
  const addItem = () => {
    const currentItem = Dishes.find(dish => dish.getName() === pickValue);
    const newItem = { id: currentItem.getName(), title: currentItem.getName(), price: currentItem.getPrice() };

    // Call the modified addOrder function
    addOrder(newItem);
  }

  const addOrder = (item) => {
    setItems(prevOrders => {
      const existingOrder = prevOrders.find(order => order.title === item.title);
      if (existingOrder) {
        // Se o pedido já existe, atualize a contagem
        const updatedOrders = prevOrders.map(order =>
          order.title === item.title
            ? { ...order, count: order.count + 1 }
            : order
        );
        calculateOrderDetails(updatedOrders); // Atualiza os detalhes do pedido
        return updatedOrders;
      } else {
        // Caso contrário, adicione um novo pedido com contagem 1
        const updatedOrders = [...prevOrders, { ...item, count: 1 }];
        calculateOrderDetails(updatedOrders); // Atualiza os detalhes do pedido
        return updatedOrders;
      }
    });
  };

  const removeOrder = (item) => {
  setItems(prevOrders => {
    const existingOrder = prevOrders.find(order => order.title === item.title);
    if (existingOrder && existingOrder.count > 1) {
      // Se o pedido já existe e a contagem é maior que 1, decremente a contagem
      const updatedOrders = prevOrders.map(order =>
          order.title === item.title
            ? { ...order, count: order.count - 1 }
            : order
      );
      calculateOrderDetails(updatedOrders); // Atualiza os detalhes do pedido
        return updatedOrders;
    } else {
      // Se a contagem é 1, remova o item da lista
      const updatedOrders =  prevOrders.filter(order => order.title !== item.title);
      calculateOrderDetails(updatedOrders); // Atualiza os detalhes do pedido
        return updatedOrders;
    }
  });
};

  // Function to calculate total order value and complete order string
  const calculateOrderDetails = (updatedItems) => {
    let total = 0;
    let completo = '';

    updatedItems.forEach((item) => {
      total += item.price * item.count; // Multiplica o preço pela contagem
      completo += `${item.title} x${item.count}, `;
    });

    setTotalOrder(total);
    setPedidoCompleto(completo.slice(0, -2)); // Remove a última vírgula e espaço
  };

  // Function to handle order submission
  const handleSubmit = () => {
    if(nome != "")
    {
      if(items != "")
      {
        const orderDescription = `Pedido de ${nome} - ${pedidoCompleto}`;
      backendAddOrder(orderDescription); // Envia o pedido ao backend
      alert(`${nome}, seu pedido foi enviado: ${pedidoCompleto}`);
      resetOrder();
      }
      else
      {
        alert('Escolha seu pedido!');
      }
      
    }
    else
    {
      alert('Digite um nome!');
    }
    
  };

  // Function to reset order state
  const resetOrder = () => {
    setNome('');
    setItems([]);
    setTotalOrder(0);
    setPedidoCompleto('');
  };

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.item}>{item.title}</Text>
      <TouchableOpacity style={styles.btn}>
      <Text style={styles.btntext} onPress={() => removeOrder(item)}>-</Text>
      </TouchableOpacity>

        <View style={styles.textfield}>
          <Text style={styles.btntext}>{item.count}</Text>
        </View>

      <TouchableOpacity style={styles.btn}>
      <Text style={styles.btntext} onPress={() => addOrder(item)}>+</Text>
      </TouchableOpacity>
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
        onValueChange={(value) => setPickValue(value)}
        style={styles.picker}
      >
        {Dishes.map((dish, index) => (
          <Picker.Item key={index} label={`${dish.getName()} - R$: ${dish.getPrice().toFixed(2)}`} value={dish.getName()} />
        ))}
      </Picker>
      <Button title="Adicionar" onPress={addItem} />
      <Text style={styles.selectedValue}>Items escolhidos:</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        testID="lista"
      />
      <Text style={styles.selectedValue}>Valor Total: R$ {totalOrder.toFixed(2)}</Text>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

// Restaurant Screen Component
function RestaurantScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(getOrders());
    const interval = setInterval(() => {
      setOrders(getOrders());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (id) => {
    updateOrderStatus(id);
    setOrders(getOrders());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurante - Gerenciamento de Pedidos</Text>
      {orders.map((order) => (
        <View key={order.id} style={styles.orderItem}>
          <Text style={styles.itemText}>{order.id}. {order.description}</Text>
          <Text style={styles.statusText}>Status: {order.status}</Text>
          {order.status !== 'Entregue' && (
            <TouchableOpacity style={styles.statusButton} onPress={() => handleStatusChange(order.id)}>
              <Text style={styles.statusButtonText}>Atualizar Status</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

// App Component with Navigation
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

// ------------------------------------------- Styles
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
    alignSelf: 'center', 
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
    backgroundColor: '#c9aba5',
    padding: 5,
    width: 300,
    height: 100,
  }, 
  item: { 
    marginVertical: 0, 
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 20,
  },
  btn:
  {
    backgroundColor: '#007bff', 
    width: 20,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 5, // Bordas arredondadas
    borderWidth: 1,
  },
  btntext:
  {
    fontSize: 16,
    alignSelf: 'center', 
  },
  textfield:
  {
    backgroundColor: '#007bff', 
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 5, // Bordas arredondadas
    borderWidth: 1,
  }
});
