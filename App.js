import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { addOrder as backendAddOrder, getOrders, updateOrderStatus } from './ordersBackend';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Objects from './Objetcs';

const Stack = createStackNavigator();

// Pratos padrão
const defaultDishes = [
  { name: 'Pastel de Frango', price: 5.50 },
  { name: 'Pastel de Carne', price: 6.20 },
  { name: 'Pastel de Queijo', price: 4.10 },
  { name: 'Pastel de Pizza', price: 7.70 },
  { name: 'Coca-cola', price: 7.70 },
];

const Tables = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
];

// Função para inicializar pratos padrão no AsyncStorage
const initializeDefaultDishes = async () => {
  try {
    const storedDishes = await AsyncStorage.getItem('dishes');
    if (!storedDishes) {
      await AsyncStorage.setItem('dishes', JSON.stringify(defaultDishes));
    }
  } catch (error) {
    console.error('Error initializing default dishes:', error);
  }
};

// Login Screen Component
function LoginScreen({ navigation }) {
  useEffect(() => {
    initializeDefaultDishes();
  }, []);

  const handleLogin = (userType) => {
    switch(userType) {
      case 'cliente':
        navigation.navigate('Customer');
        break;
      case 'restaurante':
        navigation.navigate('Restaurante');
        break;
      case 'administrador':
        navigation.navigate('administrador');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require('./assets/pastelarialogo.png')}
          style={styles.logo}
        />
        <TouchableOpacity style={styles.buttonlarge} onPress={() => handleLogin('cliente')} >
          <Text style={styles.submitButtonText}>Fazer Pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonlarge} onPress={() => handleLogin('restaurante')} >
          <Text style={styles.submitButtonText}>Acompanhar Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonlarge} onPress={() => handleLogin('administrador')} >
          <Text style={styles.submitButtonText}>Administrador</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Customer Screen Component
function CustomerScreen() {
  const [nome, setNome] = useState('');
  const [items, setItems] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [pickValue, setPickValue] = useState('');
  const [tableValue, setTablevalue] = useState(Tables[0]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [pedidoCompleto, setPedidoCompleto] = useState('');

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      const storedDishes = await AsyncStorage.getItem('dishes');
      if (storedDishes) {
        const parsedDishes = JSON.parse(storedDishes);
        setDishes(parsedDishes);
        if (parsedDishes.length > 0) {
          setPickValue(parsedDishes[0].name); // Inicializa a seleção com o primeiro prato
        }
      } else {
        // Se não há pratos salvos, inicializa com o padrão
        const initialDishes = defaultDishes.map(dish => ({ name: dish.name, price: dish.price }));
        setDishes(initialDishes);
        await AsyncStorage.setItem('dishes', JSON.stringify(initialDishes));
        if (initialDishes.length > 0) {
          setPickValue(initialDishes[0].name);
        }
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
    }
  };

  const addItem = () => {
    const currentItem = dishes.find(dish => dish.name === pickValue);
    if (currentItem) {
      const newItem = { title: currentItem.name, price: currentItem.price };
      addOrder(newItem);
    }
  };

  const addOrder = (item) => {
    setItems((prevOrders) => {
      const existingOrder = prevOrders.find(order => order.title === item.title);
      if (existingOrder) {
        const updatedOrders = prevOrders.map(order =>
          order.title === item.title
            ? { ...order, count: order.count + 1 }
            : order
        );
        calculateOrderDetails(updatedOrders);
        return updatedOrders;
      } else {
        const updatedOrders = [...prevOrders, { ...item, count: 1 }];
        calculateOrderDetails(updatedOrders);
        return updatedOrders;
      }
    });
  };

  const removeOrder = (item) => {
    setItems((prevOrders) => {
      const existingOrder = prevOrders.find(order => order.title === item.title);
      if (existingOrder && existingOrder.count > 1) {
        const updatedOrders = prevOrders.map(order =>
          order.title === item.title
            ? { ...order, count: order.count - 1 }
            : order
        );
        calculateOrderDetails(updatedOrders);
        return updatedOrders;
      } else {
        const updatedOrders = prevOrders.filter(order => order.title !== item.title);
        calculateOrderDetails(updatedOrders);
        return updatedOrders;
      }
    });
  };

  const calculateOrderDetails = (updatedItems) => {
    let total = 0;
    let completo = '';

    updatedItems.forEach((item) => {
      total += item.price * item.count;
      completo += `${item.title} x${item.count}, `;
    });

    setTotalOrder(total);
    setPedidoCompleto(completo.slice(0, -2));
  };

  const handleSubmit = () => {
    if (nome !== "") {
      if (items.length > 0) {
        const orderDescription = `Pedido de ${nome} mesa ${tableValue} - ${pedidoCompleto} - Total: R$${totalOrder.toFixed(2)}`;
        backendAddOrder(orderDescription); // Envia o pedido ao backend
        alert(`O pedido de ${nome} mesa ${tableValue} foi enviado: ${pedidoCompleto}`);
        resetOrder();
      } else {
        alert('Escolha seu pedido!');
      }
    } else {
      alert('Digite um nome!');
    }
  };

  const resetOrder = () => {
    setNome('');
    setItems([]);
    setTotalOrder(0);
    setPedidoCompleto('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={{ fontSize: 20, color: '#fff' }}>- {item.title}</Text>
      <View style={styles.btngroup}>
        <TouchableOpacity style={styles.btn} onPress={() => removeOrder(item)}>
          <Text style={styles.btntext}>-</Text>
        </TouchableOpacity>

        <View style={styles.textfield}>
          <Text style={styles.btntext}>{item.count}</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => addOrder(item)}>
          <Text style={styles.btntext}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Picker
          selectedValue={tableValue}
          onValueChange={(value) => setTablevalue(value)}
          style={styles.picker2}
        >
          {Tables.map((table, index) => (
            <Picker.Item key={index} label={`Mesa ${table}`} value={table} />
          ))}
        </Picker>

        <TextInput
          style={styles.input3}
          placeholder="Nome do cliente"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <Picker
        selectedValue={pickValue}
        onValueChange={(value) => setPickValue(value)}
        style={styles.picker3}
      >
        {dishes.map((dish, index) => (
          <Picker.Item key={index} label={`${dish.name} - R$: ${dish.price.toFixed(2)}`} value={dish.name} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.submitButton} onPress={addItem}>
        <Text style={styles.submitButtonText}>Adicionar</Text>
      </TouchableOpacity>

      <View style={{
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#530A0A',
        padding: 15,
        width: 300,
        height: '60%',
        borderRadius: 20,
        alignItems: 'center',
      }}>
        <Text style={styles.submitButtonText}>Lista de Itens</Text>
        <FlatList
          showsVerticalScrollIndicator={true}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.title}-${item.price}`}
          style={styles.list}
          testID="lista"
        />
        <Text style={styles.submitButtonText}>Valor Total: R$ {totalOrder.toFixed(2)}</Text>
      </View>

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
    setOrders(getOrders()); // Atualiza a lista de pedidos após a mudança de status
  };

  const renderOrder = ({ item }) => (
    <View key={item.id} style={styles.orderItem}>
      <Text style={styles.itemText}>{item.id}. {item.description}</Text>
      <Text style={styles.statusText}>Status: {item.status}</Text>
      {item.status !== 'Entregue' && (
        <TouchableOpacity style={styles.statusButton} onPress={() => handleStatusChange(item.id)}>
          <Image source={require('./assets/reloadicon.png')}
      style={ 
        {
          width: 50,
          height: 50,
        }}
      />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.restaurantcontainer}>
      <FlatList
      style={styles.list}
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()} // Gera uma chave única baseada no ID
        contentContainerStyle={{ paddingBottom: 20 }} // Espaço no final para facilitar a rolagem
      />
    </View>
  );
}

function Admscreen() {
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({ name: '', price: '' });
  const [editingDish, setEditingDish] = useState(null);

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      const storedDishes = await AsyncStorage.getItem('dishes');
      if (storedDishes) {
        setDishes(JSON.parse(storedDishes));
      } else {
        // Inicialize com pratos padrão se necessário
        setDishes([
          { name: 'Pastel de Frango', price: 5.50 },
          { name: 'Pastel de Carne', price: 6.20 },
          { name: 'Pastel de Queijo', price: 4.10 },
          { name: 'Pastel de Pizza', price: 7.70 },
          { name: 'Coca-cola', price: 7.70 },
        ]);
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
    }
  };

  const saveDishes = async (updatedDishes) => {
    try {
      await AsyncStorage.setItem('dishes', JSON.stringify(updatedDishes));
      setDishes(updatedDishes);
    } catch (error) {
      console.error('Error saving dishes:', error);
    }
  };

  // Função para remover o item
  const removeItem = (itemName) => {
    const updatedDishes = dishes.filter(item => item.name !== itemName);
    saveDishes(updatedDishes);
  };

  // Função para iniciar edição de um item
  const startEditItem = (item) => {
    setEditingDish({ ...item, price: item.price.toString() });
  };

  // Função para salvar edição de um item
  const saveEditItem = () => {
    if (editingDish) {
      const updatedDishes = dishes.map(item =>
        item.name === editingDish.name ? { name: editingDish.name, price: parseFloat(editingDish.price) } : item
      );
      saveDishes(updatedDishes);
      setEditingDish(null);
    }
  };

  // Função para adicionar novo item
  const addItem = () => {
    if (newDish.name && newDish.price) {
      const newItem = { name: newDish.name, price: parseFloat(newDish.price) };
      saveDishes([...dishes, newItem]);
      setNewDish({ name: '', price: '' });
    } else {
      alert('Preencha o nome e o preço do prato!');
    }
  };

  const renderItem = ({ item }) => (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 5,
      marginBottom: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 5,
    }}>
      <Text style={{fontSize: 15}}>{item.name} - R${item.price.toFixed(2)}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => removeItem(item.name)}>
          <Image source={require('./assets/dustbin.png')} style={{width: 20, height: 20}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => startEditItem(item)}>
          <Image source={require('./assets/pen.png')} style={{width: 20, height: 20}} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.editpanels}>
        <Text style={styles.submitButtonText}>Cardápio</Text>
        <FlatList
          showsVerticalScrollIndicator={true}
          data={dishes}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          style={styles.list}
          testID="lista"
        />
      </View>
    
      <View style={styles.editpanels2}>
        <Text style={styles.admscreenTitle}>
          {editingDish ? "Editar prato" : "Adicionar novo prato"}
        </Text>

        <View style={styles.formRow}>
          <TextInput
            style={styles.input2}
            placeholder="Nome do prato"
            value={editingDish ? editingDish.name : newDish.name}
            onChangeText={(text) => editingDish ? setEditingDish({...editingDish, name: text}) : setNewDish({...newDish, name: text})}
          />
          <TextInput
            style={styles.input2}
            placeholder="Preço do prato"
            value={editingDish ? editingDish.price : newDish.price}
            keyboardType="numeric"
            onChangeText={(text) => editingDish ? setEditingDish({...editingDish, price: text}) : setNewDish({...newDish, price: text})}
          />
        </View>
        

        <TouchableOpacity style={styles.submitButton} onPress={editingDish ? saveEditItem : addItem}>
          <Text style={styles.submitButtonText}>{editingDish ? "Salvar" : "Adicionar"}</Text>
        </TouchableOpacity>
        </View>
      </View>
  );
}

// App Component with Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" 
      screenOptions={{
        headerStyle: {backgroundColor: '#530A0A'},
        headerTintColor: '#fff'
      }}>
        <Stack.Screen 
          options={{ title: '' }} 
          name="Login" component={LoginScreen} />
        <Stack.Screen 
          options={{ title: 'Fazer Pedido' }}
          name="Customer" component={CustomerScreen} />
        <Stack.Screen 
          options={{ title: 'Acompanhar Pedidos' }}
          name="Restaurante" component={RestaurantScreen} />
        <Stack.Screen 
          options={{ title: 'Administrador' }}
          name="administrador" component={Admscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ------------------------------------------- Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 70,
    alignItems: 'center', 
    backgroundColor: '#F8C471',
  },

  restaurantcontainer: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#F8C471',
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
    backgroundColor: '#fff',
    width: 220,
  }, 
  input2: { 
    width: '80%', 
    padding: 10,
    borderWidth: 1, 
    borderColor: '#ccc', 
    marginBottom: 10, 
    borderRadius: 5, 
    backgroundColor: '#fff',
    width: 220,
  }, 
  input3: { 
    width: '80%', 
    height: 40,
    padding: 10,
    marginBottom: 10, 
    backgroundColor: '#fff',
    width: 220,
    
  }, 
  buttonlarge: { 
    marginBottom: 30,
    backgroundColor: '#530A0A',
    height: 50,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonmid: { 
    marginBottom: 40,
    backgroundColor: '#530A0A',
    height: 50,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: { 
    backgroundColor: '#464646', 
    padding: 10, 
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 20
  }, 
  submitButtonText: { 
    color: '#fff', 
    fontSize: 16,
    alignItems: 'center',
    fontWeight: 'bold',
  }, 
  orderItem: { 
    padding: 15, 
    borderWidth: 1, 
    borderRadius: 20, 
    marginBottom: 10, 
    width: '100%', 
    backgroundColor: '#530A0A',
    alignItems: 'center',
  }, 
  itemText: { 
    fontSize: 18, 
    color: '#fff',
  }, 
  statusText: { 
    marginVertical: 5, 
    fontSize: 16, 
    fontStyle: 'italic', 
    color: '#fff',
  }, 
  statusButton: {  
    padding: 10, 
    borderRadius: 5, 
    marginTop: 10, 
    width: 80,
  },
  statusButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    textAlign: 'center', 
  }, 
  picker: { 
    height: 40, 
    width: 300,
    backgroundColor: '#fff',
    padding: 10,
  },
  picker2: { 
    height: 40, 
    width: 150,
    backgroundColor: '#fff',
    padding: 10,
  },
  picker3: { 
    height: 40, 
    width: 370,
    backgroundColor: '#fff',
    padding: 10,
  },
  selectedValue: { 
    marginTop: 20, 
    fontSize: 18, 
  }, 
  list: { 
    padding: 5,
    width: '100%',
    height: 200, 
    borderRadius: 20,
    alignSelf: 'center',
  }, 
  item: { 
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 20,
    justifyContent: 'space-between',
    padding: 5,
    borderRadius: 10,
  },
  btn: {
    width: 20,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 5, 
    borderWidth: 1,
  },
  btntext: {
    fontSize: 16,
    alignSelf: 'center', 
  },
  textfield: {
    backgroundColor: '#e2e2e2',
    width: 40,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
  },
  logo: {
    marginVertical: 50,
    borderWidth: 2,
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: '#000000',
    alignSelf: 'center',
  },
  btngroup: {
    flexDirection: 'row',
  },
  editpanels: {
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#530A0A', 
    padding: 15,
    width: 300,
    height: '50%',
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20
  },

  editpanels2: {
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#530A0A', 
    padding: 15,
    width: 300,
    height: '40%',
    borderRadius: 20,
    alignItems: 'center',
  },
  // Adicionando estilo específico para o texto do título na Admscreen
  admscreenTitle: {
    padding: 10,
    fontSize: 18,
    color: '#F8C471', // Cor de fundo padrão
    fontWeight: 'bold',
    textAlign: 'center',
  },
});