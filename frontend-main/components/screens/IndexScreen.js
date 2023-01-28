import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Home from '../tabs/Home';
import Connection from '../tabs/Connection';
import Chat from '../tabs/Chat';
import NotificationsTab from '../tabs/NotificationsTab';
import { VStack , Icon, Image, Text} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ConnectProfileScreen from './ConnectProfileScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FriendsList from '../lists/FriendsList';

import Ionicons from '@expo/vector-icons/Ionicons';
import SplashScreen from './SplashScreen';
const Tab = createBottomTabNavigator();
 

 const IndexScreen = () =>  {

  return (
    

    <Tab.Navigator screenOptions={{headerShown: false}} 
    
    tabBarOptions={{
      labelStyle: { 
        fontSize: 10,
        margin: 0,
        padding: 0  ,
      },
  }}
    >


      <Tab.Screen name="Home" component={Home} 
  
  options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (focused ? <Image source={require('../Icons/HomeChecked.png')} marginTop={3}  alt="icon" /> : <Image source={require('../Icons/Home.png')} marginTop={3}  alt="icon" />
          ),
        }}/>
      <Tab.Screen name="Connection" component={Connection} options={{
          tabBarLabel: 'Connection',
          tabBarIcon: ({focused}) => (focused ? <Image source={require('../Icons/ConnectChecked.png')} marginTop={3}  alt="icon" /> : <Image source={require('../Icons/ConnectNotSelect.png')} marginTop={3}  alt="icon" />
          ),
        }}/>
      <Tab.Screen  name="Chat" component={FriendsList} options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({focused}) => (focused ? <Image source={require('../Icons/ChatChecked.png')} marginTop={3}  alt="icon" /> : <Image source={require('../Icons/Chat.png')} marginTop={3}     alt="icon" />
          ),
        }}/>
      <Tab.Screen name="Notification" component={NotificationsTab} options={{
          tabBarLabel: 'Notification',
          tabBarIcon: ({focused}) => (focused ? <Image source={require('../Icons/BellChecked.png')} marginTop={3}  alt="icon" /> :
            <Image source={require('../Icons/Notifications.png')} marginTop={3}    alt="icon" />
          ),
        }}/>
       
    </Tab.Navigator>
  );
}

export default IndexScreen;