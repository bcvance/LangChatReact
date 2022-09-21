import React from 'react'
import { ListGroup } from 'react-bootstrap'

function Conversations() {
    const conversations = ['conversation 1', 'conversations 2', 'conversation 3']
  return (
    <ListGroup variant='flush'>
        {conversations.map((conversation, index) => (
            <ListGroup.Item key={index}>
                test
            </ListGroup.Item>
        ))}
    </ListGroup>
  )
}

export default Conversations