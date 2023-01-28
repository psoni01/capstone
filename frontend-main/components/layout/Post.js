import { Text, View, Center, Box, Select, Modal,VStack,CheckIcon, FormControl, Input, Icon, Fab, Button, TextArea } from "native-base";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axiosRequest from "../../config/axiosRequest";
import ip from "../../config/ip";
import { auth } from "../../config/firebase";
import CameraScreen from "../screens/CameraScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Camera, CameraType } from 'expo-camera';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import * as FileSystem from 'expo-file-system';
import { Keyboard, TouchableOpacity, Image } from "react-native";
import { useToast } from "react-native-toast-notifications";
const Post = (props) => {
    // const route = useRoute();
    const { photoURI } = props;
    console.log(`image URI: ${photoURI}`);
    const toast = useToast();
    // const { imageURI } = route.params;
    const navigation = useNavigation();
    const [text, setText] = useState("");
    let imageURL = "";
    const [permission, requestPermission] = Camera.useCameraPermissions();
    // if (route.params?.imageURI) {
    //     // Post updated, do something with `route.params.post`
    //     // For example, send the post to the server
    //     console.log(route.params.imageURI);
    //     setPhotoURI(route.params.imageURI);
    //   }
   function displayToast() {
        toast.show(" Post has been created"),{type:  "success",
        placement: "bottom",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      };
      };
    async function savePost() {
        if (photoURI!=""){
        let fileString = await FileSystem.readAsStringAsync(photoURI, { encoding: FileSystem.EncodingType.Base64 });
        // let base64String = 'data:image/jpg;base64' + fileString;
        const fileName = uniqueNamesGenerator({
            dictionaries: [colors, adjectives, animals]
        }); // red_big_donkey
        const fileExtension = photoURI.substr(photoURI.lastIndexOf('.') + 1);
        console.log(`fileExtension: ${fileExtension}`);
        axiosRequest.post(`${ip}/postImage`, {
            key: `${fileName}.${fileExtension}`,
            data: fileString,
            contentType: fileExtension
        })
            .then(result => {
                axiosRequest.post(`${ip}/savePost`, {
                    email: auth.currentUser.email,
                    text: text,
                    images: result.data.data.Location
                }).then(async result => {
                    console.log("post saved successfully");
                    const connectionIDs = await axiosRequest.get(`${ip}/getConnections/${auth.currentUser.email}`);
                    console.log(`Connection ID: ${connectionIDs.data.data}`);
                    props.handlePosts();
                    displayToast();
                }).catch(e => console.log(e));
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            axiosRequest.post(`${ip}/savePost`, {
                email: auth.currentUser.email,
                text: text,
                images: "https://capstone-jigglypuff.s3.us-west-2.amazonaws.com/post.jpg"
            }).then(async result => {
                console.log("post saved successfully");
                const connectionIDs = await axiosRequest.get(`${ip}/getConnections/${auth.currentUser.email}`);
                console.log(`Connection ID: ${connectionIDs.data.data}`);
                props.handlePosts();
                displayToast();
            }).catch(e => console.log(e));
        }
    };
    function handleTakePhoto() {
        requestPermission();
        if (permission.granted) {
            navigation.navigate('CameraScreen');
        }
    }
    return (<>
        <Center  >
            <FormControl isRequired minWidth='80%'>
                <Box flexDirection='column'  flexDir={0} borderRadius={15} opacity={2} borderWidth={1.2} h={130} marginBottom={4}>
                    <TextArea
                        maxLength={120}
                        placeholder="Post Status..."
                        borderWidth={0}
                        paddingTop={2}
                        marginBottom={3}
                        onChangeText={(t) => setText(t)} >
                        {/* <Fab renderInPortal={false} shadow={2} size="sm" icon={<Icon color="white" as={Ionicons} name="attach" size="sm" />} /> */}
                    </TextArea>
                    <Box flexDirection='row' justifyContent='space-between' paddingRight={2}>
                        <Box ></Box>
                    {photoURI == "" ?
                        <TouchableOpacity onPress={handleTakePhoto} >
                            <Image source={require('../Icons/Snap.png')} alt="image"/>
                        </TouchableOpacity>
                        : <></>}
                    </Box>
                </Box>
                <Box flexDirection='row' justifyContent='space-between'>
                <Box></Box>
                <Button onPress={() => {
                    Keyboard.dismiss();
                    savePost();
                }}  borderRadius={11} backgroundColor="#0A5795"><Text fontSize={18} paddingLeft={7} paddingRight={7} color='white' marginTop={-1.5} marginBottom={-1.5}>Post</Text></Button>
                </Box>
            </FormControl>
        </Center>
    </>
    )
}
export default Post;