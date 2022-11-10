import React, { useEffect, useState } from 'react'
import TopNav from './TopNav'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'
import { useUsers } from '../contexts/UserProvider'
import MessageBubble from './MessageBubble'


function ConversationPanel() {
    const { conversations, 
        setConversations,
        getConversations,
        activeConvo, 
        sortConvos, 
        webSocketsDict, 
        saveMessageToLocalStorage, 
        saveMessageToDatabase, 
        chatMessages,
        setUnread,
        addConversation } = useConversations()
    let thisWebSocket;
    const { activeUser } = useUsers()
    const [message, setMessage] = useState('')
    const updateMessage = (e) => {
        setMessage(e.target.value)
    }
    let currentMessages = (activeConvo in chatMessages) ? chatMessages[activeConvo] : []

    // get information (object) of active conversation
    const getConvoObject = (shared_id) => {
        for (let i=0; i<conversations.length; i++) {
            if (conversations[i].shared_id === shared_id) {
                return conversations[i]
            }
        }
    }

    const handleSendMessage = (e) => {
        const activeConvoObject = getConvoObject(activeConvo)
        thisWebSocket = webSocketsDict[activeConvoObject.shared_id]
        e.preventDefault()
        thisWebSocket.send(
            JSON.stringify({
                type: 'message', 
                message: message,
                message_username: activeUser.username,
                message_user_id: activeUser.id,
                shared_id: activeConvoObject.shared_id,
                other_users: activeConvoObject.other_users,
                unique_chat_id: activeConvoObject.id,
            })
        )
        saveMessageToDatabase(activeUser.id, activeUser.username, activeConvo, message, activeConvoObject.shared_id, activeConvoObject.other_users)
        setMessage('')
    }

    

    useEffect(() => {
        currentMessages = (activeConvo in chatMessages) ? chatMessages[activeConvo] : []
        thisWebSocket = webSocketsDict[activeConvo]

        const newMessageHandler = async () => {
            if (Object.keys(webSocketsDict).length > 0) {
                for (const convoId in webSocketsDict) {
                    webSocketsDict[convoId].onmessage = async (message) => {
                        const messageData = JSON.parse(message.data)
                        // when notified of new chat in backend, fetch new conversation data and update state
                        if (messageData.type === 'new_chat_message' && !(conversations.some(conversation => conversation.shared_id === messageData.shared_id))) {
                            const convos = await getConversations(activeUser.id)
                            setConversations(convos)
                        }
                        // if receiving message from other user, save message and sort conversations
                        else if (messageData.type === 'chat_message') {
                            saveMessageToLocalStorage(messageData.message_user_id, 
                                messageData.chat_id, 
                                messageData.message, 
                                messageData.shared_id)
                            sortConvos(messageData.chat_id)
                            if (!(messageData.chat_id === activeConvo)) {
                                setUnread(messageData.chat_id)
                              }
                        }
                    }
                }
            }
        }
        newMessageHandler()
        const messageBox = document.getElementById('message-box')
        messageBox.scrollTop = messageBox.scrollHeight
    }, [webSocketsDict, activeConvo])
    
  return (
    <div style={{ height: '100vh'}} className='d-flex flex-column'>
        <TopNav />
        
        <div className='flex-grow-1' style={{height: '90vh', position: 'relative'}}>
            <div id='message-box' style={{maxHeight: '89%'}} className='overflow-auto d-flex flex-column'>
                {currentMessages.map((message, index) => (
                    <MessageBubble key={index} message={message} index={index} />
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