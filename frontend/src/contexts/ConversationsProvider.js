import React, { useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { useUsers } from './UserProvider';

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider(props) {
    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const [activeConvo, setActiveConvo] = useState(() => {
      if (Object.keys(conversations).length > 0) {
        return conversations[0].id
      }
      else {
        return ''
      }
    })
    const [activeWebSocket, setActiveWebSocket] = useState('')
    const [webSocketsDict, setWebSocketsDict] = useState({})
    const [chatMessages, setChatMessages] = useLocalStorage('chatMessages', {})

    async function getConversations(userId) {
      let url = 'http://127.0.0.1:8000/api/conversations/'
      try{
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'user_id': userId}),
          headers: {'Content-Type': 'application/json'}
        })
        // list of js objects, each object being a conversation
        let data = await response.json()
        return data
      }catch(e) {
        return e
      }
    }

    function addConversation(chat_id, users) {
        setConversations(prevConversations => {
          return [...prevConversations, {id: chat_id, users: users}]
        })
    }

    function saveConversationToLocalStorage(chat_id, users) {
      let convosFromLocalStorage = localStorage.getItem('conversations')
      convosFromLocalStorage = [...convosFromLocalStorage, {chat_id: chat_id, users: users}]
      localStorage.setItem('conversations', convosFromLocalStorage)
    }

    function addWebSocket(chat_id, user_id, username) {
      console.log('called')
      setWebSocketsDict(prevWebSockets => {
        if (!(chat_id in prevWebSockets)) {
          prevWebSockets[chat_id] = new W3CWebSocket(`ws://127.0.0.1:8000/ws/socket-server/${chat_id}/`)
          prevWebSockets[chat_id].onopen = (e) => {
            prevWebSockets[chat_id].send(JSON.stringify({
              'type': 'id_message',
              'user_id': user_id,
              'message_username': username,
              'message_user_id': user_id
            }))
          }
        }
        return prevWebSockets
      })
    }

    function saveMessageToLocalStorage(user_id, chat_id, message) {
      let parsed = JSON.parse(localStorage.getItem('chatMessages'))
      // update state
      if (chat_id in chatMessages) {
        setChatMessages((prevChatMessages) => {
          prevChatMessages[chat_id] = [...prevChatMessages[chat_id], {content: message, sender: user_id}]
          return prevChatMessages
        })
      }
      else {
        setChatMessages((prevChatMessages) => {
          prevChatMessages[chat_id] = [{content: message, sender: user_id}]
          return prevChatMessages
        })
      }
      console.log(chatMessages)

      // update localStorage
      if (chat_id in parsed) {
        parsed[chat_id].push({content: message, sender: user_id})
        localStorage.setItem('chatMessages', JSON.stringify(parsed))
      }
      else {
        parsed[chat_id] = [{content: message, sender: user_id}]
        localStorage.setItem('chatMessages', JSON.stringify(parsed))
      }
    }

    async function saveMessageToDatabase(userId, chatId, content) {
      let url = 'http://127.0.0.1:8000/api/save_message/'
      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'user_id': userId, 'chat_id': chatId, 'content': content}),
          headers: {'Content-Type': 'application/json'}
        })
        let data = await response.json()
      }catch(e) {
        console.log(e)
      }
    }

    async function getChatMessages(userId) {
      let url = 'http://127.0.0.1:8000/api/messages/'
      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'user_id': userId}),
          headers: {'Content-Type': 'application/json'}
        })
        let data = await response.json()
        return data
      }catch(e) {
        console.log(e)
      }
    }


    const value = {
      conversations: conversations,
      setConversations: setConversations,
      addConversation: addConversation,
      saveConversationToLocalStorage: saveConversationToLocalStorage,
      getConversations: getConversations,
      activeConvo: activeConvo,
      setActiveConvo: setActiveConvo,
      webSocketsDict: webSocketsDict,
      addWebSocket: addWebSocket,
      activeWebSocket: activeWebSocket,
      setActiveWebSocket: setActiveWebSocket,
      saveMessageToLocalStorage: saveMessageToLocalStorage,
      saveMessageToDatabase: saveMessageToDatabase,
      chatMessages: chatMessages,
      setChatMessages: setChatMessages,
      getChatMessages: getChatMessages,
    }

    useEffect(() => {
      if ((activeConvo === '' && Object.keys(conversations).length > 0)) {
        setActiveConvo(conversations[0].id)
      }
    })

  return (
    <ConversationsContext.Provider value={value}>
        {props.children}
    </ConversationsContext.Provider>
  )
}

export default ConversationsProvider