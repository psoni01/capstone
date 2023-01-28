import { HStack, StatusBar, Box, Text , Image, Icon, Flex, Spacer} from "native-base";
const favicon = require('../../assets/favicon.png');
const splash = require('../../assets/splash.png');
import { AntDesign } from '@expo/vector-icons';
import React from "react";
import { AuthContext } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet } from 'react-native'




const Header = (props) => {
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        card: {
          backgroundColor: 'white',
          
          
        },
        shadowProp: {
          shadowColor: '#171717',
          shadowOffset: {width: -1, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 3,
        },
      });

    const { signOut } = React.useContext(AuthContext);
    return (
        <Box safeAreaTop backgroundColor='#00000000' style={[styles.card, styles.shadowProp]} >
            <HStack   justifyContent="space-between" paddingLeft={5}>
            <TouchableOpacity  onPress={() => navigation.navigate('Home')}>
                <Image   source={require('../images/Logo.png')} width={38} height={38} alt="icon" marginTop={5}/>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => navigation.navigate('UserProfile')}>
                <Image   source={require('../Icons/User.png')} width={6} height={6} alt="icon" marginTop={7} marginRight={5}/>
            </TouchableOpacity>
        </HStack> </Box>
)};

export default Header;