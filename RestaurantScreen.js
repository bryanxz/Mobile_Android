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
import CustomerScreen from './CustomerScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { addOrder as backendAddOrder, getOrders, updateOrderStatus } from './ordersBackend';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Objects from './Objetcs';
import styles from './styles';

export default function RestaurantScreen({ navigation }) {
  
  const [activeOrders, setActiveOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const allOrders = getOrders();
      const ongoingOrders = allOrders.filter(order => order.status !== 'Entregue');
      const completedOrders = allOrders.filter(order => order.status === 'Entregue');

      const renumberedActiveOrders = ongoingOrders.map((order, index) => ({
        ...order,
        displayId: index + 1,
      }));

      setActiveOrders(renumberedActiveOrders);
      setDeliveredOrders(completedOrders);
    };

    fetchData();
    const interval = setInterval(fetchData);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (id) => {
    updateOrderStatus(id);
    setActiveOrders(prevOrders => {
      const updatedActiveOrders = prevOrders.filter(order => order.id !== id);
      const updatedDeliveredOrders = [...deliveredOrders, ...prevOrders.filter(order => order.id === id)];

      setDeliveredOrders(updatedDeliveredOrders.map(order => ({ ...order, status: 'Entregue' })));
      return updatedActiveOrders.map((order, index) => ({
        ...order,
        displayId: index + 1,
      }));
    });
  };

  const renderOrder = ({ item }) => (
    <View key={item.id} style={styles.orderItem}>
      <Text style={styles.itemText}>
        {item.displayId}. {item.description}
      </Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status: {item.status}</Text>
        {item.status !== 'Entregue' && (
          <TouchableOpacity style={styles.statusButton} onPress={() => handleStatusChange(item.id)}>
            <Image
              source={require('./assets/reloadicon.png')}
              style={{ width: 25, height: 25 }} // Tamanho reduzido
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderDeliveredOrder = ({ item }) => (
    <View key={item.id} style={[styles.orderItem, styles.deliveredOrderItem]}>
      <Text style={styles.itemText}>
        {item.id}. {item.description}
      </Text>
      <Text style={styles.statusText}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.restaurantcontainer}>
      <Text style={styles.sectionTitle}>Pedidos Ativos</Text>
      <FlatList
        style={styles.list}
        data={activeOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Permite múltiplos cards por linha
        contentContainerStyle={{ paddingBottom: 5 }}
      />
      
      <Text style={styles.sectionTitle}>Pedidos Entregues</Text>
      <FlatList
        style={styles.list}
        data={deliveredOrders}
        renderItem={renderDeliveredOrder}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Permite múltiplos cards por linha
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
