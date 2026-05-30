import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {HomeScreen} from './screens/HomeScreen';
import {ReciteScreen} from './screens/ReciteScreen';
import {LibraryScreen} from './screens/LibraryScreen';
import {CircleScreen} from './screens/CircleScreen';
import {LeaderboardScreen} from './screens/LeaderboardScreen';
import {useAppStore} from './store/useAppStore';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 85,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#86868B',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24}}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: '诗词库',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24}}>📚</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Circle"
        component={CircleScreen}
        options={{
          tabBarLabel: '圈子',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24}}>👥</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: '排行',
          tabBarIcon: ({color}) => (
            <Text style={{fontSize: 24}}>🏆</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const {loadUserData} = useAppStore();

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Recite" component={ReciteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;