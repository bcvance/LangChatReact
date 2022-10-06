import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useUsers } from '../contexts/UserProvider'
import ConversationPanel from '../components/ConversationPanel'
import { useConversations } from '../contexts/ConversationsProvider'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

function HomeScreen() {
  const { activeUser, setActiveUser, isLoggedIn } = useUsers()
  const { conversations, addWebSocket, activeWebSocket, setActiveWebSocket, webSocketsDict } = useConversations()
  const navigate = useNavigate()

  useEffect(() => {
    console.log(isLoggedIn)
    console.log(webSocketsDict)
  })
  

  // create websocket connections for all existent conversations
  useEffect(() => {
    conversations.map((conversation, index) => {
      addWebSocket(conversation.id, activeUser.id, activeUser.username)
    })
  })

  return (
    <div className="HomeScreen">
        <div className='d-flex' style={{ height: '100vh'}}>
          <Sidebar />
          <ConversationPanel />
        </div>
    </div>
  )
}

export default HomeScreen



