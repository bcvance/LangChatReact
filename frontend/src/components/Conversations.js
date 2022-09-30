import React, { useContext, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

function Conversations() {
    const value = useConversations()
    const { conversations, activeTab, setActiveTab } = useConversations()

    const changeActiveTab = (index) => {
      setActiveTab(index)
    }
    const itemClasses = (index) => {
      if (index === activeTab) {
        return 'active'
      }
      else {
        return ''
      }
    }

    useEffect(() => {
      console.log(activeTab)
    })

  return (
    <ListGroup variant='flush'>
        {conversations.map((conversation, index) => (
            <ListGroup.Item key={index} onClick={() => changeActiveTab(index)} className={itemClasses(index)}>
              <div className='d-flex justify-content-center flex-column align-items-center'>
                <p className='small'>{conversation.users}</p>
              </div>
            </ListGroup.Item>
        ))}
    </ListGroup>
  )
}

export default Conversations