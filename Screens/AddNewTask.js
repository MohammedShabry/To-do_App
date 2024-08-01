import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';


import taskImage from '../assets/time-management-concept-illustration.png'; 

const AddNewTask = ({ route, navigation }) => {
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const { id } = route.params || {};

  useEffect(() => {
    const loadTask = async () => {
      if (id) {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];
        const task = tasks.find((t) => t.id === id);
        if (task) {
          setDescription(task.description);
          setStartDate(new Date(task.startDate));
          setEndDate(new Date(task.endDate));
        }
      }
    };
    loadTask();
  }, [id]);

  const handleConfirmStartDate = (date) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
  };

  const handleConfirmEndDate = (date) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
  };

  const saveTask = async () => {
    if (!description.trim()) return Alert.alert('Validation', 'Please enter a valid task description');

    const storedTasks = await AsyncStorage.getItem('tasks');
    let tasks = storedTasks ? JSON.parse(storedTasks) : [];
    if (id) {
      tasks = tasks.map((task) =>
        task.id === id
          ? { ...task, description, startDate: startDate.toISOString(), endDate: endDate.toISOString() }
          : task
      );
    } else {
      tasks.push({
        id: Date.now(),
        description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        completed: false,
      });
    }
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient colors={['#b9fbc0', '#e0f7fa']} style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color="#004d40" />
            </TouchableOpacity>
           
          </View>

         
          <Image source={taskImage} style={styles.image} />

          <LinearGradient colors={['#ffffff', '#e0f2f1']} style={styles.formContainer}>
            
            <LinearGradient colors={['#b2dfdb', '#ffffff']} style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter task"
                multiline
                numberOfLines={4}
              />
            </LinearGradient>

            <View style={styles.dateRow}>
              <View style={styles.dateContainer}>
                <Text style={styles.label}>Start Time:</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setStartDatePickerVisibility(true)}>
                  <Icon name="clock-o" size={20} color="#004d40" />
                  <Text style={styles.dateText}>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isStartDatePickerVisible}
                  mode="time"
                  date={startDate}
                  onConfirm={handleConfirmStartDate}
                  onCancel={() => setStartDatePickerVisibility(false)}
                />
              </View>

              <View style={styles.dateContainer}>
                <Text style={styles.label}>End Time:</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setEndDatePickerVisibility(true)}>
                  <Icon name="clock-o" size={20} color="#004d40" />
                  <Text style={styles.dateText}>{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isEndDatePickerVisible}
                  mode="time"
                  date={endDate}
                  onConfirm={handleConfirmEndDate}
                  onCancel={() => setEndDatePickerVisibility(false)}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButtonContainer} onPress={saveTask}>
              <LinearGradient colors={['#00796b', '#004d40']} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>{id ? 'Save Task' : 'Add Task'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d40',
    flex: 1,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d40',
    marginBottom: 5,
    paddingTop:10,
    paddingBottom:10
  },
  inputContainer: {
    borderRadius: 10,
    padding: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#004d40',
    elevation: 3,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateContainer: {
    flex: 1,
    marginHorizontal: 5,
    paddingBottom:10,
    paddingTop:10
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#004d40',
  },
  saveButtonContainer: {
    marginTop: 20,
  },
  saveButton: {
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default AddNewTask;
