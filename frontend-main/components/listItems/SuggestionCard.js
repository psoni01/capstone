import axiosRequest from "../../config/axiosRequest";
import { Box, Button, Center, Divider, Heading, HStack, Image, Text, VStack, Pressable } from "native-base";
import { useEffect, useState, useCallback } from "react";
import ip from "../../config/ip";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import sendPushNotification from "../../config/notify";
import { auth } from "../../config/firebase";
import { TouchableOpacity, StyleSheet } from 'react-native'

const SuggestionCard = props => {
    const { id, email, name, skills, image } = props;
    const navigation = useNavigation();
    const [user, setUser] = useState({});
    const useremail = auth.currentUser.email;
    const [isConnection, setIsConnection] = useState(false);


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

            } else {
                setIsConnection(false)
            }
        }).catch(e => console.log(e));
    }

    // useEffect(() => {
    //     getUserDetails();
    // }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Do something when the screen blurs
            getUserDetails();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <Box backgroundColor='white' borderRadius={10} width={110} height={140} mt={3} mb={3} ml={2} mr={2} pt={5}>
            <HStack justifyContent='space-between' marginBottom={2}>
            <Box></Box>
            <TouchableOpacity >
                <Image source={require('../Icons/X.png')} width={2} height={2} marginRight={2.5} marginTop={-2} alt="icon" />
            </TouchableOpacity>
            </HStack>
            <Center>

                <Pressable onPress={() => navigation.navigate({ name: 'ConnectProfileScreen', params: { email: email, isConnection: isConnection }, merge: true })} >
                    <VStack >
                        <Center>
                            <Image source={{ uri: image }} width={12} mb={1} height={12} borderRadius={40} alt="icon" />
                            <Text fontSize={14} fontWeight='bold'>{name}</Text>
                            <Text marginLeft={1} fontSize={11}>{skills}</Text>
                        </Center>
                    </VStack>
                </Pressable>

            </Center>
        </Box>

    );
};

export default SuggestionCard;