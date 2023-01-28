import { Text, View, Center, Box, Select, CheckIcon, Button, ScrollView } from "native-base";
import Header from "../layout/Header";
import { useNavigation } from "@react-navigation/native";
import ConnectionContainer from "../containers/ConnectionContainer"; 
const Connection = () => {
   

    const navigation=useNavigation()


    return (
        <View backgroundColor='white' height='100%'>
            <Header ></Header>
            <ScrollView>
            <Center >
                
            <ConnectionContainer  backgroundColor='white'/>
            
            </Center>
            </ScrollView>
        </View >
    )
}


export default Connection;
