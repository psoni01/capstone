import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import IndexScreen from '../screens/IndexScreen';
// import DetailsScreen from '../screens/DetailsScreen';
import { Text } from 'native-base';



const Stack = createNativeStackNavigator();


const AppStack = () => {
    return (<NavigationContainer>
        <Stack.Navigator
            initialRouteName="Index" >
            <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Index" component={IndexScreen}/>
               
                
            </Stack.Group>

    </Stack.Navigator>
    </NavigationContainer>)
}

export default AppStack;