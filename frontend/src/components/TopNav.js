import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../contexts/UserProvider'
import { useConversations } from '../contexts/ConversationsProvider'

function TopNav() {
    const navigate = useNavigate()
    const { activeUser, setActiveUser, isLoggedIn, setIsLoggedIn } = useUsers()
    const { setConversations, setChatMessages } = useConversations()


    const handleLog = () => {
        if (isLoggedIn) {
            localStorage.setItem('user', {})
            localStorage.setItem('conversations', [])
            localStorage.setItem('chatMessages', {})
            setActiveUser({})
            setIsLoggedIn(false)
            setConversations([])
            setChatMessages({})
        }
        else {
            navigate('/login/')
        }
    }

  return (
    <div style={{ padding: '10.75px' }}className='d-flex flex-column border-bottom align-items'>
        <a style={{fontSize: 'small', cursor: 'pointer'}} className='ms-auto me-2' onClick={handleLog}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
        </a>
    </div>
  )
}

export default TopNav