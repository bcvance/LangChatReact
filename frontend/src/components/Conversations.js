import React, { useContext, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

function Conversations() {
    const { conversations, activeConvo, setActiveConvo, webSocketsDict, addWebSocket } = useConversations()

    const changeActiveConvo = (id, index) => {
      setActiveConvo(id)
    }

    const itemClasses = (id) => {
      if (id === activeConvo) {
        return 'active'
      }
      else {
        return ''
      }
    }


  return (
    <ListGroup variant='flush'>
        {conversations.map((conversation, index) => (
            <ListGroup.Item key={conversation.id} onClick={() => changeActiveConvo(conversation.id, index)} className={itemClasses(conversation.id)}>
              <div className='d-flex justify-content-center flex-column align-items-center'>
                <p className='small'>{conversation.users}</p>
              </div>
            </ListGroup.Item>
        ))}
    </ListGroup>
  )
}

export default Conversations