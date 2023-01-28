import { Text, Box, VStack, Input, Button, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { Center } from 'native-base'
import { useNavigation } from '@react-navigation/core'
import { auth } from '../../config/firebase'
import axiosRequest from "../../config/axiosRequest"
import ip from '../../config/ip'
import Notifications from '../lists/Notifications'
import Header from '../layout/Header'


const NotificationsTab = () => {
    

    return(

<Box backgroundColor='white' height='100%'>
  <Header/>
        <Box marginTop='5%'
        display='flex'
        justifyContent='center'
        alignItems='center'
        >
          <Notifications/>

</Box>
</Box>
            )
        }


export default NotificationsTab;