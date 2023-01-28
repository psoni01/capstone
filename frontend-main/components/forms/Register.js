import {Text, Box,VStack,Input,Button,TextInput } from 'native-base'
import axios from  'axios'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../../config/firebase'
const Register = () => {
    const navigation=useNavigation()
    const [email,setEmail]=useState('')
    const [name,setName]=useState('')
    const [password,setPassword]=useState('')
    const [Cpassword,setCPassword]=useState('')
    const [signedUp,setSignedUp]=useState(false)
    const [matched,setMatched]=useState(false)

    const  handleSignup = async ()=>{
        
        try{
    const authUser=await auth.createUserWithEmailAndPassword(email,password);
    authUser.user.updateProfile({
  name:name
  
    })
    console.log(auth.currentUser?.email)
    const response= await axiosRequest.post("http://192.168.1.71:3000/postUser",{"email":email,"password":password})
    
    console.log(response.data)
   
    
    }
        
        catch(err){ 
    
          throw err.response;
    
        }
  
  
     
      }
    

    return(
        <Box
paddingTop={70}
pl={20}

justifyContent="center" alignItems="center" >


<VStack >
<Box width={200}>
    <Text>Full Name</Text>
    <Input
        placeholder='Name...'
        value={name}
        width="100%"
        backgroundColor="white"
        onChangeText={text => setName(text)}
    ></Input>
    </Box>



    <Box>
    <Text>Email</Text>
    <Input
        placeholder='Email'
        value={email}

        width="100%"
        backgroundColor="white"
        onChangeText={text => setEmail(text)}
    ></Input>
    </Box>
    <Box>
        <Text>Password</Text>
        <Input
            width="100%"
            
            backgroundColor="white"
            placeholder='Password'
            secureTextEntry
            onChangeText={text => setPassword(text)}

            value={password}
        ></Input>
        </Box>

    <Box>
        <Text>Confirm Password</Text>
        <Input
            width="100%"
           mb={20}
            backgroundColor="white"
            placeholder='confirm Password...'
            secureTextEntry
            onChangeText={text => setCPassword(text)}

            value={Cpassword}
        ></Input></Box>


<Button alignItems="center" onPress={()=>{handleSignup}} background="white" borderWidth="1" borderColor="blue.600"><Text color="blue.600">Register</Text></Button>

<Button alignItems="center" onPress={ navigation.navigate('Profile')} background="white" borderWidth="1" borderColor="blue.600"><Text color="blue.600">Navigate</Text></Button> </VStack>
</Box>



)
}

export default Register
