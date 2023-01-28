import { Container, HStack } from "native-base";
// import {  Text,View} from "native-base";
import { useState } from "react";
import { Camera, CameraType } from 'expo-camera';
// import Dimensions from 'Dimensions';
import { useWindowDimensions , Dimensions} from 'react-native';
import { Button, StyleSheet, TouchableOpacity, Text, View} from 'react-native';

import { useNavigation ,useRoute} from "@react-navigation/native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });
  


const CameraScreen = () => {
    const [type, setType] = useState(CameraType.back);

    const navigation = useNavigation();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
      }

      async function snap() {
        if(camera){
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
            console.log(`data uri: ${data.uri}`)
            navigation.navigate({name:'Home', params: { imageURI: data.uri },merge:true,} );
      } 
    }
    //   const {width, height} = Dimensions.get('window');
  return (
    <View style={styles.container} >
    <Camera style={styles.camera} ref={ref => setCamera(ref)} type={type}>
      <View style={styles.buttonContainer}>
        
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={snap}>
          <Text style={styles.text}>Snap</Text>
        </TouchableOpacity>
      
      </View>
    </Camera>
  </View>
  )
};

export default CameraScreen;