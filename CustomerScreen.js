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
  Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import App from './App.js';
import { createStackNavigator } from '@react-navigation/stack';
import { addOrder as backendAddOrder, getOrders, updateOrderStatus } from './ordersBackend';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Objects from './Objetcs';
import styles from './styles';

export default function CustomerScreen({ navigation }) {

  const defaultDishes = [
  { name: 'Pastel de Frango', price: 5.50 },
  { name: 'Pastel de Carne', price: 6.20 },
  { name: 'Pastel de Queijo', price: 4.10 },
  { name: 'Pastel de Pizza', price: 7.70 },
  { name: 'Caldo de Cana', price: 8.30 },
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
          setPickValue(parsedDishes[0].name);
        }
      } else {
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
        const orderDescription = `
          Pedido de: ${nome}z
          Mesa: ${tableValue}
          Itens: ${pedidoCompleto}
          Total: R$${totalOrder.toFixed(2)}
        `;
        backendAddOrder(orderDescription);
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
          style={Platform.OS === 'ios' ? styles.iosPicker : styles.picker2}
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
          keyboardType="default"
          returnKeyType="done" // Facilita a integração no iOS
        />
      </View>

      <Picker
        selectedValue={pickValue}
        onValueChange={(value) => setPickValue(value)}
        style={Platform.OS === 'ios' ? styles.iosPicker : styles.picker3}
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

