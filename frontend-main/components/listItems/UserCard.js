import axiosRequest from "../../config/axiosRequest";
import { Box, Button, Center, Divider, Heading, HStack, Image, Text, VStack, Pressable,Modal} from "native-base";
import { useEffect, useState, useCallback } from "react";
import ip from "../../config/ip";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import sendPushNotification from "../../config/notify";
import { auth } from "../../config/firebase";
import { TouchableOpacity, StyleSheet } from 'react-native'

const UserCard = props => {
    const navigation = useNavigation();
    const { id, email, name, skills , expoToken, image} = props;
    const [user, setUser] = useState({});
    const useremail = auth.currentUser.email;
    const [isConnection, setIsConnection] = useState(false);

    const [showModal, setShowModal] = useState(false);
  
  
    function modalClosed() {
      
      setShowModal(false);
  }
  


    

    function getUserDetails() {
        // setIsConnection(false)
        axiosRequest.post(`${ip}/getUser`, {
            email: useremail
        }).then(result => {
            setUser({ ...result.data })
            // console.log({...result.data})
            if (result.data.connections.includes(id)) {
            //    console.log(`something ${result.data.connections.includes(id)}`)
               setIsConnection(true);
               
            }else {
                    setIsConnection(false)
               }
        }).catch(e => console.log(e));
    }
    // function checkConnection() {

    //     axiosRequest.get(`${ip}/getConnections/${encodeURIComponent(useremail)}`).then(result => {
    //       // console.log(result.data.data[1]);
    //       console.log(`COnnections: ${result.data.data.toString()}`);
    //       if (result.data.data.includes(connectUserData._id)){
    //         setIsAlreadyConnection(true);
    //       }
    //     }).catch(e => console.log(e));
    //   }
  async  function addToConnection() {
        axios
            .patch(`${ip}/addConnectionToUser`, {
                useremail: useremail,
                connectionObjectID: id,
            })
            .then(async (data) => {
            //    const connectionExpoToken =  await axiosRequest.get(`${ip}/getExpoTokenByID/${id}`);
            //     console.log(`connectionExpoToken: ${connectionExpoToken.result.data}`);
            //    sendPushNotification(expoToken);
            const username =  await axiosRequest.post(`${ip}/getUser`, {email: user.email});
            // console.log(username);
               axiosRequest.post(`${ip}/postNotification`, {email: email, text: `${username.data.name} added you as a connection`});
               sendPushNotification(expoToken, title=`${username.data.name} added you as a connection`, body="");
              
               setIsConnection(true);
                // console.log(`isConnected ${isConnection}`)
            })
            .catch((e) => console.log(e));
            // console.log(`isConnected ${isConnection}`)
    }

    function removeFromConnection() {
        axios
            .patch(`${ip}/removeFromConnection`, {
                useremail: useremail,
                connectionObjectID: id,
            })
            .then((data) => {
                setIsConnection(false);

                // console.log(`isConnected ${isConnection}`)

            })
            .catch((e) => console.log(e));
            // console.log(`isConnected ${isConnection}`)
    }

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         // The screen is focused
    //         // Call any action
    //         console.log("i m here")
    //         getUserDetails();
    //     });

    //     // Return the function to unsubscribe from the event so it gets removed on unmount
    //     return unsubscribe;
    // }, [navigation]);

    useEffect(() => {
        getUserDetails();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        // Do something when the screen blurs
        getUserDetails();
      });
    
      return unsubscribe;
    }, [navigation]);

    return (
        
        <Box  pb={3} pt={3}  mb={5} justifyContent='space-around' >
            <Center >
            <HStack  justifyContent="space-between" width='90%'>
                <Pressable onPress={() => navigation.navigate({ name: 'ConnectProfileScreen', params: { email: email, isConnection: isConnection }, merge: true })} >
                <HStack>
                <Image source={{uri:image}} width={12} height={12} marginTop={-1} marginRight={4} borderRadius={40}  alt="icon"/>
                    <VStack>
                        <Text fontSize={14} fontWeight='bold'>{name}</Text>
                        <Text marginLeft={1} fontSize={11}>{skills}</Text>
                    </VStack>
                    </HStack>
                </Pressable>
                <Box flexDirection='row'>
                    <Box>
                    <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { name:name, email: email })}><Image source={require('../Icons/Chat.png')} width={5} height={5} marginTop={2} marginRight={5} marginLeft={2} alt="icon"/></TouchableOpacity>
                    </Box>
                {isConnection ? <>
            <TouchableOpacity onPress={()=>{setShowModal(true)}}><Image source={require('../Icons/ConnectNotSelect.png')} width={5} height={5} marginTop={2} marginLeft={2} tintColor='#E50101' alt="icon"/></TouchableOpacity></>
                    : <TouchableOpacity onPress={()=>{setShowModal(true)}} ><Image source={require('../Icons/AddConnection.png')} width={5} height={5} marginTop={2} marginLeft={2} alt="icon"/></TouchableOpacity>
                }
                </Box>
            </HStack>
            </Center>
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
              <Button width={20} ml={5} backgroundColor='#0A5795' borderRadius={13} marginRight={4} onPress={()=>{removeFromConnection();setShowModal(false)}}> Yes</Button>
              <Button backgroundColor='#0A5795' width={20} borderRadius={13} onPress={()=>{setShowModal(false)}}> No</Button>
              </Box> 
              </>:
              <>
                {console.log(isConnection)}
                  <Text ml={10} marginTop={3} marginBottom={3}>Do you want to Connect ?</Text>
                  <Box display='flex' flexDirection='row' justifyContent='space-between' marginLeft={25} marginTop={5} alignItems='center'>
                    <Button width={20} ml={5} backgroundColor='#0A5795' borderRadius={13} marginRight={4} onPress={()=>{addToConnection();setShowModal(false)}}> Yes</Button>
                    <Button backgroundColor='#0A5795' width={20} borderRadius={13} onPress={()=>{setShowModal(false)}}> No</Button>
                    </Box> 
                </>
                
           
            }
                </VStack>

                
                
            </VStack>



        </Modal.Body>

    </Modal.Content>
</Modal>
</Box>
                

    </Box>
        
    );
};

export default UserCard;