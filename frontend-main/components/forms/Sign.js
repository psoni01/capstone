import { Text, Box, VStack, Input, Button, TextInput } from 'native-base'
import axiosRequest from "../../config/axiosRequest"
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../../config/firebase'
import ip from '../../config/ip'
import { AuthContext } from '../../App'

const Sign = () => {

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [Cpassword, setCPassword] = useState('')
    const [signedUp, setSignedUp] = useState(false)
    const [matched, setMatched] = useState(false)

    const navigation = useNavigation();


    const { signUp } = React.useContext(AuthContext);

    const handleSignup = async () => {

       
            // await axiosRequest.post(`${ip}/postUser`, { "email": email, "password": password })

            // signUp({ email, password , name});
            navigation.navigate('Profile', { email: email, name: name, password: password });
        }

     





    return (
        <Box
        paddingTop={8}
           mt={70}
           width='100%'
display='flex'
ml={10}
            justifyContent="center" alignItems="center" >


            {/* <VStack  display='flex'  justifyContent="center" alignItems="center"  > */}
                <Text fontSize='20' bold >Sign Up</Text>
                
                <Box display='flex' padding={8}  >
                    <Text mb={2} fontWeight={600} fontSize={16}>Full Name</Text>
                    <Input
                        placeholder='Ex:John Smith'
                        value={name}
                        borderRadius={10}
                        width="100%"
                        backgroundColor="white"
                        borderColor='#0A5795'
                        onChangeText={text => setName(text)}
                    ></Input>
               
              


                    <Box>
                    <Text mb={2} fontWeight={600} fontSize={16} mt={5}>Email</Text>
                    <Input
                        placeholder='example@abc.com'
                        value={email}
                        borderRadius={10}
                        type="text"
                        borderColor='#0A5795'
                        width="100%"
                        backgroundColor="white"
                        onChangeText={text => setEmail(text)}
                    ></Input>
                    </Box>

                    <Box>
                    <Text mb={2} fontWeight={600} fontSize={16} mt={5}>Password</Text>
                    <Input
                        width="100%"
                        type="password"
                        backgroundColor="white"
                        placeholder='******'
                        secureTextEntry
                        borderColor='#0A5795'
                        onChangeText={text => setPassword(text)}
                        borderRadius={10}
                        value={password}
                    ></Input>
                </Box>

                <Box>
                    <Text fontWeight={600} fontSize={16} mb={2} mt={5}>Confirm Password</Text>
                    <Input
                        width="100%"
                        borderColor='#0A5795'
                       
                      
                        backgroundColor="white"
                        placeholder='******'
                        secureTextEntry
                        onChangeText={text => setCPassword(text)}
                        borderRadius={10}
                        value={Cpassword}
                    ></Input></Box>


                <Button marginTop={16} borderRadius={10} alignItems="center" onPress={handleSignup} backgroundColor='#0A5795'  borderWidth="1" borderColor="blue.600">
                    <Text color='white'fontWeight={600} fontSize={18}>Register</Text>
                    </Button>
                    <Text marginTop={10} fontWeight={300} fontSize={14} marginLeft={10}>Already have an account?<Text color='#0A5795' fontWeight={500} fontSize={14}> Login</Text></Text>
                {/* <Button alignItems="center" onPress={()=>navigation.navigate('Profile')} background="white" borderWidth="1" borderColor="blue.600"><Text color="blue.600">Navigate</Text></Button> */}
            {/* </VStack> */}
        </Box>

        </Box>

    )


}

export default Sign