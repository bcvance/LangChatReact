import React, { useContext, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider(props) {
    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const [activeTab, setActiveTab] = useState(0)

    async function getConversations(username) {
      let url = 'http://127.0.0.1:8000/api/conversations/'
      try{
        let response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({'username': username}),
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
          return [...prevConversations, {chat_id: chat_id, users: users}]
        })
    }

    const value = {
      conversations: conversations,
      setConversations: setConversations,
      addConversation: addConversation,
      getConversations: getConversations,
      activeTab: activeTab,
      setActiveTab: setActiveTab
    }

  return (
    <ConversationsContext.Provider value={value}>
        {props.children}
    </ConversationsContext.Provider>
  )
}

export default ConversationsProvider