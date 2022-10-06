import React, { useEffect, useState } from 'react'
import TopNav from './TopNav'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'
import { useUsers } from '../contexts/UserProvider'
import MessageBubble from './MessageBubble'

function ConversationPanel() {
    const { conversations, activeConvo, setActiveConvo, webSocketsDict, saveMessageToLocalStorage, saveMessageToDatabase, chatMessages } = useConversations()
    const thisWebSocket = webSocketsDict[activeConvo]
    const { activeUser } = useUsers()
    const [message, setMessage] = useState('')
    const updateMessage = (e) => {
        setMessage(e.target.value)
    }
    const currentMessages = (activeConvo in chatMessages) ? chatMessages[activeConvo] : []

    // get information (object) of active conversation
    for (let i=0; i<conversations.length; i++) {
        if (conversations[i].id === activeConvo) {
            const activeConvoObject = conversations[i]
        }
    }

    const handleSendMessage = (e) => {
        console.log('handling send message')
        e.preventDefault()
        const content = e.target.value
        thisWebSocket.send(
            JSON.stringify({
                type: 'message', 
                message: message,
                message_username: activeUser.username,
                message_user_id: activeUser.id
            })
        )
        saveMessageToLocalStorage(activeUser.id, activeConvo, message)
        saveMessageToDatabase(activeUser.id, activeConvo, message)
        setMessage('')
    }

    useEffect(() => {
        console.log('chat messages:')
        console.log(currentMessages)
        if (thisWebSocket) {
            console.log('there is websocket')
            thisWebSocket.onmessage = (message) => {
                console.log('received message')
                const messageData = JSON.parse(message.data)
                console.log(messageData)
            }
        }
        
    })
    
  return (
    <div style={{ height: '100vh'}} className='d-flex flex-grow-1 flex-column'>
        <TopNav />
        
        <div className='d-flex' style={{height: '100%'}}>
            <div>
                {currentMessages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                ))}
            </div>
            <div id='input' style={{width: '100%'}} className='align-self-end'>
                <Form className='' style={{width: '100%'}} onSubmit={handleSendMessage}>
                    <Row className='m-3'>
                        <Col style={{flexGrow: '11'}} className='m-auto'>
                            <Form.Control value={message} className='' style={{borderRadius: '40px'}} type='text' name='message' placeholder='Type message here.' onChange={(e) => updateMessage(e)} />
                        </Col>
                        <Col style={{flexGrow: '1'}}>
                            <Button type='submit'>Send</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </div>
    
  )
}

export default ConversationPanel