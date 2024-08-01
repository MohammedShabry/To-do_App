import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';


import splashImage from '../assets/time-management-concept-illustration.png'; // Update the path if needed

const SplashScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleStart = () => {
    
    setLoading(true);

    // Add a delay before navigating to Home scree
    setTimeout(() => {
      navigation.replace('Home');
    }, 3000); 
  };

  return (
    <LinearGradient colors={['#b9fbc0', '#e0f7fa']} style={styles.container}>
      <Image source={splashImage} style={styles.image} />
      <Text style={styles.welcomeText}>Welcome to Go Task</Text>
      <Text style={styles.quote}>Every completed task is a building block in the foundation of your success, bringing you ever closer to achieving your long-term objectives.</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#004d40" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Let's Start</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d40',
    marginTop: 70,
    textAlign: 'center',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#004d40',
    marginTop: 10,
    textAlign: 'center',
  },
  startButton: {
    marginTop: 40,
    backgroundColor: '#00796b',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
