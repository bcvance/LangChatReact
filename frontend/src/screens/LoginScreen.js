import React, {useEffect, useState} from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap'
import { useUsers } from '../contexts/UserProvider'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Message from '../components/Message';
import { useConversations } from '../contexts/ConversationsProvider';

function LoginScreen(props) {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const { activeUser, setActiveUser } = useUsers()
  const [success, setSuccess] = useState(true)
  const [error, setError] = useState('')
  const { conversations, setConversations, getConversations, setChatMessages, getChatMessages } = useConversations()

  useEffect(() => {
    console.log(conversations)
  })

  const handleLogin = (async(e) => {
    e.preventDefault()

    // log user in with provided credentials
    try {
      let url = 'http://127.0.0.1:8000/api/login/'
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({'username': email, 'password': password}),
        headers: {'Content-Type': 'application/json'}
      })
      let data = await response.json()
      if (response.ok) {
        setActiveUser(data)
        setSuccess(true)
        localStorage.setItem('user', data)
        // get all conversations containing logged in user
        const convosFromBackend = await getConversations(data.id)
        setConversations(convosFromBackend)
        localStorage.setItem('conversations', JSON.stringify(convosFromBackend))
        const chatMessagesFromBackend = await getChatMessages(data.id)
        localStorage.setItem('chatMessages', JSON.stringify(chatMessagesFromBackend))
      }
      else {
        setSuccess(false)
        setError(data.detail)
      }
    }catch(error) {
      setSuccess(false)
      setError(error)
    }
  })


  const updateState = (e) => {
    const fieldName = e.target.name
    fieldName === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)
  }

  const location = useLocation()
  const navigate = useNavigate()

  const redirect = '/'

  useEffect(() => {

    if ((Object.keys(activeUser).length > 0) && success) {
      navigate('/', { replace: true })
    }
  }, [navigate, activeUser, redirect])

  return(
    <Container className='d-flex flex-column align-items-center' style={{height:'100vh'}}>
        <Card style={{ width: '25rem', margin: 'auto'}} className='align-middle'>
            <Card.Body>
              <Card.Title><h5 className='text-center'>Login</h5></Card.Title>
              {(error.length > 0) && <Message variant='danger'>{error}</Message>}
                <Form onSubmit={handleLogin}>
                    <Form.Group className='m-3'>
                      <Form.Label>Email address</Form.Label>
                      <Form.Control name='email' type='email' placeholder='Enter email' onChange={updateState} />
                    </Form.Group>
                    <Form.Group className='m-3'>
                      <Form.Label>Password</Form.Label>
                      <Form.Control name='password' type='password' placeholder='Enter password' onChange={updateState} />
                    </Form.Group>
                    <div className='text-center'>
                      <Button type='submit' className='text-center'>Log In</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    </Container>
    )
}
export default LoginScreen