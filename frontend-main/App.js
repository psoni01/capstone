// import { Box, Text, View, title } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConnectProfileScreen from "./components/screens/ConnectProfileScreen";
import SetProfile from "./components/forms/SetProfile";
import UserProfile from "./components/screens/UserProfile";
import * as SecureStore from 'expo-secure-store';
import LoginContainer from './components/containers/LoginContainer';
import IndexScreen from './components/screens/IndexScreen';
import SplashScreen from './components/screens/SplashScreen';
import { auth , db} from './config/firebase';
import SearchScreen from './components/screens/SearchScreen';
import Chat from './components/tabs/Chat';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState, useRef } from 'react';
import {  Platform } from 'react-native';
import { onAuthStateChanged, signOut } from "firebase/auth";
import CameraScreen from "./components/screens/CameraScreen";
import * as React from "react";
import SignUpContainer from './components/containers/SignUpContainer';
import ConnectionCard from "./components/listItems/ConnectionCard";
import FriendsList from "./components/lists/FriendsList";
import ChatScreen from "./components/screens/ChatScreen";
// import axios from 'axios';
import axiosRequest from "./config/axiosRequest";
import ip from './config/ip';
import ReferScreen from "./components/screens/ReferScreen";
import UserPro from "./components/screens/UserPro";
import ReferUserScreen from "./components/screens/ReferUserScreen";
import ReferPostScreen from "./components/screens/ReferPostScreen";
import { LogBox } from "react-native";
import { ToastProvider } from 'react-native-toast-notifications'



// import { useNavigation, useRoute } from '@react-navigation/native';

export const AuthContext = React.createContext();
// SecureStore.deleteItemAsync('userToken');
const Stack = createNativeStackNavigator();

export default function App() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  LogBox.ignoreAllLogs();
  const responseListener = useRef();
 

// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs();//Ignore all log notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
 
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      try {
        // await SecureStore.setItemAsync('userToken', 'dummyToken');
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await SecureStore.getItemAsync("userToken");
        // if (userToken != null) {
        //   userToken
        // }
        console.log(userToken);
        userToken = null;
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }
      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };
    bootstrapAsync();
  }, []);
  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        let userToken;
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        await auth.signInWithEmailAndPassword(data.email, data.password);
       await  auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          // Send token to your backend via HTTPS
          // ...
        console.log(`firebase token : ${idToken}`);
        userToken = idToken;
        SecureStore.setItemAsync('userToken', idToken);
        }).catch(function(error) {
          // Handle error
        });
        // await SecureStore.setItemAsync('userToken', auth.currentUser.uid);
        await registerForPushNotificationsAsync(auth.currentUser.email);
        dispatch({ type: 'SIGN_IN', token: userToken });
      },
      signOut: async () => {
        await axiosRequest.patch(`${ip}/expoToken`, {email: auth.currentUser.email, token: ""});
        signOut(auth);
        await SecureStore.deleteItemAsync('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        let userToken;
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        const authUser = await auth.createUserWithEmailAndPassword(
          data.email,
          data.password
        );
        authUser.user.updateProfile({
          displayName: data.name,
        });

        await registerForPushNotificationsAsync(auth.currentUser.email);
        await auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          // Send token to your backend via HTTPS
          // ...
          userToken = idToken
        SecureStore.setItemAsync('userToken', idToken);
        }).catch(function(error) {
          // Handle error
        });
        dispatch({ type: "SIGN_IN", token: userToken });
      },
    }
  ));
  onAuthStateChanged(auth, async (user) => {
    const usr = await SecureStore.getItemAsync("userToken");
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // const uid = user.uid;
      // ...
      // setUserToken(user.uid);
      // React.useContext(AuthContext).signIn({user})
      console.log(`user found with token: ${usr}`);
    } else {
      // User is signed out
      // ...
      // setUserToken(null);
      // React.useContext(AuthContext).signOut();
      console.log(
        `This should not be logged if token null. no user found with token ${usr}`
      );
    }
  });
  registerForPushNotificationsAsync = async (useremail) => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      return;
      // alert('Must use physical device for Push Notifications');
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    await axiosRequest.patch(`${ip}/expoToken`, {email: useremail, token: token});
    return token;
  };
  return (
    <AuthContext.Provider value={authContext} >
      <NativeBaseProvider>
        <NavigationContainer>
          <ToastProvider>

         
          <Stack.Navigator>
            {state.isLoading ? (
              // We haven't finished checking for the token yet
              <Stack.Screen name="Splash" component={SplashScreen} />
            ) : state.userToken == null ? (
              <Stack.Group screenOptions={{ headerShown: false }}>

                  
                <Stack.Screen name="Login" component={LoginContainer} />
                <Stack.Screen name="Sign" component={SignUpContainer} />
                {/* <Stack.Screen name="Login" component={LoginContainer} /> */}
                {/* <Stack.Screen name="Sign" component={SignUpContainer} /> */}
                <Stack.Screen name="Profile" component={SetProfile} />

              </Stack.Group>
            ) : (
              // User is signed in
              <Stack.Group screenOptions={{ headerShown: true , headerBackTitleVisible: false}}>
                {/* <Stack.Screen name="Profile" component={SetProfile} /> */}
                <Stack.Screen name="Index" options= {( { headerShown:false})} component={IndexScreen} />
                <Stack.Screen
                  name="ConnectProfileScreen" options= {{title:'User Profile'}}
                  component={ConnectProfileScreen}
                />
                <Stack.Screen name="UserProfile" options= {{title:'Profile'}} component={UserPro} />
                <Stack.Screen name="FriendList" options= {{title:'Friends'}} component={FriendsList} />
                <Stack.Screen name="ChatScreen"   options= {({route})=>({title:route.params.name}) } component={ChatScreen} />
                <Stack.Screen name="SearchScreen" options= {{title:'Search'}} component={SearchScreen} />
                {/* <Stack.Screen name="XYZ" component={ConversationContainer} /> */}
                <Stack.Screen name="CameraScreen" component={CameraScreen} />
                <Stack.Screen name="Edit" options= {{title:'Edit'}} component={UserProfile} />
                <Stack.Screen name="ReferScreen"  options= {{title:'Refer'}} component={ReferScreen} />
                <Stack.Screen name="ReferUserScreen"  options= {{title:'Refer User'}}  component={ReferUserScreen} />
                <Stack.Screen name="ReferPostScreen" options= {{title:'Refer Post'}} component={ReferPostScreen} />

                <Stack.Screen
                  name="ConnectionCard" options= {({route})=>({title:route.params.type})}
                  component={ConnectionCard}
                />
              </Stack.Group>
            )}
          </Stack.Navigator>
          </ToastProvider>
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthContext.Provider>
  );
}