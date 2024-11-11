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
import RestaurantScreen from './RestaurantScreen';
import Admscreen from './Admscreen';
import { createStackNavigator } from '@react-navigation/stack';
import { addOrder as backendAddOrder, getOrders, updateOrderStatus } from './ordersBackend';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Objects from './Objetcs';
import styles from './styles';

const Stack = createStackNavigator();


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
          <Text style={styles.submitButtonText}>Anotar Pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonlarge} onPress={() => handleLogin('restaurante')} >
          <Text style={styles.submitButtonText}>Acompanhar Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonlarge} onPress={() => handleLogin('administrador')} >
          <Text style={styles.submitButtonText}>Cardápio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Customer Screen Component


// Restaurant Screen Component





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
          options={{ title: 'Anotar Pedido' }}
          name="Customer" component={CustomerScreen} />
        <Stack.Screen 
          options={{ title: 'Acompanhar Pedidos' }}
          name="Restaurante" component={RestaurantScreen} />
        <Stack.Screen 
          options={{ title: 'Cardápio' }}
          name="administrador" component={Admscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

