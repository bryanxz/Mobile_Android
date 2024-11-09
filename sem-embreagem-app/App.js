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
import Objects from './Objetcs';

const Stack = createStackNavigator();

// Sample Dishes
const Dishes = [
  new Objects('Pastel de Frango', 5.50),
  new Objects('Pastel de Carne', 6.20),
  new Objects('Pastel de Queijo', 4.10),
  new Objects('Pastel de Pizza', 7.70),
  new Objects('Coca-cola', 7.70),
];

const Tables = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
];

// Login Screen Component
function LoginScreen({ navigation }) {
  const handleLogin = (userType) => {
    switch(userType)
    {
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

      <View >

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
  const [pickValue, setPickValue] = useState(Dishes[0].getName());
  const [tableValue, setTablevalue] = useState(Tables[0]);
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
  setItems((prevOrders) => {
    const existingOrder = prevOrders.find(order => order.title === item.title);
    if (existingOrder) {
      // Atualizar a quantidade do pedido existente
      const updatedOrders = prevOrders.map(order =>
        order.title === item.title
          ? { ...order, count: order.count + 1 }
          : order
      );
      calculateOrderDetails(updatedOrders); // Atualiza os detalhes do pedido
      return updatedOrders;
    } else {
      // Adicionar um novo pedido
      const updatedOrders = [...prevOrders, { ...item, count: 1 }];
      calculateOrderDetails(updatedOrders); // Atualiza os detalhes do pedido
      return updatedOrders;
    }
  });
};

  const removeOrder = (item) => {
  setItems((prevOrders) => {
    const existingOrder = prevOrders.find(order => order.title === item.title);
    if (existingOrder && existingOrder.count > 1) {
      // Diminuir a quantidade do pedido existente
      const updatedOrders = prevOrders.map(order =>
        order.title === item.title
          ? { ...order, count: order.count - 1 }
          : order
      );
      calculateOrderDetails(updatedOrders); // Atualiza os detalhes do pedido
      return updatedOrders;
    } else {
      // Remover o item se a quantidade for 1
      const updatedOrders = prevOrders.filter(order => order.title !== item.title);
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
        const orderDescription = `Pedido de ${nome} mesa ${tableValue} - ${pedidoCompleto} - Total: R$${totalOrder.toFixed(2)}`;
      backendAddOrder(orderDescription); // Envia o pedido ao backend
      alert(` O pedido de ${nome} mesa ${tableValue} foi enviado: ${pedidoCompleto}`);
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
      <Text style={{fontSize: 20, color: '#fff'}}>- {item.title}</Text>
      <View style={styles.btngroup}>
        <TouchableOpacity style={styles.btn} onPress={() => removeOrder(item)}>
      <Text style={styles.btntext} >-</Text>
      </TouchableOpacity>

        <View style={styles.textfield}>
          <Text style={styles.btntext}>{item.count}</Text>
        </View>

      <TouchableOpacity style={styles.btn } onPress={() => addOrder(item)}>
      <Text style={styles.btntext} >+</Text>
      </TouchableOpacity>
      </View>   
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={{flexDirection: 'row'}}>

      <Picker
        selectedValue={tableValue}
        onValueChange={(value) => setTablevalue(value)}
        style={{width: 80, marginBottom: 20, backgroundColor: '#fff', borderRadius: 5,}}
      >
        {Tables.map((table, index) => (
          <Picker.Item key={index} label={`Mesa ${table}`} value={table} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Nome do cliente"
        value={nome}
        onChangeText={setNome}
      />
      </View>

      <Picker
        selectedValue={pickValue}
        onValueChange={(value) => setPickValue(value)}
        style={styles.picker}
      >
        {Dishes.map((dish, index) => (
          <Picker.Item key={index} label={`${dish.getName()} - R$: ${dish.getPrice().toFixed(2)}`} value={dish.getName()} />
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
            keyExtractor={(item) => item.title + item.price} // Chave única
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

function Admscreen()
{
  const [dishes, setDishes] = useState(Dishes);

  // Função para remover o item
  const removeItem = (itemName) => {
    // Filtra os pratos removendo o que tem o nome igual ao itemName
    const updatedDishes = dishes.filter(item => item.getName() !== itemName);
    // Atualiza o estado com a nova lista de pratos
    setDishes(updatedDishes);
    console.log(updatedDishes); // Verifica o array atualizado no console
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
      <Text style={{fontSize: 15}}>{item.getName()} - R${item.getPrice().toFixed(2)}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{backgroundColor: '#fff', marginRight:2, borderRadius: 4, alignItems: 'center'}} onPress={() => removeItem(item.getName())}>
          <Image source={require('./assets/dustbin.png')}
      style={ 
        {
          width: 20,
          height: 20,
        }}
      />
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor: '#fff', marginLeft:2, borderRadius: 4, alignItems: 'center'}} onPress={() => removeItem(item.getName())}>
          <Image source={require('./assets/pen.png')}
      style={ 
        {
          width: 20,
          height: 20,
        }}
      />
        </TouchableOpacity>
      </View>

      
      
        
    </View>
  );
  
  return (
      <View style={styles.container}>
        <View style={styles.editpanels}>
            <Text style={styles.submitButtonText}>Cardapio</Text>
          <FlatList
            showsVerticalScrollIndicator={true}
            data={Dishes}
            renderItem={renderItem}
            keyExtractor={(item) => item.title + item.price} // Chave única
            style={styles.list}
            testID="lista"
          />
          <TouchableOpacity style={{
            backgroundColor: '#464646', 
          padding: 10, 
          borderRadius: 20,
          marginBottom: 20,
          marginTop: 20}}>
            <Text style={styles.submitButtonText}>Adicionar</Text>
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
      }}
      
      >
        <Stack.Screen 
        options={
          {
            title: '',
          }     
        }
        
        name="Login" component={LoginScreen} />
        <Stack.Screen 
        options={
          {
            title: 'Fazer Pedido',
          }
        }
         name="Customer" component={CustomerScreen} />
        <Stack.Screen 
        options={
          {
            title: 'Acompanhar Pedidos',
          }
        }
        name="Restaurante" component={RestaurantScreen} />

        <Stack.Screen 
        options={
          {
            title: 'Administrador',
          }
        }
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
  selectedValue: { 
    marginTop: 20, 
    fontSize: 18, 
  }, 
  list: { 
    padding: 5,
    width: 300,
    height: 100,
    borderRadius: 20,
    alignSelf:'center',
  }, 
  item: { 
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 20,
    justifyContent: 'space-between',
    padding: 5,
    borderRadius: 10,
  },
  btn:
  {
    backgroundColor: '#007bff', 
    width: 20,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 5, 
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
    width: 40,
    height: 30,
    backgroundColor: '#e2e2e2',
    borderRadius: 5, // Bordas arredondadas
    borderWidth: 1,
  },
  logo:
  {
    marginVertical: 50,
    borderWidth: 2,
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: '#000000',
    alignSelf: 'center',
  },
  btngroup:
  {
    flexDirection: 'row',
    
  },
  editpanels:
  {
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#530A0A', 
    padding: 15,
    width: 300,
    height: '40%',
    borderRadius: 20,
    alignItems: 'center',
  },
});
