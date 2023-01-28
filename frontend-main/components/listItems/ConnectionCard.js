import {
  Box, Button, Center, Divider, Heading, Image, Text, VStack, HStack, FormControl,
  Input,Container,FlatList,
  Icon, View
} from "native-base";
import ConnectionUserCard from "./ConnectionUserCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons'
import { auth } from "../../config/firebase";
import axiosRequest from "../../config/axiosRequest";
import ip from "../../config/ip";
import { TouchableOpacity } from "react-native";
const ConnectionCard = () => {
  const route = useRoute();
  const type = route.params.type;
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  async function getData(text = "") {
    axiosRequest.get(`${ip}/getConnections/${auth.currentUser.email}`).then(
      result => {
        console.log(result.data.data);

        let temp = [];
        setUsers([]);
        const condition = new RegExp(`.*${text}.*`,"i");

        console.log(`reuslt length: ${result.data.data.length}`);
        if (result.data.data.length >= 1) {
          result.data.data.forEach(async element => {

            await axiosRequest.get(`${ip}/getUserByID/${element}`).then(
              result2 => {
                if (result2.data.skills == type && (condition.test(result2.data.name)
                  || text == "")) {
                  console.log(condition.test(result2.data.name));
                  console.log("here");
                  console.log(result2.data.image)
                 
                  temp = [...temp, result2.data];
                  setUsers([...temp]);

                }// console.log("that line executed");
              }
            ).catch(err => console.log(err));
          });
        }
        // console.log("this line executed");
        // setUsers([...temp]);
      }
    ).catch(e => console.log(e));
  };

  // useEffect(() => {

  //   getData();
  // }, []);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        // Do something when the screen blurs
        getData();
    });

    return unsubscribe;
}, [navigation]);

  return (<View  backgroundColor='white' height='100%'>
  <Center >
    <Box width='85%' flexDirection='row' justifyContent='space-between' mt={5} mb={5}>
    <FormControl isRequired width='85%'>
      <Input
        borderRadius={10}
        borderWidth={1.3}
        borderColor='black'
        placeholder="Search.."
        onChangeText={(text) => getData(text)}
        InputLeftElement={
          <Icon
            mt={1}
            size={7}
            ml={2}
            as={<Ionicons name="search-outline" />}
          />
        }
      />
    </FormControl> 
    <TouchableOpacity >
      <Image mt={2.5} source={require('../Icons/AddPerson.png')} alt="icon"/>
    </TouchableOpacity>
    </Box>
    </Center>
    <FlatList mt={4}
      data={users}
      renderItem={({ item }) => (
        <ConnectionUserCard 
          id={item._id}
          email={item.email}
          name={item.name}
          skills={item.skills}
          image={item.image}
        />
      )} />
  </View>
  );
};

export default ConnectionCard;