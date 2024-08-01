import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import TaskItem from './Task';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [searchVisible, setSearchVisible] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'));

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      setTasks(storedTasks ? JSON.parse(storedTasks) : []);
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  useEffect(() => {
    const applyFilters = () => {
      let filtered = tasks;

      if (filter === 'Completed') {
        filtered = filtered.filter(task => task.completed);
      } else if (filter === 'Pending') {
        filtered = filtered.filter(task => !task.completed);
      }

      filtered = filtered.filter(task =>
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      filtered.sort((a, b) => {
        const aTimeRemaining = moment(a.startDate).diff(moment());
        const bTimeRemaining = moment(b.startDate).diff(moment());
        return aTimeRemaining - bTimeRemaining;
      });

      setFilteredTasks(filtered);
    };

    applyFilters();
  }, [tasks, searchTerm, filter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format('HH:mm:ss'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            const newTasks = tasks.filter(task => task.id !== id);
            setTasks(newTasks);
            await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
          },
        },
      ]
    );
  };

  const toggleComplete = async (id) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const handleEdit = (id) => {
    navigation.navigate('AddTask', { id });
  };

  const getTimeUntilStart = (startDate) => {
    const now = moment();
    const start = moment(startDate);
    const duration = moment.duration(start.diff(now));

    if (duration.asMilliseconds() < 0) {
      return 'Overdue';
    }

    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours() % 24);
    const minutes = Math.floor(duration.minutes());

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m `;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m `;
    } else {
      return `${minutes}m `;
    }
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const incompleteTasksCount = tasks.length - completedTasksCount;

  const nextTask = tasks
    .filter(task => !task.completed && new Date(task.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  const nextTaskTimeLeft = nextTask ? getTimeUntilStart(nextTask.startDate) : '-';

  return (
    <LinearGradient
      colors={['#b9fbc0', '#e0f7fa']} 
      style={styles.container}
    >
      <Animated.View style={[styles.header, { transform: [{ translateY: scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -100],
        extrapolate: 'clamp'
      }) }] }]}>
        <View style={styles.headerContent}>
          <Text style={styles.date}>{moment().format('MMMM D, YYYY')}</Text>
          <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)} style={styles.searchIcon}>
            <Icon name="search" size={24} color="#00796b" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {searchVisible && (
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search tasks..."
          placeholderTextColor="#004d40"
        />
      )}

      <LinearGradient colors={['#a5d6a7', '#81c784']} style={styles.timeBox}>
        <Text style={styles.time}>{currentTime}</Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <LinearGradient colors={['#a5d6a7', '#81c784']} style={styles.statsCard}>
          <Text style={styles.statsTitle}>Completed</Text>
          <Text style={styles.statsCount}>{completedTasksCount}</Text>
        </LinearGradient>
        <LinearGradient colors={['#a5d6a7', '#81c784']} style={styles.statsCard}>
          <Text style={styles.statsTitle}>Pending</Text>
          <Text style={styles.statsCount}>{incompleteTasksCount}</Text>
        </LinearGradient>
        <LinearGradient colors={['#a5d6a7', '#81c784']} style={styles.statsCard}>
          <Text style={styles.statsTitle}>Next Task</Text>
          <Text style={styles.statsCount}>{nextTaskTimeLeft}</Text>
        </LinearGradient>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'All' && styles.activeFilter]}
          onPress={() => setFilter('All')}
        >
          <Text style={[styles.filterText, filter === 'All' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Completed' && styles.activeFilter]}
          onPress={() => setFilter('Completed')}
        >
          <Text style={[styles.filterText, filter === 'Completed' && styles.activeFilterText]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Pending' && styles.activeFilter]}
          onPress={() => setFilter('Pending')}
        >
          <Text style={[styles.filterText, filter === 'Pending' && styles.activeFilterText]}>
            Pending
          </Text>
        </TouchableOpacity>
      </View>

      {filteredTasks.length === 0 ? (
        <Text style={styles.noTasks}>No tasks available</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onEdit={() => handleEdit(item.id)}
              onDelete={() => handleDelete(item.id)}
              onToggleComplete={() => toggleComplete(item.id)}
              getTimeRemaining={() => getTimeUntilStart(item.startDate)}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTask')}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 19,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004d40',
  },
  searchIcon: {
    backgroundColor: '#b2dfdb',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  searchInput: {
    backgroundColor: '#e0f2f1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#004d40',
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  timeBox: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  time: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#004d40',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d40',
  },
  statsCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d40',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#a5d6a7',
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: '#00796b',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },
  noTasks: {
    fontSize: 16,
    color: '#004d40',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 35,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: '#00796b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default HomeScreen;

