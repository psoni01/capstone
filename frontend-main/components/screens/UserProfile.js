import { View, FlatList } from "react-native";
import { Box, Button, Center, HStack, Image, Text } from "native-base";
import React, { useState, useEffect } from 'react'
import Header from "../layout/Header";
import Notifications from "../lists/Notifications";
import { useNavigation } from "@react-navigation/native";
import { auth } from '../../config/firebase'
import axiosRequest from "../../config/axiosRequest"
import ip from '../../config/ip'






const UserProfile = () => {
    const [user, setUser] = useState("")
    const navigation = useNavigation();


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



    // function fetchUserData() {
    //     axios
    //       .post(`${ip}/getUser`, {
    //         email: connectUserEmail,
    //       })
    //       .then((result) => {
    //         console.log(result.data)
    //         setConnectUserData({ ...result.data })
    //       })
    //       .catch((e) => console.log(e))
    //   }

    //   useEffect(() => {
    //     fetchUserData()
    //   }, [])
    return (
        <Box backgroundColor='white' height={900}>
            


                  

                    {/* <Box flex='1' width="100%" height="100%" padding={5} safeAreaTop={5} backgroundColor="white" flexDirection="column" > */}
                    <Box display='flex' flexDirection='row' justifyContent='space-evenly'><Image ml={20} mt={10} resizeMode="cover" alt={user.image} borderRadius={80} source={{ uri: user.image }} size='xl'/> </Box>
                    <Box mt={7} mb={10} display='flex' flexDirection='row' justifyContent='space-evenly'>
                          </Box>
                        {/* <Box display='flex' flexDirection='row' justifyContent="center" alignItems="center" ml={1} mt={2} mb={10}  > */}

                                      
                                     
                        
                            
                        <Box ml={5} flexDirection="column" display='flex'  > 

                            <Box display='flex' mb={5} flexDirection='row'><Text fontSize="sm" color='black' bold>Bio:</Text> <Box ml={9}><Text marginLeft={90} width='50%'  >{user.bio}</Text></Box></Box>
                            <Box display='flex' mb={5}  flexDirection='row' ><Text   bold>Gender:  </Text><Box ml={6}><Text marginLeft={70} >{user.gender}</Text></Box></Box>
                            <Box display='flex' mb={5}  flexDirection='row'><Text bold>Age:   </Text><Box ml={10}><Text marginLeft={70} > {user.age}</Text></Box></Box>
                            <Box display='flex'  mb={5} flexDirection='row'><Text bold>JobTitle:  </Text><Box ml={10}><Text marginLeft={50} > {user.jobTitle}</Text></Box></Box>
                            <Box display='flex' mb={5} flexDirection='row'><Text  bold>Education: </Text><Box ml={7}><Text marginLeft={47} >  {user.education}</Text></Box></Box>
                            <Box display='flex'mb={5}  flexDirection='row'><Text  bold>Category:    </Text><Box ml={10}><Text marginLeft={9} > {user.skills}</Text></Box></Box>
                            <Box display='flex' mb={5} flexDirection='row'><Text  bold>Interest: </Text><Box ml={10}><Text marginLeft={50} >  {user.interest}</Text></Box></Box>
                            {/* <Box display='flex'mb={5}  flexDirection='row'><Text  bold>Category: </Text><Box ml={10}><Text marginLeft={50} > {user.category}</Text></Box></Box> */}
                        </Box>
                        {/* <Box flex='1' flexDirection='column'><Button ml={125} width={90} mb={5} mt={7}>Remove</Button>
                            <Button ml={125} width={90}>Block</Button></Box> */}
                        {<Box flex='1' ml={40} backgroundColor='white' flexDirection='row'><Button ml={0} width={90} height={10}  mb={5} mt={8}>Update</Button>
                        </Box>
                        }
                  </Box> 
                    
                

                     
                      

                    // </Box>

                    )
                }
        export default UserProfile