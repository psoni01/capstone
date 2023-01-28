import { Box, Button, Center, FlatList, HStack, Image, Text, VStack } from "native-base";
import React, { useState, useEffect } from 'react'
import { auth } from './../../config/firebase';
import { useRoute, useNavigation } from "@react-navigation/native";
import ip from "../../config/ip";
import axiosRequest from "../../config/axiosRequest";
import ReferUserCard from "../listItems/ReferUserCard";
import sendPushNotification from "../../config/notify";

const ReferUserScreen = () => {

    const route = useRoute();
    const referID = route.params.referID;
    console.log(`referId: ${referID}`);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [referUser, setReferUser] = useState({});
    // const currentUser = axiosRequest.post(`${ip}/getUser`, {email: auth.currentUser.email}); 

    const navigation = useNavigation();
    useEffect(() => {
        axiosRequest.get(`${ip}/getUserByID/${referID}`).then(
            result => {
                setReferUser({ ...result.data });
            }
        ).catch(err => console.log(err));
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

    function handleDoneButton() {
        console.log(`refer to ${selectedUsers}`);
        users.forEach(async (item) => {
            if (selectedUsers.includes(item._id)) {
                console.log(currentUser.name);
                sendPushNotification(item.expoToken, `${referUser.name} referred by ${currentUser.name}`, "");
               await axiosRequest.post(`${ip}/postNotification`,
                    {
                        email: item.email,
                        text: `${referUser.name} referred by ${currentUser.name}`,
                        type: "user",
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
        <VStack backgroundColor='white' height="100%">
            <HStack justifyContent='space-between' marginTop={3}>
                <Button backgroundColor='#00000000' paddingBottom={0} paddingTop={0}  width={100} mb={5} onPress={() => handleDoneButton()}><Text color='orange.600'  fontSize={16}>Done</Text></Button>
                <Button backgroundColor='#00000000' paddingBottom={0} paddingTop={0}  width={100} mb={5} onPress={() => navigation.goBack()}><Text color='orange.600' fontSize={16}>Cancel</Text></Button>
            </HStack>
            <VStack>

                <FlatList
                    data={users}
                    renderItem={({ item }) => (
                        <ReferUserCard
                            id={item._id}
                            email={item.email}
                            name={item.name}
                            skills={item.skills}
                            expoToken={item.expoToken}
                            image={item.image}
                            referID={referID}
                            selectedUsers={selectedUsers}
                            handleSelectedUsers={handleSelectedUsers}
                        />
                    )} />

            </VStack>
        </VStack>
    )
}



export default ReferUserScreen