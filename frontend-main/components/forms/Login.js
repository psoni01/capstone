


import { Text, Box, VStack, Input, Button, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Center } from 'native-base'
import { auth } from '../../config/firebase'
import { AuthContext } from '../../App'
import { useNavigation } from '@react-navigation/native'
import Gsignup from './Gsignup'


const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()


    const { signIn } = React.useContext(AuthContext);





    const handleLogin = () => {
        signIn({ email, password });

    };

    // const handleSignup = () => {
    //     auth
    //         .createUserWithEmailAndPassword(email, password)
    //         .then(userDetails => {
    //             const user = userDetails.user
    //             console.log('sign up', user.email)
    //         })
    //         .catch(error => alert(error.message))
    // };

    return (


        <Box
            paddingTop={70}
            display='flex'

            pl={20}
            justifyContent="center" alignItems="center" >


            <VStack >
                <Center> <Text mt={10} mb={10} fontSize={20} bold>Login</Text></Center>
                <Text fontSize={16} color='#0A5795' mb={2} fontWeight={700}>Email</Text>
                <Input
                    placeholder='Example@abc.com'
                    value={email}
                    borderColor='#0A5795'
                    borderRadius={10}
                    width="100%"
                    backgroundColor="white"
                    onChangeText={text => setEmail(text)}
                ></Input>

                <Box mt={5}>
                    <Text fontSize={16} color='#0A5795' mb={2} fontWeight={700}>Password</Text>
                    <Input
                        width="100%"
                        borderRadius={10}
                        mb={20}
                        borderColor='#0A5795'
                        backgroundColor="white"
                        placeholder='***********'
                        secureTextEntry
                        onChangeText={text => setPassword(text)}

                        value={password}
                    ></Input></Box>
                <Gsignup />
                <Button alignItems="center" onPress={handleLogin} backgroundColor="#0A5795" borderRadius={10} mb={5}><Text color="white">Login</Text></Button>
                <Box display='flex' flexDirection='row' justifyContent='center'><Text color='#0A5795' bold>_________</Text><Text color='#0A5795' bold mt={1}> or</Text><Text color='#0A5795' bold> _________</Text></Box>
                {/* <Button mt={7}>SignIn with Google</Button> */}
                <Center><Text mt={10} fontSize={14}>Don't have an account? <Text color='#0A5795' onPress={() => { navigation.navigate('Sign') }} >Sign Up</Text></Text> </Center>

                {/* <Button alignItems="center" onPress={()=>{navigation.navigate('Sign')}} background="white" borderWidth="1" borderColor="blue.600"><Text color="blue.600">Register</Text></Button> */}
            </VStack>
        </Box>

    )













}

export default Login