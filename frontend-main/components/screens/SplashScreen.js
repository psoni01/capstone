import { View, Text } from 'native-base';
import {  Box, VStack, Input, Button } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Center } from 'native-base'
import { auth } from '../../config/firebase'
import { AuthContext } from '../../App'
import { useNavigation } from '@react-navigation/native'
import { Image } from 'react-native'

const SplashScreen = () => {

    return (
        <Box
        paddingTop={70}
        
        pl={20}
        justifyContent="center" alignItems="center" >


        <VStack >
        <Image source={require('../images/Logo.png')} />
        <Text color='#FF3F03' fontSize={22}>Spread the art of helping</Text>
        <Button backgroundColor='#0A5795' mb={5} mt={20} borderRadius={10} >Sign Up</Button>
        <Button backgroundColor='#0A5795' borderRadius={10}  >Login</Button></VStack></Box>
    )
}

export default SplashScreen;