import axiosRequest from "../../config/axiosRequest"
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Image,
  Text,
  View,
  VStack,
} from 'native-base'
import { useEffect, useState } from 'react'
import ip from '../../config/ip'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { auth } from '../../config/firebase'

import { useRoute, useNavigation } from '@react-navigation/native';

const PostCard = (props) => {
  const { id, email, text, images,handlePosts , pinned} = props;
  const [user, setUser] = useState({});
  // const [isPinned, setIsPinned] = useState(false);
  const navigation = useNavigation();

  function getUserDetails() {
    axiosRequest.post(`${ip}/getUser`, { email: email })
      .then((result) => {
        setUser({
          ...result.data
        })
      })
      .catch((e) => console.log(e));
    // axiosRequest.get(`${ip}/getPinnedPosts/${auth.currentUser.email}`).then(
    //   result2 => {
    //     console.log(`id : ${id}`);
    //     console.log(`result2.data.data : ${result2.data.data}`);
    //     if (result2.data.data.includes(id)) {
    //       setIsPinned(true);
    //     } else {
    //       setIsPinned(false);
    //     }
    //   }
    // ).catch(err => console.log(err));
  }

  useEffect(() => {
    getUserDetails();
  }, [])


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        // Do something when the screen blurs
        getUserDetails();
        console.log(`Email : ${email}`);
    });

    return unsubscribe;
}, [navigation]);

  function handleDeleteButton() {
    axiosRequest.delete(`${ip}/post/${id}`).then(result => {
      console.log("deleted");
      handlePosts();
    }).catch(err => console.log(err));
  }

  async function handlePinButton() {
    // console.log("pin button tapped");
    const pinned = await axiosRequest.get(`${ip}/getPinnedPosts/${auth.currentUser.email}`);
    // console.log(`pinned: ${pinned.data.data}`);
    if (pinned.data.data != null) {
      if (pinned.data.data.includes(id)) {
        await axiosRequest.patch(`${ip}/removePinPost`, { postObjectID: id, useremail: auth.currentUser.email });
        // setIsPinned(false);
      } else {
        await axiosRequest.patch(`${ip}/pinPostToUser`, { postObjectID: id, useremail: auth.currentUser.email });
        // setIsPinned(true);
      }
    }
    handlePosts();
  }

  const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',

    },
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: { width: -1, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
  });

  return (
    <Box style={[styles.card, styles.shadowProp]} borderWidth={1} margin={4} borderRadius="20" pb={5} mb={8}>
      <VStack space={4} divider={<Divider />}>
        <Box>
          <Center>  
            <Box w="80%" marginBottom={6}>
              <Box flexDirection='row'>
                <Image source={{ uri: user.image }} width={12} height={12} marginTop={5} marginLeft={-2} borderRadius={40} alt="image" />
                <Box marginLeft={5} flexDirection='row' width='85%' justifyContent='space-between'>
                  <Text marginTop={8} marginBottom="5" fontWeight='semibold'>
                    {user.name}
                  </Text>
                  <Box flexDirection='row'>
                    {pinned ? <TouchableOpacity onPress={() => handlePinButton()}>
                      <Image source={require('../Icons/blueunpin.png')} width={5} height={5} marginTop={6} alt="icon"/>
                    </TouchableOpacity> : <TouchableOpacity onPress={() => handlePinButton()}>
                      <Image source={require('../Icons/Pin.png')} width={5} height={5} marginTop={6} alt="icon" />
                    </TouchableOpacity>}
                    <TouchableOpacity onPress={() => handleDeleteButton()}>
                      <Image source={require('../Icons/X.png')} width={3} height={3} marginTop={7} marginLeft={2} alt="icon" />
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>
              <Text ml={-2}marginTop={5}>{text}</Text>
            </Box>
          </Center>
          <Center>
            <Image alt="photo" source={{ uri: images }} resizeMode='cover'size="2xl" width='80%' borderRadius={10}  />
          </Center>
          <Center>
            <HStack
              paddingTop={5}
              marginTop={10}
              borderTopWidth={1.5}
              borderTopColor='gray.400'
              w="80%"
              justifyContent="space-between"
            >
              {/* {auth.currentUser.email==email?
              <Button backgroundColor="#0A5795" borderRadius={15} width="35%" onPress={()=> handleDeleteButton()}>
              <Box flexDirection='row'>
              <Text color="white" fontSize={18}>Remove</Text> <Image source={require('../Icons/Delete.png')} tintColor="white" marginTop={1} alt="icon"/>
              </Box>
              </Button>:<> */}
              <Button backgroundColor="#0A5795" borderRadius={15} width="35%">
                <Box flexDirection='row'>
                  <Text color="white" fontSize={18} onPress={() => navigation.navigate('ChatScreen', { name: user.name, email: email })}>Chat </Text> <Image source={require('../Icons/Chat.png')} tintColor="white" marginTop={1} alt="icon"/>
                </Box>
              </Button>
              <Button borderRadius={15} backgroundColor="#0A5795" width="35%" onPress={() => navigation.navigate('ReferPostScreen', { referID: id })}>
                <Box flexDirection='row'>
                  <Text color="white" fontSize={18}>Refer</Text> <Image source={require('../Icons/Refer.png')} tintColor="white" marginTop={1} alt="icon" />
                </Box>
              </Button>

            </HStack>
          </Center>
        </Box>
      </VStack>
    </Box>
  )
}

export default PostCard

