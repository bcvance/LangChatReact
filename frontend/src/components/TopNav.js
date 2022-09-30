import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../contexts/UserProvider'
import { useConversations } from '../contexts/ConversationsProvider'

function TopNav() {
    const navigate = useNavigate()
    const { activeUser, setActiveUser } = useUsers()
    const { setConversations } = useConversations()
    const [loggedIn, setLoggedIn] = useState(() => {
        if (Object.keys(activeUser).length > 0) {
            return true
        }
        return false
    })

    const handleLog = () => {
        if (loggedIn) {
            localStorage.setItem('user', {})
            localStorage.setItem('conversations', [])
            setActiveUser({})
            setLoggedIn(false)
            setConversations([])
        }
        else {
            navigate('/login/')
        }
    }

  return (
    <div style={{ padding: '10.75px' }}className='d-flex flex-column border-bottom align-items'>
        <a style={{fontSize: 'small', cursor: 'pointer'}} className='ms-auto me-2' onClick={handleLog}>
            {loggedIn ? 'Log Out' : 'Log In'}
        </a>
    </div>
  )
}

export default TopNav