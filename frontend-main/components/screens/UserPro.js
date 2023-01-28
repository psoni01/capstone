
import { Text, Box, VStack, Input, Button, View, Pressable } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { Center } from 'native-base'
import { useNavigation } from '@react-navigation/core'
import { auth } from '../../config/firebase'
import axiosRequest from "../../config/axiosRequest"
import ip from '../../config/ip'
import Notifications from '../lists/Notifications'
import { AuthContext } from "../../App";
import Header from '../layout/Header'


const UserPro = () => {
 const[user,setUser]=useState("")
 const navigation = useNavigation();
 const { signOut } = React.useContext(AuthContext);


 useEffect(function getUserDetails() {
 axiosRequest
 .post(`${ip}/getUser`, { email: auth?.currentUser.email })
 .then((result) => {
 setUser({
 ...result.data,
 })
 })
 .catch((e) => console.log(e))
 }, [])

 return(


 <Box marginTop='20%'
 display='flex'
 justifyContent='center'
 alignItems='center'
 >


{user.image == undefined || user.image == null ? (
 
 <Image ml={5} mr={10} resizeMode="cover"
 source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" }}
 alt={user.image} style={{ width: 300, height: 300, borderRadius: 30 }} />
 
 
 ) : (
 <Image
 ml={5} mr={10}
 source={{ uri: user.image }}
 alt={user.image} style={{ width: 150, height: 150, borderRadius: 90 }}/>
 
 
 )}


 {/* <Image source={{
 uri: "https://wallpaperaccess.com/full/317501.jpg"
 }} alt="Alternate Text" size="xl" /> */}
 <Text mt={3} marginBottom={10} fontWeight={700} fontSize={16}>{user.name}</Text>
 <Text marginBottom={2} fontWeight={600} fontSize={14} onPress={() => navigation.navigate('Edit')}>Edit Profile</Text>
 <Text marginBottom={2} fontWeight={600} fontSize={14}>Your Status</Text>
 <Text fontWeight={600} fontSize={14}>Settings</Text>
 <Pressable onPress={signOut}>
 <Text marginTop='65%'fontWeight={600} fontSize={14} color='#0A5795'>Log Out <Image source={require('../Icons/Logout.png')} alt="icon"/></Text>
 </Pressable>
 </Box>
 
 )
 }


export default UserPro;