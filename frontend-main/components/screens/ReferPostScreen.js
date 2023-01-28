import { Box, Button, Center, FlatList, HStack, Image, Text, VStack ,Modal} from "native-base";
import React, { useState, useEffect } from 'react'
import { auth } from './../../config/firebase';
import { useRoute, useNavigation } from "@react-navigation/native";
import ip from "../../config/ip";
import axiosRequest from "../../config/axiosRequest";
import ReferUserCard from "../listItems/ReferUserCard";
import ReferPostCard from "../listItems/ReferPostCard";
import sendPushNotification from "../../config/notify";
// import { useNavigation } from '@react-navigation/native';
const ReferPostScreen = () => {

    const route = useRoute();
    const referID = route.params.referID;
    console.log(`referId: ${referID}`);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [name, setName] = useState("");
    function modalClosed() {
    
        setShowModal(false);
    }
    const [currentUser, setCurrentUser] = useState({});
    const [referPost, setReferPost] = useState({});
    const [referPostUser, setReferPostUser] = useState({});

    // const currentUser = axiosRequest.post(`${ip}/getUser`, {email: auth.currentUser.email}); 
    const [showModal, setShowModal] = useState(false);
    function modalClosed() {
    
        setShowModal(false);
    }
    const navigation = useNavigation();
    useEffect(() => {
        axiosRequest.get(`${ip}/posts/${referID}`).then(
            result => {
                console.log(`result: ${result.data}`);
                setReferPost({ ...result.data });
                console.log(`email: ${result.data.email}`);
                axiosRequest.post(`${ip}/getUser`, { email: result.data.email }).then(
                    result2 => setReferPostUser({ ...result2.data })
                ).catch(err2 => console.log(err2));
            }
        ).catch(err => console.log(err));
        // axiosRequest.post(`${ip}/getUser`, { email: referPostUser.data.email }).then(
        //     result => setReferPostUser({ ...result.data })
        // ).catch(err => console.log(err));
        axiosRequest.post(`${ip}/getUser`, { email: auth.currentUser.email }).then(
            results => {
                setCurrentUser({ ...results.data });
            }
        ).catch(err => console.log(err));
        axiosRequest.get(`${ip}/getConnections/${auth.currentUser.email}`).then(
            result => {
                // console.log(result.data.data);

                let temp = [];
                // console.log(`reuslt length: ${result.data.data.length}`);
                if (result.data.data.length >= 1) {
                    result.data.data.forEach(async element => {

                        await axiosRequest.get(`${ip}/getUserByID/${element}`).then(
                            result2 => {
                                temp = [...temp, result2.data];
                                setUsers([...temp]);
                            }
                        ).catch(err => console.log(err));
                    });
                }
            }
        ).catch(e => console.log(e));
    }, []);

    function handleSelectedUsers(id) {
        console.log("here");
        if (selectedUsers.includes(id)) {
            console.log("true");
            const temp = selectedUsers.filter(item => item != id);
            setSelectedUsers([...temp]);
        } else {
            console.log("false");
            const temp = [...selectedUsers, id]
            setSelectedUsers([...temp]);
        }
    }

    function handleUser(name) {
        setName(name)


    }
    function handleDoneButton() {
        console.log(`refer to ${selectedUsers}`);
        users.forEach(async (item) => {
            if (selectedUsers.includes(item._id)) {
                console.log(currentUser.name);
                sendPushNotification(item.expoToken, `${currentUser.name} refers you a post`, "");
                await axiosRequest.post(`${ip}/postNotification`,
                    {
                        email: item.email,
                        text: `${currentUser.name} refers you a post`,
                        type: "post",
                        objectURI: `${referID}`
                    }).then(
                        result => {
                            console.log("notification posted");
                        }
                    ).catch(err => console.log(err));
            }
        });
        sendPushNotification(currentUser.expoToken, `Referral sent`, "");
        // navigation.goBack();
    }

    return (
        <>
            <VStack backgroundColor='white' height="100%">
                <HStack justifyContent='space-between' marginTop={3}>
                    <Button backgroundColor='#00000000' paddingBottom={0} paddingTop={0} width={100} mb={5} onPress={() => { handleDoneButton();setShowModal(true) }}><Text color='orange.600' fontSize={16}>Done</Text></Button>
                    <Button backgroundColor='#00000000' paddingBottom={0} paddingTop={0} width={100} mb={5} onPress={() => navigation.goBack()}><Text color='orange.600' fontSize={16}>Cancel</Text></Button>
                </HStack>
                <VStack>

                    <FlatList
                        data={users}
                        renderItem={({ item }) => (
                            
                            <ReferPostCard

                                id={item._id}
                                email={item.email}
                                name={item.name}
                                skills={item.skills}
                                expoToken={item.expoToken}
                                image={item.image}
                                referID={referID}
                                selectedUsers={selectedUsers}
                                handleSelectedUsers={handleSelectedUsers}
                                handleUser={handleUser}
                            />
                        )} />

                </VStack>
            </VStack>
            <Box>
                <Modal isOpen={showModal} onClose={modalClosed} >
                    <Modal.Content maxWidth="400px" shadow='black' borderColor='#0A5795' borderWidth={1.5} borderRadius={15}>
                        {/* <Modal.CloseButton /> */}

                        <Modal.Body>
                            <VStack space={2} mb={2} >
                            
                                
                                  <Center>
                                        <Text  marginTop={3} marginBottom={10}>{name} has been referred</Text>
                                        <Button width={20} backgroundColor='#0A5795' borderRadius={13}  onPress={() => { setShowModal(false) }}> Ok</Button>    
                                    </Center>
                               
                               
                                </VStack>

                           
                        </Modal.Body>

                    </Modal.Content>
                </Modal>
            </Box>
        </>
    )
}



export default ReferPostScreen