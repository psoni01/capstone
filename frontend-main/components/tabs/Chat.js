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
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import ConversationContainer from "../containers/ConversationContainer";
import { updateCurrentUser } from "firebase/auth";


const Chat = () => {

  const [messages, setMessages] = useState([]);



  useLayoutEffect(() => {
    const unsubscribe = db.collection('messages').orderBy('createdAt', 'desc').onSnapshot(
      snapshot => setMessages(snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user

      }))
      )
    )

    return unsubscribe;

  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

    const {
      _id,
      createdAt,
      text,
      user


    } = messages[0]
    db.collection('messages').add({
      _id,
      createdAt,
      text,
      user
    })
  }, [])


  return (
    <GiftedChat
    backgroundColor='white' height='100%'
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth?.currentUser.email
      }}
    />
  )




}


export default Chat
