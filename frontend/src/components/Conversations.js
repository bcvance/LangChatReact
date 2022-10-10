import React, { useContext, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'
import { useUsers } from '../contexts/UserProvider'
import { getTimeFormat, getDisplayText } from '../utils/formatters'

function Conversations() {
    const { conversations, setConversations, activeConvo, setActiveConvo, webSocketsDict, addWebSocket, chatMessages, deleteConvoFromLocalStorage, deleteConvoFromDatabase } = useConversations()
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

    const handleDeleteConvo = (chat_id) => {
      deleteConvoFromDatabase(chat_id)
      deleteConvoFromLocalStorage(chat_id)
    }


  return (
    <div style={{height: '90vh'}} className='d-flex flex-column overflow-auto'>
      <ListGroup variant='flush'>
        {conversations.map((conversation, index) => {
          let displayDate = ''
          let displayText = ''
          if (conversation.id in chatMessages) {
            let dateString = chatMessages[conversation.id][chatMessages[conversation.id].length-1].send_time
            displayDate = getTimeFormat(dateString)
            let mostRecent = chatMessages[conversation.id][chatMessages[conversation.id].length-1].content
            displayText = getDisplayText(mostRecent)
          }
          

          
          return (
            <ListGroup.Item key={conversation.id} onClick={() => changeActiveConvo(conversation.id, index)} className={itemClasses(conversation.id)}>
              <div className='d-flex flex-column'>
                <div>
                  <span style={{fontSize: '14px'}} className='float-start'>{conversation.users.filter((user) => {return user !== activeUser.username})}</span>
                  <span style={{fontSize: '14px'}} className={activeConvo === conversation.id ? 'float-end' : 'float-end text-secondary'}>{displayDate}</span>
                </div>
                <div>
                  <p style={{fontSize: '12px'}} className={activeConvo === conversation.id ? 'mb-0' : 'text-secondary mb-0'}>{displayText}</p>
                </div>
                <div>
                  <svg style={{cursor: 'pointer'}} className='float-end' onClick={() => handleDeleteConvo(conversation.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                  </svg>
                </div>
              </div>
            </ListGroup.Item>
          )
          })}
      </ListGroup>
    </div>
  )
}

export default Conversations