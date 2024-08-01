import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './Screens/HomeScreen';
import AddNewTask from './Screens/AddNewTask';
import SplashScreen from './Screens/SplashScreen';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tasks', headerShown: false }} />
        <Stack.Screen name="AddTask" component={AddNewTask} options={{ title: 'Add Task', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;
