
import {
    View, Text, HStack, VStack, Icon, Modal,
    FormControl, Input, Button, Heading, Checkbox,
    Box, Select, CheckIcon, Radio, Pressable, Center
} from 'native-base';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import axiosRequest from "../../config/axiosRequest";
import ip from '../../config/ip';
import Users from '../lists/Users';
import SearchBar from '../layout/SearchBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { filter } from 'lodash';
import { remove } from 'lodash';
import Header from '../layout/Header';

import { auth } from "../../config/firebase";

const SearchScreen = () => {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);

    const route = useRoute();
    const [data, setData] = useState([]);
    const { searchText } = route.params;
    const [search, setSearch] = useState(route.params.searchText != undefined ? searchText : "");

    const [genderValue, setGenderValue] = useState([]);

    const [ageValue, setAgeValue] = useState("");
    const [cityValue, setCityValue] = useState("");
    const [countryValue, setCountryValue] = useState("");
    const [educationValue, setEducationValue] = useState([]);
    const [jobValue, setJobValue] = useState("");


    const [categoryValue, setCategoryValue] = useState("");
   
    function modalClosed() {
    
        setShowModal(false);
    }

    function getData() {
        axiosRequest.post(`${ip}/searchResults`, {
            searchText: search,
            genderValue: genderValue,
            ageValue: ageValue,
            cityValue: cityValue,
            countryValue: countryValue,
            educationValue: educationValue,
            jobValue: jobValue,
            categoryValue: categoryValue
        }).then(
            result => {
                // console.log(result.data);
                remove(result.data, { email: auth.currentUser.email })
                setData([...result.data]);
            }
        ).catch(e => console.log(e));
    }

    function handleSearchText(text) {
        setSearch(text);
    }

    function modalClosed() {
        getData();
        // console.log('inside modal closed function');
        setShowModal(false);
    }

    function handleClearAll() {
        setGenderValue([]);
        setAgeValue("");
        setCityValue("");
        setCountryValue("");
        setEducationValue([]);
        setJobValue("");
        setCategoryValue("");
        // setShowModal(false);
    }

    // useEffect(() => console.log("re-render because filter changed:", genderValue), [genderValue, 
    // ageValue, cityValue, countryValue, educationValue, jobValue, categoryValue])


    useEffect(() => getData(), [search]);

    // useEffect(() => {
    // const unsubscribe = navigation.addListener('focus', () => {
    // // Do something when the screen blurs
    // getData();
    // });

    // return unsubscribe;
    // }, [navigation]);
    return (
        <View  backgroundColor='white'>
            <Center>
                <HStack width='85%' marginTop={7}>
                    <SearchBar w='85%' placeholder='Search Users...' defaultValue={searchText} handleSearchText={handleSearchText} />
                    <Icon size={8} ml={-9} color='gray.400' as={<Ionicons name='ios-options-outline' />} onPress={() => setShowModal(true)} />
                    {/* <Box justifyContent='center'> {genderValue != null ?genderValue.map((item)=> <Text key={item}>Gender: {item}</Text>) :<></>}
    </Box> */}
                </HStack>
            </Center>
            <Text>{cityValue ? `City: ${cityValue}` : <></>}</Text>

            <Text>{countryValue ? `Country: ${countryValue}` : <></>}</Text>

            <Text>{jobValue ? `Job Title: ${jobValue}` : <></>}</Text>

            <Text marginLeft={5} fontSize={16} fontWeight='bold'>{search == "" ? "Showing all results" : `Search result for "${search}"`}</Text>

            <Users users={data} />
            <Modal isOpen={showModal} onClose={modalClosed} >
                <Modal.Content maxWidth="400px" borderColor='#0A5795' borderWidth={1.5} borderRadius={15}>
                    <Modal.CloseButton />
                    <Modal.Header >
                        <Button onPress={handleClearAll} width="40%">Clear All</Button>
                    </Modal.Header>
                    <Modal.Body>
                        <VStack space={2} mb={4}>
                            <HStack alignItems="baseline">
                                <Heading fontSize="lg">Gender</Heading>
                            </HStack>

                            <Checkbox.Group defaultValue={genderValue} value={genderValue} accessibilityLabel="pick an item" onChange={values => {
                                setGenderValue(values || []);
                                console.log(genderValue);
                            }}>
                                <Checkbox value="Male" my="1" >
                                    <Text ml={2}>Male</Text>
                                </Checkbox>
                                <Checkbox value="Female" my="1">
                                    <Text ml={2}>Female</Text>
                                </Checkbox>
                                <Checkbox value="Others" my="1">
                                    <Text ml={2}>Others</Text>
                                </Checkbox>
                            </Checkbox.Group>
                        </VStack>

                        <VStack space={2} mb={5}>
                            <HStack alignItems="baseline">
                                <Heading fontSize="lg">Age</Heading>
                            </HStack>
                            <Radio.Group name="myAgeGroup" value={ageValue} accessibilityLabel="above age number" onChange={nextValue => {
                                setAgeValue(nextValue);
                            }}>
                                <Radio value="Above18" my={1}>
                                    <Text ml={2}>Above 18</Text>
                                </Radio>
                                <Radio value="Above25" my={1}>
                                    <Text ml={2}>Above 25</Text>
                                </Radio>
                                <Radio value="Above40" my={1}>
                                    <Text ml={2}>Above 40</Text>
                                </Radio>
                            </Radio.Group>
                        </VStack>

                        <VStack space={2} mb={5}>
                            <HStack alignItems="baseline">
                                <Heading fontSize="lg">Location</Heading>
                            </HStack>

                            <HStack alignItems="baseline" width='80%'>
                                <Input placeholder="City" value={cityValue} onChangeText={value => setCityValue(value)} width='50%' mr={7} borderRadius={10} />
                                <Input placeholder="Country" value={countryValue} onChangeText={value => setCountryValue(value)} width='50%' borderRadius={10} />
                            </HStack>
                        </VStack>


                        <VStack space={2} mb={5}>
                            <HStack alignItems="baseline">
                                <Heading fontSize="lg">Education</Heading>
                            </HStack>

                            <Checkbox.Group defaultValue={educationValue} value={educationValue} accessibilityLabel="pick an item" onChange={values => {
                                setEducationValue(values || []);
                                // console.log(genderValue);
                            }}>
                                <Checkbox value="Undergraduate" my="1">
                                    <Text ml={2}>Undergraduate</Text>
                                </Checkbox>
                                <Checkbox value="Graduate" my="1">
                                    <Text ml={2}>Graduate</Text>
                                </Checkbox>
                                <Checkbox value="PhD" my="1">
                                    <Text ml={2}>PhD</Text>
                                </Checkbox>
                                <Checkbox value="Doctorate" my="1">
                                    <Text ml={2}>Doctorate</Text>
                                </Checkbox>
                            </Checkbox.Group>
                        </VStack>


                        <VStack space={2} mb={5}>
                            <HStack alignItems="baseline">
                                <Heading fontSize="lg">Job Title</Heading>
                            </HStack>

                            <HStack alignItems="baseline" width='80%'>
                                <Input borderRadius={10} placeholder="Job Title" value={jobValue} onChangeText={value => setJobValue(value)} width='100%' />
                            </HStack>
                        </VStack>

                        <VStack space={2} maxW="300" mb={5}>
                            <HStack alignItems="baseline">
                                <Heading fontSize="lg">Category</Heading>
                            </HStack>

                            <HStack alignItems="baseline" width='80%'>
                                <Select borderRadius={10} selectedValue={categoryValue} value={categoryValue} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setCategoryValue(itemValue)}>
                                    <Select.Item label="Developer" value="Developer" />
                                    <Select.Item label="UX/UI Designer" value="UX/UI Designer" />
                                    <Select.Item label="Banking" value="Banking" />
                                    <Select.Item label="Business" value="Business" />
                                    <Select.Item label="Medical" value="Medical" />

                                    <Select.Item label="Others" value="Others" />
                                </Select>
                            </HStack>
                        </VStack>



                    </Modal.Body>

                </Modal.Content>
            </Modal>
        </View>
    )
}

export default SearchScreen;