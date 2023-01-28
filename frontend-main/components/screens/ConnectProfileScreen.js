import { View, Text, Button, HStack, VStack,Center, Box, Image, Modal,ScrollView } from 'native-base'
import React, { useState, useEffect } from 'react'
import axiosRequest from "../../config/axiosRequest"
import { auth } from '../../config/firebase';
import ip from '../../config/ip';

// import { VStack,HStack,Box,Modal,Button } from 'native-base';
import sendPushNotification from "../../config/notify";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native'
import Header from '../layout/Header';

const ConnectProfileScreen = (props) => {
  const route = useRoute()
  const connectUserEmail = route.params.email
  const [isConnection, setIsConnection] = useState(route.params.isConnection)
  const [connectUserData, setConnectUserData] = useState({})
  const user = auth.currentUser;
  const navigation = useNavigation();
  // console.log(user.email);
  const [showModal, setShowModal] = useState(false);
  function modalClosed() {
  
      setShowModal(false);
  }

  async function addToConnection() {
    axiosRequest
      .patch(`${ip}/addConnectionToUser`, {
        useremail: user.email,
        connectionObjectID: connectUserData._id,
      })
      .then(async (data) => {
        setIsConnection(true)
       
        const username = await axiosRequest.post(`${ip}/getUser`, { email: user.email });
        // console.log(username);
        axiosRequest.post(`${ip}/postNotification`, { email: connectUserData.email, text: `${username.data.name} added you as a connection`, type: "connection", objectURI: username.data._id });
        sendPushNotification(connectUserData.expoToken, title = `${username} added you as a connection`, body = "");
        // console.log(`isConnected 1 ${isConnection}`)
      })
      .catch((e) => console.log(e))

    // console.log(`isConnected 1 ${isConnection}`)
  }

  function removeFromConnection() {
    // console.log(`email ${user.email}`)

    // console.log(`connection ${connectUserData._id}`)
    axiosRequest
      .patch(`${ip}/removeFromConnection`, {
        useremail: user.email,
        connectionObjectID: connectUserData._id,
      })
      .then((data) => {
        setIsConnection(false)

        // console.log(`isConnected 1 ${isConnection}`)
      })
      .catch((e) => console.log(e))

    // console.log(`isConnected 1 ${isConnection}`)
  }

  function fetchUserData() {
    axiosRequest
      .post(`${ip}/getUser`, {
        email: connectUserEmail,
      })
      .then((result) => {
        // console.log(result.data)
        setConnectUserData({ ...result.data })
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    // Do something when the screen blurs
    fetchUserData()
  });

  return unsubscribe;
}, [navigation]);


  return (
    <ScrollView backgroundColor='white'>

      {/* <ProfileDetailsList data={data} /> */}
      {/* <Text onPress={fetchUserData}>Current User Email: {user.email}</Text> */}
      <Center>
        <Image source={{ uri: connectUserData.image }} marginTop={5} alt="image" width={150} height={150} borderRadius={400} />
        <Text marginTop={2} fontWeight='bold' fontSize={16}>{connectUserData.name}</Text>
        <HStack marginTop={5} w="60%" justifyContent="space-between">
          <Button backgroundColor="#0A5795" borderRadius={15} width="40%" onPress={() => navigation.navigate('ChatScreen', { name: connectUserData.name, email: connectUserData.email })}>
            <Box flexDirection='row' >
              <Text color="white" fontSize={18}>Chat</Text> <Image source={require('../Icons/Chat.png')} tintColor="white" marginTop={1} alt="icon" />
            </Box>
          </Button>
          <Button borderRadius={15} backgroundColor="#0A5795" width="40%" onPress={() => navigation.navigate('ReferUserScreen', { referID: connectUserData._id })}>
            <Box flexDirection='row'>
              <Text color="white" fontSize={18}>Refer</Text> <Image source={require('../Icons/Refer.png')} tintColor="white" marginTop={1} alt="icon" />
            </Box>
          </Button>
        </HStack>
        <Box w="80%" marginTop={5}>
          <HStack justifyContent={3} marginBottom={2} >
            <Box w="40%">
              <Text fontWeight='semibold'>Bio</Text>
            </Box>
            <Box w="50%">
              <Text>{connectUserData.bio} </Text>
            </Box>
          </HStack>
          <HStack justifyContent={3} marginBottom={2}>
            <Box w="40%">
              <Text fontWeight='semibold'>Age</Text>
            </Box>
            <Box w="50%">
              <Text>{connectUserData.age}</Text>
            </Box>
          </HStack>
          <HStack justifyContent={3} marginBottom={2}>
            <Box w="40%">
              <Text fontWeight='semibold'>Gender</Text>
            </Box>
            <Box w="50%">
              <Text>{connectUserData.gender}</Text>
            </Box>
          </HStack>
          <HStack justifyContent={3} marginBottom={2}>
            <Box w="40%">
              <Text fontWeight='semibold'>Category</Text>
            </Box>
            <Box w="50%">
              <Text>{connectUserData.skills}</Text>
            </Box>
          </HStack>
          <HStack justifyContent={3} marginBottom={2}>
            <Box w="40%">
              <Text fontWeight='semibold'>Education</Text>
            </Box>
            <Box w="50%">
              <Text>{connectUserData.education}</Text>
            </Box>
          </HStack>
          <HStack justifyContent={3} marginBottom={2}>
            <Box w="40%">
              <Text fontWeight='semibold'>Skills</Text>
            </Box>
            <Box w="50%">
              <Text>{connectUserData.skills}</Text>
            </Box>
          </HStack>
          <HStack justifyContent={3} marginBottom={2}>
            <Box w="40%">
              <Text fontWeight='semibold'>Intrests</Text>
            </Box>
            <Box w="50%">
              <Text>{connectUserData.interest}</Text>
            </Box>
          </HStack>
        </Box>
        {isConnection ? (
          <Button
            mt={5}
            width="40%"
            onPress={removeFromConnection}
            backgroundColor="#E50101" borderRadius={12}
            mb={5}
          >
            <Box flexDirection='row' >
              <Text color="white" fontSize={18} onPress={()=>{setShowModal(true)}}>Remove</Text> <Image source={require('../Icons/ConnectNotSelect.png')} tintColor="white" ml={3} marginTop={1.5} alt="icon" />
            </Box>
          </Button>
        ) : (
          <Button
            mt={5}
            width="40%"
            onPress={addToConnection}
            backgroundColor="#0A5795"
            borderRadius={12}
            mb={5}
          >
            <Box flexDirection='row' >
              <Text color="white" fontSize={18} onPress={()=>{setShowModal(true)}}>Connect</Text> <Image source={require('../Icons/AddConnection.png')} tintColor="white" ml={3} marginTop={1.5} alt="icon" />
            </Box>
          </Button>
        )}
        <Button mt={2} width="40%" backgroundColor="#E50101" borderRadius={12} mb={5}>
          <Box flexDirection='row' >
            <Text color="white" fontSize={18}>Block</Text> <Image source={require('../Icons/Block.png')} tintColor="white" marginTop={1.5} ml={3} alt="icon" />
          </Box>
        </Button>
        
        <Box>
    <Modal isOpen={showModal} onClose={modalClosed} >
    <Modal.Content maxWidth="400px" shadow='black' borderColor='#0A5795' borderWidth={1.5} borderRadius={15}>
        {/* <Modal.CloseButton /> */}
        
        <Modal.Body>
            <VStack space={2} mb={2} >
                <VStack alignItems="baseline">
                {isConnection ? <>
            <Text ml={10} marginTop={3} marginBottom={3}>Are you sure you want to remove ?</Text>
            <Box display='flex' flexDirection='row' justifyContent='space-between' marginLeft={25} marginTop={5} alignItems='center'>
              <Button width={20} ml={5} backgroundColor='#0A5795' marginRight={4} onPress={()=>{removeFromConnection();setShowModal(false)}}> Yes</Button>
              <Button backgroundColor='#0A5795' width={20} onPress={()=>{setShowModal(false)}}> No</Button>
              </Box> 
              </>:
              <>
                {console.log(isConnection)}
                  <Text ml={10} marginTop={3} marginBottom={3}>Do you want to Connect ?</Text>
                  <Box display='flex' flexDirection='row' justifyContent='space-between' marginLeft={25} marginTop={5} alignItems='center'>
                    <Button width={20} ml={5} backgroundColor='#0A5795' marginRight={4} onPress={()=>{addToConnection();setShowModal(false)}}> Yes</Button>
                    <Button backgroundColor='#0A5795' width={20} onPress={()=>{setShowModal(false)}}> No</Button>
                    </Box> 
                </>
                
           
            }
                </VStack>

                
                
            </VStack>



        </Modal.Body>

    </Modal.Content>
</Modal>
</Box>

      </Center>
    </ScrollView>
  )

}
export default ConnectProfileScreen