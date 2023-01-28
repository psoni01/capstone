import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { HStack } from 'native-base'

import { useEffect } from 'react'
import { Button } from 'native-base';
import { auth } from '../../config/firebase'
import { FlatList, style, Box, Image, Input, Icon } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import axiosRequest from "../../config/axiosRequest"
import ip from '../../config/ip'
import { useNavigation } from '@react-navigation/native'
import Header from '../layout/Header'
// import useFloatingBottomTabBarHeight from '@react-navigation/bottom-tabs/lib/typescript/src/utils/useBottomTabBarHeight'




const FriendsList = () => {
   const useremail = auth.currentUser.email
   const navigation = useNavigation();
   const [searchText, setSearchText] = useState("");
   const [users, setUsers] = useState([])



   // useEffect(() => {
   //    async function getData() {

   //    getData();
   //  },[]);
  


   useEffect(
      () => {
         axiosRequest.get(`${ip}/getConnections/${auth.currentUser.email}`).then(
            result => {
               // console.log(result.data.data);

               let temp = [];
               // console.log(`reuslt length: ${result.data.data.length}`);
               if (result.data.data.length >= 1) {
                  result.data.data.forEach(async element => {

                     await axiosRequest.get(`${ip}/getUserByID/${element}`).then(
                        result2 => {
                           if ((searchText == "") || result2.data.name.includes(searchText)) {
                              temp = [...temp, result2.data]
                           }
                        }
                     ).catch(err => console.log(err));
                     console.log("result", users)

                     setUsers([...temp])

                  
                  }
                  )
               }
                  
               }).catch (e => console.log(e))},[searchText])
               


const RenderCard = ({ item }) => {
   return (


      <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { name: item.name, email: item.email })}>


           {console.log(item.image)}

         <Box padding={2} display='flex' flexDirection='row' alignItems="center" >
         
         
         {item.image == undefined || item.image == null || item.image=="" ? (
      
         <Image ml={5} mr={10} resizeMode="cover"
        source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" }}
        alt={{item}} style={{ width: 60, height: 60, borderRadius: 30 }} />
        
         
      ) : (
        <Image
        ml={5} mr={10}
        source={{ uri: item.image }}
        alt={{item}} style={{ width: 60, height: 60, borderRadius: 30 }} />
        
        
      )}
  <Text ml={10} mt={10}>{item.name}</Text>



         </Box>
      </TouchableOpacity>

   )
}


return (
   <Box>
      <Header/>
   <Box marginTop={5} marginLeft={2} marginBottom={10} >
      
      <Input placeholder="Search" variant="filled" width="100%" onChangeText={(text) => setSearchText(text)} borderRadius="10" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} placeholder='Search...' />} />
      {/* <SearchBar  marginTop={10} marginBottom={10} w='83%'  /> */}
      <Button marginTop={5} w='30%' marginBottom={5} >Search </Button>
      <FlatList data={users}
         renderItem={({ item }) => { return <RenderCard item={item}></RenderCard> }
         }
         keyExtractor={(item) => item.email} 
         
         >


      </FlatList>

   </Box>
   </Box>
)

}
export default FriendsList