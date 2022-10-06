import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useUsers } from '../contexts/UserProvider'
import ConversationPanel from '../components/ConversationPanel'
import { useConversations } from '../contexts/ConversationsProvider'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

function HomeScreen() {
  const { activeUser, setActiveUser, isLoggedIn } = useUsers()
  const { conversations, addWebSocket, activeWebSocket, setActiveWebSocket, webSocketsDict, setConversations, getConversations, getChatMessages, setChatMessages } = useConversations()
  const navigate = useNavigate()
  
  

  // create websocket connections for all existent conversations
  useEffect(() => {
    async function getData() {
      // get all conversations containing logged in user
      const convosFromBackend = await getConversations(activeUser.id)
      setConversations(convosFromBackend)
      localStorage.setItem('conversations', JSON.stringify(convosFromBackend))
      const chatMessagesFromBackend = await getChatMessages(activeUser.id)
      setChatMessages(chatMessagesFromBackend)
      localStorage.setItem('chatMessages', JSON.stringify(chatMessagesFromBackend))
      conversations.map((conversation, index) => {
        addWebSocket(conversation.id, activeUser.id, activeUser.username)
    }, [])
  }
  getData()
}, [])

  return (
    <div className="HomeScreen">
        <div className='d-flex' style={{ height: '100vh'}}>
          <div className='flex-grow-3'>
            <Sidebar />
          </div>
          <div style={{width: '100%'}} className='flex-grow-9'>
            <ConversationPanel />
          </div>
        </div>
    </div>
  )
}

export default HomeScreen



