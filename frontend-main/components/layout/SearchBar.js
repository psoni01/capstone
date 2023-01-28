import {
  Text,
  View,
  Center,
  Box,
  Select,
  CheckIcon,
  FormControl,
  Input,
  Icon,
  Modal
} from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'

import { useNavigation } from "@react-navigation/native";
import { useState } from 'react';

const SearchBar = (props) => {

  const navigation = useNavigation()
  const { handleSearchText, w, placeholder } = props
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  
  function modalClosed() {
    
    setShowModal(false);
}

  return (
    <FormControl isRequired>
      <Input
        borderRadius={10}
        w={w}
        borderWidth={1.3}
        borderColor='black'
        placeholder={placeholder}
        onChangeText={(text) => {
          handleSearchText(text)
          setSearchText(text)
        }}
        onEndEditing={() => navigation.navigate('SearchScreen', { searchText: searchText })}
        InputLeftElement={
          <Icon
            mt={1}
            size={7}
            ml={2}
            as={<Ionicons name="search-outline" />}

          />
        }

        returnKeyType="search"
      />
    </FormControl>
  )
}

export default SearchBar
