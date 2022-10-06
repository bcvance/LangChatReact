import React from 'react'
import { useUsers } from '../contexts/UserProvider'

function MessageBubble({message}) {
    const { activeUser } = useUsers()

    const getClasses = () => {
        if (message.sender === activeUser.id) {
            return 'm-3 bg-primary align-self-end text-light p-2'
        }
        else  {
            return 'm-3 align-self-start bg-light'
        }
    }
  return (
    <div style={{borderRadius: '10px', maxWidth:'100px'}} className={getClasses()}>{message.content}</div>
  )
}

export default MessageBubble