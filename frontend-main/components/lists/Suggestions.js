import { FlatList } from "native-base";
import { useEffect, useState } from "react";
import PostCard from "../listItems/PostCard";
import axiosRequest from "../../config/axiosRequest";
import ip from "../../config/ip";
import { auth } from '../../config/firebase'
import SuggestionCard from "../listItems/SuggestionCard";

import { useNavigation } from "@react-navigation/native";

const Suggestions = () => {

    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    // useEffect(() => {
    //     axiosRequest.get(`${ip}/getSuggestions/${auth.currentUser.email}`).then(
    //         result2 => {
    //             setUsers([...result2.data]);
    //         }
    //     ).catch(err => console.log(err));
    // }, []);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Do something when the screen blurs
            axiosRequest.get(`${ip}/getSuggestions/${auth.currentUser.email}`).then(
                result2 => {
                    setUsers([...result2.data]);
                }
            ).catch(err => console.log(err));
        });

        return unsubscribe;
    }, [navigation]);


    return (
        <FlatList
            backgroundColor='#2F2F2E'
            horizontal={true}
            data={users}
            renderItem={({ item }) => (
                <SuggestionCard
                    id={item._id}
                    email={item.email}
                    skills={item.skills}
                    image={item.image}
                    name={item.name}
                />
            )} />
    )
};

export default Suggestions;

