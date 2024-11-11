import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding:20,
    alignItems: 'center', 
    backgroundColor: '#F8C471',
  },

  restaurantcontainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8C471',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
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
  iosPicker: {
    height: 50,
    width: 150,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  input3: { 
    width: '80%', 
    height: Platform.OS === 'android' ? 53 : 40, 
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
  submitButton2: { 
    backgroundColor: '#464646', 
    padding: 10, 
    borderRadius: 20,
    marginBottom: 0,
    marginTop: 5
  }, 
  submitButtonText: { 
    color: '#fff', 
    fontSize: 16,
    alignItems: 'center',
    fontWeight: 'bold',
  }, 
    orderItem: {
    flex: 1, // Permite que o card cresça de acordo com a largura disponível
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    margin: 5,
    backgroundColor: '#530A0A',
    alignItems: 'flex-start',
    maxWidth: '48%', // Para evitar cards muito largos
  },

  statusContainer: {
    flexDirection: 'row', // Alinha texto e botão lado a lado
    alignItems: 'center',
    justifyContent: 'space-between', // Espaço entre texto e botão
    width: '100%',
  },

  deliveredOrderItem: {
    backgroundColor: '#464646',
  },
  itemText: { 
    fontSize: 10, 
    color: '#fff',
    fontWeight: 'bold'
  }, 
   statusText: { 
    marginVertical: 5, 
    fontSize: 13, // Aumentar tamanho para dar destaque
    fontStyle: 'italic', 
    color: '#FFDD44', // Cor diferente para destacar o status
    fontWeight: 'bold',
  }, 
  statusButton: {  
    padding: 0, 
    borderRadius: 5, 
    marginTop: 0, 
    width: 80,
  },
   orderDescription: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
    alignItems: 'flex-start', // Alinhar texto à esquerda
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
    height: Platform.OS === 'android' ? 10 : 40, 
    width: 150,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
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
    flexDirection: 'columns',
  },

  admscreenTitle: {
    padding: 10,
    fontSize: 18,
    color: '#F8C471', // Cor de fundo padrão
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formRow:
  {
      
  },
});

export default styles;