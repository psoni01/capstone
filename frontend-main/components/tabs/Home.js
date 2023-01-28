

import { Text, View, Center, Box, Select, CheckIcon, HStack, Icon, VStack, Button, ScrollView, Heading } from "native-base";
import SearchBar from "../layout/SearchBar";
import Ionicons from '@expo/vector-icons/Ionicons';
import Post from "../layout/Post";
import Header from "../layout/Header";
import Posts from "../lists/Posts";
// import axiosRequest from "../../config/axiosRequest";
import ip from "../../config/ip";
import { useEffect, useState, useCallback } from "react";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React from 'react';
import { RefreshControl } from 'react-native';
import { auth } from "../../config/firebase";
import Suggestions from "../lists/Suggestions";
import axiosRequest from "../../config/axiosRequest";



const Home = () => {
    // const userToken = await SecureStore.getItemAsync("userToken");
    const navigation = useNavigation()
    const [posts, setPosts] = useState([]);
    const [pinnedPosts, setPinnedPosts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [photoURI, setPhotoURI] = useState("");
    const route = useRoute();
    function handleSearchText(text) {
        setSearchText(text);
    }


    useEffect(() => {
        if (route.params?.imageURI) {
            // Post updated, do something with `route.params.post`
            // For example, send the post to the server
            console.log(`inside home data uri: ${route.params.imageURI}`)
            setPhotoURI(route.params.imageURI);
        }
    }, [route.params?.imageURI]);

    // useEffect(
    // () => navigation.addListener('focus', () => {
    // if (route.params?.imageURI) {
    // // Post updated, do something with `route.params.post`
    // // For example, send the post to the server
    // console.log(route.params?.imageURI);
    // setPhotoURI(route.params.imageURI);

    // alert('Screen was focused');
    // }
    // }),
    // []
    // );


    // useFocusEffect(
    // useCallback(() => {
    // // Do something when the screen is focused
    // if (route.params?.imageURI) {
    // // Post updated, do something with `route.params.post`
    // // For example, send the post to the server
    // console.log(route.params.imageURI);
    // setPhotoURI(route.params.imageURI);

    // }
    // return () => {
    // // Do something when the screen is unfocused
    // // Useful for cleanup functions
    // };
    // }, []));


    function handlePostsOnNavigation() {
        setPosts([]);
        setPinnedPosts([]);
        axiosRequest.get(`${ip}/posts`).then(async result => {
            let temp = [...result.data];
            let pinned = [];
            let notPinned = [];
            await axiosRequest.get(`${ip}/getPinnedPosts/${auth.currentUser.email}`).then(
                result2 => {
                    result.data.forEach(element => {
                            // console.log(`element id : ${element._id}`);
                        
                            if(result2.data.data.includes(element._id)){
                                // console.log(`true ${element._id}`);
                                pinned.push(element);
                            } else {
                                // console.log(`false ${element._id}`);
                                notPinned.push(element);
                            }
                        });
                        setPosts([...notPinned]);
                    setPinnedPosts([...pinned]);
                }).catch(err => console.log(err))
           
        }).catch(e => console.log(e));
    };


    function handlePosts() {
        setPhotoURI("");
        setPosts([]);
        setPinnedPosts([]);
        axiosRequest.get(`${ip}/posts`).then(async result => {
            let temp = [...result.data];
            let pinned = [];
            let notPinned = [];
            await axiosRequest.get(`${ip}/getPinnedPosts/${auth.currentUser.email}`).then(
                result2 => {
                    result.data.forEach(element => {
                            // console.log(`element id : ${element._id}`);
                        
                            if(result2.data.data.includes(element._id)){
                                // console.log(`true ${element._id}`);
                                pinned.push(element);
                            } else {
                                // console.log(`false ${element._id}`);
                                notPinned.push(element);
                            }
                        });
                        setPosts([...notPinned]);
                    setPinnedPosts([...pinned]);
                }).catch(err => console.log(err))
           
        }).catch(e => console.log(e));
    };

    useEffect(() => {
        handlePosts();

    }, []);

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         // Do something when the screen blurs
    //         handlePostsOnNavigation();
    //     });
    
    //     return unsubscribe;
    // }, [navigation]);



    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Do something when the screen blurs
            axiosRequest.get(`${ip}/posts`).then(result => {
                setPosts([...result.data]);
            }).catch(e => console.log(e));
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View  backgroundColor='white' height='100%'>

            <Header ></Header>

            <ScrollView>
                <Box marginBottom={12}>
                    <VStack>
                        <Center>
                            <Box marginTop={7} width='80%' mb={10}>
                                <HStack >
                                    <SearchBar w='100%' placeholder='Search Users...' handleSearchText={handleSearchText} />
                                    {/* <Icon size={8} ml={-9} color='gray.400' as={<Ionicons name='ios-options-outline' />} /> */}
                                </HStack>
                            </Box>

                            {/* <Button marginTop={5} w='30%' marginBottom={5} onPress={() => navigation.navigate('SearchScreen', { searchText: searchText })}>Search </Button> */}
                        </Center>
                        <Center>
                            <Post handlePosts={handlePosts} photoURI={photoURI} />
                        </Center>
                        <Heading ml={6} mt={9} mb={3}>Suggestions</Heading>
                        <Suggestions />
                        <Posts posts={pinnedPosts} handlePosts={handlePosts} pinned={true}/>
                        <Posts posts={posts} handlePosts={handlePosts} pinned={false}/>



                    </VStack>
                </Box>
            </ScrollView>
        </View>
    )
}


export default Home;