import { Container, ScrollView } from "native-base";
import { Box, Button, Center, Divider, Heading, Image, Text, VStack, HStack, Pressable } from "native-base";
import { useEffect, useState } from "react";
import axiosRequest from "../../config/axiosRequest";
import ip from "../../config/ip";
import { auth } from "../../config/firebase";
import { useNavigation } from "@react-navigation/native";

const Connections = (props) => {
  const type = props.type;
  const [image, setImage] = useState("");

  const navigation = useNavigation();
  const [users, setUsers] = useState([]);


  async function getData(text = "") {
    axiosRequest.get(`${ip}/getConnections/${auth.currentUser.email}`).then(
      result => {
        console.log(result.data.data);

        let temp = [];
        setUsers([]);
        const condition = new RegExp(`.*${text}.*`, "i");

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
                  console.log(users[0].image)

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


  return (

    <Box backgroundColor='white' borderWidth={1} borderRadius={10} pl={3} py={6} width='100%' mt={6}>

      <Pressable onPress={() => navigation.navigate('ConnectionCard', { type: type })} >

        <Text fontWeight="bold" mb={5}>{type}</Text>
        {/* <Box display='flex' flexDirection='row' ml={10}> */}
        <HStack >
          {users.map((user) => {
            console.log(user.image)
            return (


              <Image ml={5} mr={10} resizeMode="cover"
                source={{ uri: user.image }}
                alt={users.image} style={{ width: 20, height: 20, borderRadius: 30 }} />


            )
          })}
        </HStack>
        {/* </Box> */}

      </Pressable>
    </Box>


  );
}

export default Connections;