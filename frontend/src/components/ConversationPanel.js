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
        console.log(activeConvo)
        console.log(currentMessages)
        if (thisWebSocket) {
            thisWebSocket.onmessage = (message) => {
                const messageData = JSON.parse(message.data)
            }
        }
        const messageBox = document.getElementById('message-box')
        messageBox.scrollTop = messageBox.scrollHeight
        
    })
    
  return (
    <div style={{ height: '100vh'}} className='d-flex flex-column'>
        <TopNav />
        
        <div className='flex-grow-1' style={{height: '90vh', position: 'relative'}}>
            <div id='message-box' style={{maxHeight: '89%'}} className='overflow-auto d-flex flex-column'>
                {currentMessages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                ))}
            </div>
            <div id='input' style={{width: '100%', position: 'absolute', bottom:'0'}} className='align-self-end'>
                <Form className='' style={{width: '100%'}} onSubmit={handleSendMessage}>
                    <Row className='mx-1 my-1'>
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