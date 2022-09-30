import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import { useUsers } from '../contexts/UserProvider'
import ConversationPanel from '../components/ConversationPanel'

function HomeScreen() {
  const { activeUser, setActiveUser } = useUsers()

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



