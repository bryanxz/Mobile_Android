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
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import App from './App.js';
import { createStackNavigator } from '@react-navigation/stack';
import { addOrder as backendAddOrder, getOrders, updateOrderStatus } from './ordersBackend';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Objects from './Objetcs';
import styles from './styles';

export default function Admscreen() {
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

        <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formRow}>
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
        </KeyboardAvoidingView>
        

        <TouchableOpacity style={styles.submitButton2} onPress={editingDish ? saveEditItem : addItem}>
          <Text style={styles.submitButtonText}>{editingDish ? "Salvar" : "Adicionar"}</Text>
        </TouchableOpacity>
        </View>
      </View>
  );
}