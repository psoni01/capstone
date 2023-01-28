import axiosRequest from "../../config/axiosRequest";
import { FlatList } from "native-base";
import { useState , useEffect} from "react";
import UserCard from "../listItems/UserCard";
import ip from "../../config/ip";
import { useRoute } from "@react-navigation/native";
import { auth} from './../../config/firebase';
import ReferCard from "../listItems/ReferCard";
import Header from '../layout/Header';
const ReferScreen = (props) => {

const route = useRoute();
    //    const users = props.users;
    const [users, setUsers] = useState([]);
const type = route.params.type;
const referID = route.params.referId;
    useEffect(() => {
        axiosRequest.get(`${ip}/getConnections/${auth.currentUser.email}`).then(
            result => {
                // console.log(result.data.data);

                let temp = [];
                // console.log(`reuslt length: ${result.data.data.length}`);
                if (result.data.data.length >= 1) {
                    result.data.data.forEach(async element => {

                        await axiosRequest.get(`${ip}/getUserByID/${element}`).then(
                            result2 => {
                                temp = [...temp, result2.data];
                                setUsers([...temp]);
                            }
                        ).catch(err => console.log(err));
                    });
                }
            }
        ).catch(e => console.log(e));
    }, []);


    return (
       

        
        
        <FlatList
            data={users}
            renderItem={({ item }) => (
                <ReferCard
                    id={item._id}
                    email={item.email}
                    name={item.name}
                    skills={item.skills}
                    expoToken={item.expoToken}
                    type={type}
                    referID={referID}
                />
            )} />
            
    )
};

export default ReferScreen;