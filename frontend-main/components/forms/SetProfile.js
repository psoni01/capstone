import axiosRequest from "../../config/axiosRequest"

import { Input, Box, VStack, Text, HStack, Center, FormControl, Select, CheckIcon, Button, ScrollView, Heading ,Image} from 'native-base'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase'
import { useNavigation, useRoute } from '@react-navigation/native'  
import * as FileSystem from 'expo-file-system';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import ip from '../../config/ip'
import { launchImageLibrary } from 'react-native-image-picker'
import { AuthContext } from '../../App'
// import { RNS3 } from 'react-native-aws3';
import * as ImagePicker from 'expo-image-picker';
const SetProfile = () => {
  const { signUp } = React.useContext(AuthContext);

  const route = useRoute()
  const email = route.params.email;
  const name = route.params.name;
  const password = route.params.password;

  const [bio, setBio] = useState(" ")
  const [age, setAge] = useState(" ")
  const [image, setImage] = useState(null);
  const [education, setEducation] = useState(" ")
  const [jobTitle, setJobTitle] = useState(" ")
  const [selected, setSelected] = useState(" ")
  const [location, setLocation] = useState(" ")
  const [skills, setSkills] = useState([])
  const [interest, setInterest] = useState(" ")
  const [imageURL, setImageURL] = useState(" ")

  const navigation = useNavigation()
  const [filePath, setFilePath] = useState({});
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
  // const email=auth?.currentUser?.email
  // const name=auth?.currentUser?.name
  // console.log(auth?.currentUser)
  // console.log("name",name," ",email)

  console.log(name, email, bio, age, education, jobTitle, selected, location, skills, interest,image);


 

  const handleGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
       base64:true
    });
  
    if (!result.cancelled) {
        console.log("entered")
        console.log(result.base64)
        setImageURL(result)
      };

      
      
      // setImageURL(result.uri.replace("file///","file//") );
      // console.log(imageURL,"Selected profile picture");
    }
  

    // if (!result.canceled) {
      
    //   setImage(result.assets[0].uri);
    // }

   const handlePicture = async () => {
  

 
    console.log("0","Selected profile picture");
 
     
      const fileName = uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals]
      }); // red_big_donkey
 
     

      axiosRequest.post(`${ip}/postImage`, {
        key: `${fileName}.jpeg`,
        data: imageURL.base64,
        contentType: "jpeg"
      })
        .then(result => {
          setImage(result.data.data.Location)
          
        }).catch(e => console.log(e));

    }

  






    const handleOnSave = async () => {


      try {

        const response = await axiosRequest.post(`${ip}/postUserDetails`, {
          "name": name, "email": email, "skills": skills,"image":image,"age": age, "bio": bio, "jobTitle": jobTitle,
          "gender": selected, "interest": interest, "location": location, "education": education, 
        })

        console.log(response.data)

        signUp({ email, password, name });
      }

      catch (err) {

        throw err.response;

      }
    }


    return (
      <>

        <ScrollView>
          <Box
            paddingTop={50}
            pl={5}

            width="100%"
            display="flex"
            justifyContent="center" alignItems="center" >
            {/* <FormControl> */}
            <Heading>Profile Setup</Heading>
            <VStack space={5} >
              <Box display="flex"
                width="100%"
                justifyContent="center" alignItems="center" >
                {/* <Text fontSize={20} >Setup Profile</Text> */}
              </Box>
              {/* <Image source={{
      uri: "https://wallpaperaccess.com/full/317501.jpg"
    }} alt="Alternate Text" size="xl" /> */}
              <HStack>
    <Box>
                <Image resizeMode="cover" alt={"item.user"} borderRadius={30} source={ {uri:image}} size='xl' />
                {console.log(image)}

                </Box>
                <Ionicons name="camera" size={50} color="#0A5795" onPress={handleGallery}  />
               
                {/* <Box flex='1' ml={10} flexDirection='row'><Button width={90} mr={5} onPress={handleGallery}>Choose</Button></Box> */}
              
                <Box flex='1' ml={10} flexDirection='row'><Button width={90} height={50} mr={5} onPress={handlePicture}>Upload</Button></Box>
                </HStack>
              <HStack space={3}>

                <Text mt={3} fontSize={16} fontWeight={600}>Name*</Text>
                <Input
                  placeholder='Name'
                  value={name}
                  ml={2}
                  borderBottomWidth={1}
                  borderTopColor='#d8dde6'
                  borderWidth={0}

                  borderBottomColor='#0A5795'
                  width="75%"

                ></Input>

              </HStack>
              <HStack space={3}>

                <Text mt={3} fontSize={16} fontWeight={600} height={50}>Bio</Text>
                <Input
                  placeholder="Bio"
                  value={bio}
                  borderWidth={0}
                  borderBottomWidth={1}
                  borderBottomColor='#0A5795'
                  ml={6}
                  width="80%"
                  onChangeText={text => setBio(text)}
                ></Input>

              </HStack>
              <HStack>
                <FormControl.Label color="black" mr={3} ><Text fontSize={16} fontWeight={600}>Gender</Text></FormControl.Label>
                <Select selectedValue={selected} minWidth="200" _selectedItem={{
                  bg: "green.600",
                  endIcon: <CheckIcon size="5" />
                }} mt="1" onValueChange={itemValue => {
                  setSelected(itemValue)
                }}>
                  <Select.Item label="Male" value="Male" />
                  <Select.Item label="Female" value="Female" />
                  <Select.Item label="Others" value="Others" />

                </Select>
              </HStack>
              <HStack space={0}>

                <Text mt={3} fontSize={16} fontWeight={600}>Email</Text>
                <Input
                  ml={6}
                  
                  borderBottomWidth={1}
                  borderBottomColor='#0A5795'
                  borderWidth={0}
                  placeholder='email'
                  value={email}

                  width="80%"
                ></Input>

              </HStack>
              <HStack space={3}>

                <Text mt={3} fontSize={16} fontWeight={600}>Age</Text>
                <Input
                  type='number'
                  placeholder='Age'
                  borderWidth={0}
                  value={age}
                  ml={6}
                  borderBottomWidth={1}
                  borderBottomColor='#0A5795'
                  width="80%"
                  onChangeText={text => setAge(text)}
                ></Input>

              </HStack>
              <HStack space={3}>

                <Text mt={3} fontSize={16} fontWeight={600}>JobTitle</Text>
                <Input
                  borderBottomWidth={1}
                  borderBottomColor='#0A5795'
                  borderWidth={0}
                  placeholder='Job Title'
                  value={jobTitle}

                  width="80%"
                  onChangeText={text => setJobTitle(text)}
                ></Input>

              </HStack>
              <HStack>
                <FormControl.Label color="black" mr={3} ><Text fontSize={16} fontWeight={600}>Skills</Text></FormControl.Label>
                <Select selectedValue={skills} minWidth="200" _selectedItem={{
                  bg: "green.600",
                  endIcon: <CheckIcon size="5" />
                }} mt="1" onValueChange={itemValue => {
                  setSkills(itemValue)
                }}>
                  <Select.Item label="Developer" value="Developer" />
                  <Select.Item label="UX/UI Designer" value="UX/UI Designer" />
                  <Select.Item label="Banking" value="Banking" />
                  <Select.Item label="Business" value="Business" />
                  <Select.Item label="Medical" value="Medical" />
                  <Select.Item label="Others" value="Others" />

                </Select>
              </HStack>

              <HStack space={3}>

                <Text mt={3} fontSize={16} fontWeight={600}>Interest</Text>
                <Input
                  placeholder='Interest'
                  value={interest}
                  ml={1}
                  borderBottomWidth={1}
                  borderWidth={0}
                  borderBottomColor='#0A5795'
                  width="80%"
                  onChangeText={text => setInterest(text)}
                ></Input>

              </HStack>
              <HStack>

                <FormControl.Label color="black" mr={3} ><Text fontSize={16} fontWeight={600}>Education</Text></FormControl.Label>
                <Select selectedValue={education} minWidth="200" _selectedItem={{
                  bg: "green.600",
                  endIcon: <CheckIcon size="5" />
                }} mt="1" onValueChange={itemValue => {
                  setEducation(itemValue)
                }}>
                  <Select.Item label="Undergraduate" value="Undergraduate" />
                  <Select.Item label="Graduate" value="Graduate" />
                  <Select.Item label="PhD" value="PhD" />
                  <Select.Item label="Doctorate" value="Doctorate" />


                </Select>
              </HStack>
              <HStack space={1}>

                <Text mt={3} fontSize={16} fontWeight={600}>Location</Text>
                <Input
                  placeholder='Location'
                  value={location}
                  borderWidth={0}
                  borderBottomWidth={1}
                  borderBottomColor='#0A5795'
                  mb={0}
                  width="70%"
                  onChangeText={text => setLocation(text)}
                ></Input>

              </HStack>
              <Box display='flex' justifyContent='center' alignItems='center' mt={1}
              >


                <Button width="30%" marginBottom={2} backgroundColor='#0A5795' onPress={handleOnSave}> Save</Button>



              </Box>
            </VStack>

          </Box>
        </ScrollView>
      </>
    )
  }

  export default SetProfile
