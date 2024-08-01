import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';

const Task = ({ task, onEdit, onDelete, onToggleComplete, getTimeRemaining }) => {
  const startTime = moment(task.startDate).format('h:mm A');
  const endTime = moment(task.endDate).format('h:mm A');

  return (
    <LinearGradient
      colors={['#ffffff', '#f9f9f9']}
      style={styles.taskContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.taskContent}>
        <View style={[styles.statusIndicator, { backgroundColor: task.completed ? '#4CAF50' : '#FFC107' }]}>
          <Icon name={task.completed ? 'check' : 'hourglass-start'} size={20} color="#fff" />
        </View>
        <View style={styles.taskDetails}>
          <Text style={task.completed ? styles.completed : styles.task}>
            {task.description}
          </Text>
          <Text style={styles.timeRange}>
            {startTime} - {endTime}
          </Text>
          <Text style={styles.timeRemaining}>
            {getTimeRemaining()}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Icon name="edit" size={18} color="#2196F3" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Icon name="trash" size={18} color="#F44336" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggleComplete} style={styles.actionButton}>
          <Icon name={task.completed ? 'undo' : 'check'} size={18} color={task.completed ? '#F44336' : '#4CAF50'} />
          <Text style={styles.actionText}>{task.completed ? 'Undo' : 'Complete'}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  taskDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  task: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  completed: {
    fontSize: 18,
    color: '#888',
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  timeRange: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  timeRemaining: {
    fontSize: 15,
    color: '#F44336',
  },
  actions: {
    flexDirection: 'row',
    justifyContent:'flex-end',
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    width: 60, 
  },
  actionText: {
    fontSize: 12, 
    color: '#2196F3',
    marginTop: 3, 
  },
});

export default Task;
