import { Box, SectionList, Button, Text, HStack, Image, Center, Heading } from "native-base";
import { useState, useEffect } from "react";
import PostCard from "../listItems/PostCard";
import NotificationCard from "../listItems/NotificationCard";
import { auth } from "../../config/firebase";
import axiosRequest from "../../config/axiosRequest";
import ip from "../../config/ip";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet } from 'react-native'

const Notifications = () => {

  const navigation = useNavigation();
  //    const posts = props.posts;
  const [todayNotifications, setTodayNotifications] = useState([]);


  const [earlierNotifications, setEarlierNotifications] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      let todayArr = [];
      let earlierArr = [];
      // Do something when the screen blurs
      axiosRequest.get(`${ip}/getNotifications/${auth.currentUser.email}`).then(result => {
        // setNotifications([...result.data]);
        const today = new Date();
        const [month, day, year] = [
          today.getMonth(),
          today.getDate(),
          today.getFullYear(),
        ];
        if (result.data[0] != undefined) {
          result.data.forEach(element => {
            // console.log(element.createdAt);

            const date = new Date(element.createdAt);
            const [nmonth, nday, nyear] = [
              date.getMonth(),
              date.getDate(),
              date.getFullYear(),
            ];

            if (month == nmonth && day == nday && year == nyear) {
              todayArr.push(element);
            } else {
              earlierArr.push(element);
            }

          });
        }
        setTodayNotifications([...todayArr]);
        setEarlierNotifications([...earlierArr]);
        setData([
          {
            title: "Today",
            data: [...todayArr]
          },
          {
            title: "Earlier",
            data: [...earlierArr]
          }
        ])
      }).catch(e => console.log(e));
    });

    return unsubscribe;
  }, [navigation]);


  return (
    <Box  width='100%' marginTop={5}>
      <HStack justifyContent='space-between'>
        <Button backgroundColor='#00000000' paddingBottom={0} paddingTop={0} width={155} mb={5}><Text color='orange.600' fontWeight='bold' >Mark All As Read</Text></Button>
        <Box flexDirection='row' paddingRight={7}>
          <TouchableOpacity>
            <Image source={require('../Icons/Delete.png')} width={3} height={5} marginTop={3} alt="icon" />
          </TouchableOpacity>
          <TouchableOpacity >
            <Image source={require('../Icons/X.png')} width={4} height={4} marginTop={3.5} marginLeft={6} alt="icon" />
          </TouchableOpacity>
        </Box>
      </HStack>

      <SectionList  w="100%" mb="4" sections={data} keyExtractor={(item, index) => item + index} renderItem={({
        item
      }) => (
        <NotificationCard

          text={item.text}
          type={item.type}
          objectURI={item.objectURI}
        />
      )}
        renderSectionHeader={({
          section: {
            title
          }
        }) => 
            <Heading marginLeft={5} fontSize="xl"  mb={10}>
              {title}
            </Heading>} />
          
      {/* <Text >Today</Text>
      <FlatList

        data={todayNotifications}
        renderItem={({ item }) => (
          <NotificationCard

            text={item.text}
            type={item.type}
            objectURI={item.objectURI}
          />
        )} />



      <Text >Earlier</Text>
      <FlatList

        data={earlierNotifications}
        renderItem={({ item }) => (
          <NotificationCard

            text={item.text}
            type={item.type}
            objectURI={item.objectURI}
          />
        )} /> */}
    </Box>
  )
};

export default Notifications;

