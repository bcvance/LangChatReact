import React from 'react'
import { useUsers } from '../contexts/UserProvider'

function MessageBubble({message}) {
    const { activeUser } = useUsers()

    const getClasses = () => {
        if (message.sender_id === activeUser.id) {
            return 'm-3 bg-primary align-self-end'
        }
        else  {
            return 'm-3 align-self-start'
        }
    }
  return (
    <div className={getClasses()}>{message.message}</div>
  )
}

export default MessageBubble