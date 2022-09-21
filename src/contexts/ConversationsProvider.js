import React from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ConversationsContext = React.createContext();

function ConversationsProvider(props) {
    const [conversations, setConversations] = useLocalStorage('conversations', [])

    function addConversation(conversation_id, user_ids) {
        setConversations(...conversations, {conversation_id: conversation_id, user_ids: user_ids})
    }

    const value = {
      conversations: conversations,
      addConversation: addConversation
    }

  return (
    <ConversationsContext.Provider value={value}>
        {props.children}
    </ConversationsContext.Provider>
  )
}

export default ConversationsProvider