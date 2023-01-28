import { Text, View, Center, Box, Select, CheckIcon } from "native-base";
import Header from "../layout/Header";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react';

import { TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import ConversationContainer from "../containers/ConversationContainer";
import { updateCurrentUser } from "firebase/auth";
import axiosRequest from "../../config/axiosRequest";



const ChatScreen = ({ route }) => {
  // const route = useRoute();
  const { name, email } = route.params;
  console.log(name);
  const [messages, setMessages] = useState([]);
 const getAllChats = () => {
     const docid = email > auth.currentUser.email ? auth.currentUser.email + "-" + email : email + "-" + auth.currentUser.email
const unsubscribe = db.collection('messages').doc(docid).collection('chats').orderBy('createdAt', 'desc').onSnapshot(
      snapshot => setMessages(snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
   }))
      )
    )


  }

  useEffect(() => {
    getAllChats()
  }, [])

  const onSend = (messages) => {
    const msg = messages[0]
    const myMsg = {
      ...msg,
      sentBy: auth?.currentUser?.email,
      sendTo: email,

      createdAt: new Date()


    }
    const docid = email > auth.currentUser.email ? auth.currentUser.email + "-" + email : email + "-" + auth.currentUser.email
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
    db.collection('messages').doc(docid).collection("chats").add({
      ...myMsg
    }

    )

  }
return (

    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth?.currentUser.email
      }}
    />

  )

}


export default ChatScreen
