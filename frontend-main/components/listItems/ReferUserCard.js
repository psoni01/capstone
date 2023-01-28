import axiosRequest from "../../config/axiosRequest";
import { Box, Button, Center, Divider, Heading, HStack, Image, Text, VStack, Pressable, Alert } from "native-base";
import { useEffect, useState, useCallback } from "react";
import ip from "../../config/ip";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import sendPushNotification from "../../config/notify";
import { auth } from "../../config/firebase";
import { TouchableOpacity, StyleSheet } from 'react-native'

const ReferUserCard = props => {
    const navigation = useNavigation();
    const { id, email, name, skills, expoToken, image, type, referID, selectedUsers, handleSelectedUsers } = props;
    const [user, setUser] = useState({});
    const useremail = auth.currentUser.email;


    function getUserDetails() {
        axiosRequest.post(`${ip}/getUser`, {
            email: useremail
        }).then(result => {
            setUser({ ...result.data })

        }).catch(e => console.log(e));
    }

    // async function sendReferral() {
    //     if (type == "user") {
    //         const userDetails = await axiosRequest.get(`${ip}/getUserByID/${referID}`);
    //         sendPushNotification(expoToken, title = `${user.name} refered you ${userDetails.data.name}`, body = "");
    //         await axiosRequest.post(`${ip}/postNotification`, { email: email, text: `${user.name} refered you ${userDetails.data.name}` });
    //         sendPushNotification(user.expoToken, title = `Refered to ${name}`, body = "");
    //     } else {
    //         const postDetails = await axiosRequest.get(`${ip}/post/${referID}`);
    //         const postUserDetails = await axiosRequest.post(`${ip}/getUser`, { email: postDetails.data.email });
    //         sendPushNotification(expoToken, title = `${user.name} refered you a post by ${postUserDetails.data.name}`, body = "");
    //         await axiosRequest.post(`${ip}/postNotification`, { email: email, text: `${user.name} refered you a post by ${postUserDetails.data.name}` });
    //         sendPushNotification(user.expoToken, title = `Refered a post to ${name}`, body = "");

    //     }
    // }


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
        <Box pb={3} pt={3} justifyContent='space-around' >
            {console.log(selectedUsers.toString())}
            <Center >
                <HStack justifyContent="space-between" width='90%'>
                    {selectedUsers.includes(id)?
                    <Pressable onPress={() => handleSelectedUsers(id)} >
                    <HStack   borderRadius={5} paddingTop={2} paddingBottom={2} paddingRight={150} width='300' paddingLeft={3}>
                        
                        <Image source={require('../Icons/Tick.png')} width={12} height={12} marginRight={10} borderRadius={40} marginTop={-0.5} alt="image" />
                        <VStack>
                        <Text fontSize={14} fontWeight='bold'>{name}</Text>
                        <Text marginLeft={1} fontSize={11}>{skills}</Text>
                        </VStack>
                    </HStack>
                </Pressable>
                 : 
                 <Pressable onPress={() => handleSelectedUsers(id)} >
                 <HStack paddingTop={2} paddingBottom={2} paddingLeft={3}>
                     <Image source={{ uri: image }} width={12} height={12} marginRight={10} borderRadius={40} marginTop={-0.5} alt="image" />
                     <VStack>
                     <Text fontSize={14} fontWeight='bold'>{name}</Text>
                     <Text marginLeft={1} fontSize={11}>{skills}</Text>
                     </VStack>
                 </HStack>
             </Pressable>
              
                 }
                    

                </HStack>
            </Center>
        </Box>

    );
};

export default ReferUserCard;