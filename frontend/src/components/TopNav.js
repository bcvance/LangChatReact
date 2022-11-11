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
            setIsLoggedIn(false)
            localStorage.setItem('user', {})
            localStorage.setItem('conversations', [])
            localStorage.setItem('chatMessages', {})
            localStorage.setItem('contacts', [])
            setActiveUser({})
            setConversations([])
            setChatMessages({})
        }
        else {
            navigate('/login/')
        }
    }

  return (
    <div style={{ padding: '7.5px' }} className='border-bottom align-items text-end'>
        <a style={{fontSize: 'small', cursor: 'pointer'}} className='ms-auto me-2 text-primary' onClick={handleLog}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
        </a>
    </div>
  )
}

export default TopNav