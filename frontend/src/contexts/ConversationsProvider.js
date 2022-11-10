import React, { useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { useUsers } from './UserProvider';

export const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider(props) {
  

    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const { activeUser } = useUsers()
    const [activeConvo, setActiveConvo] = useState(() => {
      console.log('resetting state')
      if (Object.keys(conversations).length > 0) {
        return conversations[0].shared_id
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

    function addConversation(data) {
        setConversations((prevConversations) => {
          let newConversations = prevConversations.map(conversation => {return {...conversation}})
          if (!('other_users' in data)) {
            data.other_users = []
          }
          if (!(conversations.some(conversation => conversation.shared_id === data.shared_id))) {
            newConversations = [...newConversations, {id: data.room_id, user: data.user, shared_id: data.shared_id, other_users: data.other_users, has_unread: data.has_unread}]
            newConversations.sort((a, b) => (a.last_saved > b.last_saved ? 1 : -1))
          }

          return newConversations
        })
        return 'done'
    }

    function saveConversationToLocalStorage(data) {
      let convosFromLocalStorage = localStorage.getItem('conversations')
      convosFromLocalStorage = [...convosFromLocalStorage, {chat_id: data.chat_id, user: data.user, shared_id: data.shared_id, has_unread: data.has_unread}]
      convosFromLocalStorage.sort((a, b) => (a.last_saved > b.last_saved ? 1 : -1))
      localStorage.setItem('conversations', convosFromLocalStorage)
    }

    function deleteConvo(index) {
      setConversations(prevConversations => {
        let newConversations = [...prevConversations]
        newConversations.splice(index, 1)
        return newConversations
      })
    }

    function deleteConvoFromLocalStorage(index) {
      let convosFromLocalStorage = JSON.parse(localStorage.getItem('conversations'))
      convosFromLocalStorage.splice(index, 1)
      localStorage.setItem('conversations', JSON.stringify(convosFromLocalStorage))

    }

    async function deleteConvoFromDatabase(chat_id) {
      let url = 'http://127.0.0.1:8000/api/delete_convo/'
      try{
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'chat_id': chat_id}),
          headers: {'Content-Type': 'application/json'}
        })
        // list of js objects, each object being a conversation
        let data = await response.json()
        return data
      }catch(e) {
        return e
      }
    }

    function sortConvos(chat_id) {
      // update last saved time of relevant chat and sort conversations by last sent message
      // console.log('called')
      setConversations((prevConversations => {
        for (let i=0; i<prevConversations.length; i++) {
          if (prevConversations[i].shared_id === chat_id) {
            let mostRecent = prevConversations.splice(i, 1)
            prevConversations.unshift(mostRecent[0])
            mostRecent.last_saved = new Date().toISOString()
            return prevConversations
          }
        }
        return prevConversations
      }))
    }

    // cancel search for language partner if no partner has yet been found
    async function cancelSearch(chat_id, index) {
      let url = 'http://127.0.0.1:8000/api/cancel_search/'
      try {
        let result = await fetch(url, {
          method: 'DELETE',
          body: JSON.stringify({'chat_id': chat_id}),
          headers: {'Content-Type': 'application/json'}
        })
        let data = await result.json()
        deleteConvo(index)
      }catch(e) {
        console.log(e)
      }
    }

    function addWebSocket(shared_id, user_id, username) {
      // console.log(webSocketsDict)
      // console.log(`adding socket for ${shared_id}`)
      setWebSocketsDict(prevWebSockets => {
        let newWebSockets = {...prevWebSockets}
        if (!(shared_id in newWebSockets)) {
          newWebSockets[shared_id] = new W3CWebSocket(`ws://127.0.0.1:8000/ws/socket-server/${shared_id}/`)
          // newWebsockets[shared_id].onopen = (e) => {
          //   newWebsockets[shared_id].send(JSON.stringify({
          //     'type': 'id_message',
          //     'user_id': user_id,
          //     'message_username': username,
          //     'message_user_id': user_id
          //   }))
          // }
        }
        //console.log(`done adding ${shared_id}`)
        return newWebSockets
      })
    }

    function addWebSockets(convosFromBackend) {
      setWebSocketsDict(prevWebSockets => {
        let newWebSockets = {...prevWebSockets}
        for (let i=0; i<convosFromBackend.length; i++) {
          let shared_id = convosFromBackend[i].shared_id
          if (!(shared_id in newWebSockets)) {
            newWebSockets[shared_id] = new W3CWebSocket(`ws://127.0.0.1:8000/ws/socket-server/${shared_id}/`)
          }
        }
        return newWebSockets
      })
    }

    // add a websocket connection for each user on sign in
    function addUniqueSocket(uuid, user_id, username) {
      //console.log(`adding socket for ${uuid}`)
      setWebSocketsDict(prevWebSockets => {
        if (!('uniqueSocket' in prevWebSockets)){
          prevWebSockets['uniqueSocket'] = new W3CWebSocket(`ws://127.0.0.1:8000/ws/socket-server/${uuid}/`)
          prevWebSockets['uniqueSocket'].onopen = (e) => {
            prevWebSockets['uniqueSocket'].send(JSON.stringify({
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

    function saveMessageToLocalStorage(user_id, chat_id, message, shared_id) {
      let parsed = JSON.parse(localStorage.getItem('chatMessages'))
      const date = new Date()

      // update state
      if (chat_id in chatMessages) {
        setChatMessages((prevChatMessages) => {
          // create deep copy of prevChatMessages so that state change is registered and 
          // child components rerender
          // IMPORTANT: must make deep copy first and THEN alter values on deep copy, 
          // as oppposed to altering prevChatMessages first and then making copy
          const newMessages = {...prevChatMessages}
          newMessages[chat_id] = [...newMessages[chat_id], {content: message, sender: user_id, chat: chat_id, send_time: date.toISOString(), shared_id: shared_id}]
          return newMessages
        })
      }
      else {
        setChatMessages((prevChatMessages) => {
          const newMessages = {...prevChatMessages}
          newMessages[chat_id] = [{content: message, sender: user_id, chat: chat_id, send_time: date.toISOString(), shared_id: shared_id}]
          return newMessages
        })
      }
    }

  async function setUnread(chat_id) {
    // update has_unread attribute of chat instance in backend
    const unreadChatObject = conversations.filter((conversation) => conversation.shared_id === chat_id)
      let url = 'http://127.0.0.1:8000/api/set_unread/'
      try {
        let response = await fetch(url, {
          method: 'PUT',
          body: JSON.stringify({
            'chat_id': unreadChatObject[0].id
          }),
          headers: {'Content-Type': 'application/json'}
        })
        let data = await response.json()
      }catch(e) {
        console.log(e)
      }
      // update state
      setConversations((prevConversations) => {
        let newConversations = prevConversations.map(conversation => {return {...conversation}})
        for (let i=0; i<newConversations.length; i++) {
          if (newConversations[i].shared_id === chat_id) {
            newConversations[i].has_unread = true
            return newConversations
          }
        }
        return newConversations
      })
    }

    async function setRead(chat_id) {
      // update has_unread attribute of chat instance in backend
      const readChatObject = conversations.filter((conversation) => conversation.shared_id === chat_id)
      let url = 'http://127.0.0.1:8000/api/set_read/'
      try {
        let response = await fetch(url, {
          method: 'PUT',
          body: JSON.stringify({
            'chat_id': readChatObject[0].id
          }),
          headers: {'Content-Type': 'application/json'}
        })
        let data = await response.json()
      }catch(e) {
        console.log(e)
      }
      // update state
      setConversations((prevConversations) => {
        let newConversations = prevConversations.map(conversation => {return {...conversation}})
        for (let i=0; i<newConversations.length; i++) {
          if (newConversations[i].shared_id === chat_id) {
            newConversations[i].has_unread = false
            return newConversations
          }
        }
        return newConversations
      })
    }

    async function saveMessageToDatabase(userId, userUsername, chatId, content, sharedId, otherUsers) {
      let url = 'http://127.0.0.1:8000/api/save_message/'
      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            'user_id': userId, 
            'user_username': userUsername,
            'chat_id': chatId, 
            'content': content, 
            'shared_id': sharedId, 
            'other_users': otherUsers}),
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
        return e
      }
    }
    
    // takes list of usernames and creates chat containing those users
    async function manualChat(users) {
      let url = 'http://127.0.0.1:8000/api/manual_chat/'
      try {
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'other_users': users, 'active_user': activeUser.username}),
          headers: {'Content-Type': 'application/json'}
        })
        let data = await response.json()
        addConversation(data)
        //saveConversationToLocalStorage(data)
        return data
      }catch(e) {
        return e
      }
    }


    const value = {
      conversations: conversations,
      setConversations: setConversations,
      addConversation: addConversation,
      saveConversationToLocalStorage: saveConversationToLocalStorage,
      getConversations: getConversations,
      deleteConvo: deleteConvo,
      deleteConvoFromLocalStorage: deleteConvoFromLocalStorage,
      deleteConvoFromDatabase: deleteConvoFromDatabase,
      activeConvo: activeConvo,
      setActiveConvo: setActiveConvo,
      cancelSearch: cancelSearch,
      webSocketsDict: webSocketsDict,
      addWebSocket: addWebSocket,
      addWebSockets: addWebSockets,
      addUniqueSocket: addUniqueSocket,
      activeWebSocket: activeWebSocket,
      setActiveWebSocket: setActiveWebSocket,
      saveMessageToLocalStorage: saveMessageToLocalStorage,
      saveMessageToDatabase: saveMessageToDatabase,
      chatMessages: chatMessages,
      setChatMessages: setChatMessages,
      getChatMessages: getChatMessages,
      manualChat: manualChat,
      sortConvos: sortConvos,
      setUnread: setUnread,
      setRead: setRead,
    }

    useEffect(() => {
      if ((activeConvo === '' && Object.keys(conversations).length > 0)) {
        console.log('activeconvo was blank')
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