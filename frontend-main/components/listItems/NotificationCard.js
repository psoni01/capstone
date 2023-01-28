import axiosRequest from "../../config/axiosRequest";
import { Box, Button, Center, Divider, Heading, HStack, Image, Text, VStack, Pressable } from "native-base";
import { useEffect, useState, useCallback } from "react";
import ip from "../../config/ip";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import sendPushNotification from "../../config/notify";
import { auth } from "../../config/firebase";

const NotificationCard = props => {

    const navigation = useNavigation();
    const { text, type, objectURI} = props;
    const [userData, setUserData] = useState({});

    function fetchUserData() {
        axiosRequest
          .get(`${ip}/getUserByID/${objectURI}`)
          .then((result) => {
            // console.log(result.data)
            setUserData({ ...result.data })
          })
          .catch((e) => console.log(e))
      }
    
      useEffect(() => {
        fetchUserData();
      }, [])
    
      useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        // Do something when the screen blurs
        fetchUserData();
      });
    
      return unsubscribe;
    }, [navigation]);


    return (
        <Box mb={5} >
            <Pressable onPress={async () => {
                switch (type) {
                    case "connection":
                        axiosRequest.get(`${ip}/getUserByID/${objectURI}`).then(result => {
                            // setUserData({...result.data.data});
                            // console.log(`objectURI: ${objectURI}`);
                            // console.log(`connections: ${result.data.connections}`);
                            axiosRequest.post(`${ip}/getUser`, { email: auth.currentUser.email }).then(

                                result2 => {
                                    // console.log(`connections: ${result2.data.connections}`);

                                    if (result2.data.connections.includes(objectURI)) {
                                        // console.log("true");
                                        navigation.navigate({
                                            name: 'ConnectProfileScreen',
                                            params: { email: result.data.email, isConnection: true },
                                            merge: true,
                                        });

                                    } else {
                                        // console.log("false")
                                        navigation.navigate({
                                            name: 'ConnectProfileScreen',
                                            params: { email: result.data.email, isConnection: false },
                                            merge: true,
                                        });

                                    }
                                }
                            )

                        });

                        break;
                    case "user":

                        axiosRequest.get(`${ip}/getUserByID/${objectURI}`).then(result => {
                            // setUserData({...result.data.data});
                            // console.log(`objectURI: ${objectURI}`);
                            // console.log(`connections: ${result.data.connections}`);

                            axiosRequest.post(`${ip}/getUser`, { email: auth.currentUser.email }).then(

                                result2 => {
                                    console.log(`connections: ${result2.data.connections}`);

                                    if (result2.data.connections.includes(objectURI)) {
                                        // console.log("true");
                                        navigation.navigate({
                                            name: 'ConnectProfileScreen',
                                            params: { email: result.data.email, isConnection: true },
                                            merge: true,
                                        });

                                    } else {
                                        // console.log("false")
                                        navigation.navigate({
                                            name: 'ConnectProfileScreen',
                                            params: { email: result.data.email, isConnection: false },
                                            merge: true,
                                        });

                                    }
                                }
                            )
                        });
                    default:
                        break;
                }
            }}>
                <HStack>
                    <Image source={{uri:userData.image}} width={12} height={12} mb={3} mt={3} ml={7} borderRadius={40} alt="image" />
                    <Text ml={10} marginTop={6} fontSize={14} mr={20}>{text}</Text>
                </HStack>
            </Pressable>
        </Box>
    );
};

export default NotificationCard;