import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// import { Button } from 'react-native';
import {Box,Text,Image,Button,Pressable} from'native-base'


// Initialize Firebase


WebBrowser.maybeCompleteAuthSession();

const Gsignup = () => {
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [message, setMessage] = React.useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    // androidClientId: "694235095257-fkbf1u81sm5ii76om74j5b7h8u4v2m7a.apps.googleusercontent.com",
    // iosClientId: "694235095257-qnub27n3o6s0e3lo1sneio03o6ka5k9m.apps.googleusercontent.com",
    expoClientId: "1087277579185-k8v1hqetu5e3dadni1p411plcm6mpf85.apps.googleusercontent.com"
  });
  // console.log(response,request)

  React.useEffect(() => {
    setMessage(JSON.stringify(response));
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      console.log(accessToken)
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}`}
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
      console.log(userInfo)
    });
  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <Box>
          <Image source={{uri: userInfo.picture}} alt="icon"/>
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </Box>
      );
    }
  }

  return (
    <Box>
      {showUserInfo()}


      <Box ml={5}>
      <Pressable onPress={accessToken ? getUserData : () => { promptAsync({ showInRecents: true}) }}>
        <Image source={require('../Icons/google.png') } alt="icon" width={10} marginLeft={75} height={10} ></Image>  
        </Pressable>    
      </Box> 
        
    </Box>
   

  );
}

export default Gsignup;