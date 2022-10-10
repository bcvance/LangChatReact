import React, { useContext, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'
import { useUsers } from '../contexts/UserProvider'

function Conversations() {
    const { conversations, setConversations, activeConvo, setActiveConvo, webSocketsDict, addWebSocket, chatMessages } = useConversations()
    const { activeUser } = useUsers()

    const changeActiveConvo = (id, index) => {
      console.log('convo changed')
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
    <div style={{height: '90vh'}} className='d-flex flex-column overflow-auto'>
      <ListGroup variant='flush'>
        {conversations.map((conversation, index) => (
            <ListGroup.Item key={conversation.id} onClick={() => changeActiveConvo(conversation.id, index)} className={itemClasses(conversation.id)}>
              <div className='d-flex flex-column'>
                <div>
                  <span className='float-start small'>{conversation.users.filter((user) => {return user !== activeUser.username})}</span>
                  <span className='float-end small'>{chatMessages[conversation.id][chatMessages[conversation.id].length-1].send_time}</span>
                </div>
              </div>
            </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default Conversations