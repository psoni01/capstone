import axiosRequest from "../../config/axiosRequest";
import { Box, Button, Center, Divider, Heading, HStack, Image, Text, VStack, Pressable } from "native-base";
import { useEffect, useState, useCallback } from "react";
import ip from "../../config/ip";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import sendPushNotification from "../../config/notify";
import { auth } from "../../config/firebase";
import { TouchableOpacity, StyleSheet } from 'react-native'

const ConnectionUserCard = props => {

    const navigation = useNavigation();
    const { id, email, name, skills, image } = props;
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        axiosRequest.get(`${ip}/getConnections/${auth.currentUser.email}`).then(
            result => {
                // console.log(result.data.data);
                setConnections(result.data.data);
                // let temp = [];
                // console.log(`reuslt length: ${result.data.data.length}`);
                // if (result.data.data.length >= 1) {
                //     result.data.data.forEach(async element => {

                //         await axiosRequest.get(`${ip}/getUserByID/${element}`).then(
                //             result2 => {
                //                 temp = [...temp, result2.data];
                //                 setUsers([...temp]);
                //             }
                //         ).catch(err => console.log(err));
                //     });
                // }
            }
        ).catch(e => console.log(e));
    }, []);

    return (
        <Center  >
            <Box width='85%' borderWidth={1} borderRadius={15} pt={4} pb={5} mb={10} justifyContent='space-around' >
                <Center>

                    <HStack justifyContent="space-between" width='95%'>
                        <Pressable onPress={() => navigation.navigate({ name: 'ConnectProfileScreen', params: { email: email, isConnection: connections.includes(id) }, merge: true })} >
                            <HStack>
                                <Image source={{ uri: image }} width={12} height={12} marginRight={3} borderRadius={40} marginTop={-0.5} alt="image" />
                                <VStack>
                                    <Text paddingTop={1} fontSize={14} fontWeight='bold'>{name}</Text>
                                    <Text fontSize={11}>{skills}</Text>
                                </VStack>
                            </HStack>
                        </Pressable>
                        <Box flexDirection='row'>
                            <TouchableOpacity>
                                <Image source={require('../Icons/Chat.png')} width={6} height={5} marginTop={4} marginRight={2} marginLeft={2} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('../Icons/Refer.png')} width={7} height={5} marginTop={4} marginLeft={2} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require('../Icons/X.png')} width={2.5} height={2.5} marginTop={-2} />
                            </TouchableOpacity>
                        </Box>

                    </HStack>
                </Center>
            </Box>
        </Center>
    );
};

export default ConnectionUserCard;