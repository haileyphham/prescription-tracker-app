import React, { useState, useContext } from 'react';
import { UserContext } from '@/components/components/UserContext'; 
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';  

export const LoginScreen = () => {
  const [name, setName] = useState<string>(''); 
  const [userId, setUserId] = useState<string>('');  
  const { setUser } = useContext(UserContext); 

  const handleLogin = () => {

    if (name && userId) {
      setUser({ id: userId, name });  
    } else {
      alert('Please enter both name and user ID.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your user ID"
          value={userId}
          onChangeText={setUserId}
        />
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#c1d5f7', 
    justifyContent: 'center', 
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#123d87',  
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF', 
    padding: 12,
    borderRadius: 18,
    marginBottom: 15,
    fontSize: 16,
    color: '#123d87', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#123d87', 
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF', 
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default LoginScreen;
