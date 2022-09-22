import React, { useEffect, useState } from 'react'
import { Form, ModalBody, Button, Nav, Tab } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import axios from '../axiosConfig.js'

function ConvosModal({show, setShow}) {
    const options = ['user1','user2','user3']
    const handleClose = () => setShow(false)
    const [activeTab, setActiveTab] = useState('findPartner')
    const languages = ['English', 'French', 'German', 'Russian', 'Spanish']
    const [myLanguage, setMyLanguage] = useState('English')
    const [learningLanguage, setLearningLanguage] = useState('English')

    
    // update state on form change
    const updateLanguages = (event) => {
        event.target.name === 'myLanguage' ? setMyLanguage(event.target.value) : setLearningLanguage(event.target.value)
    }

    
    // make call to backend to match user with language partner and generate new chat room
    const handleSubmit = (myLanguage, learningLanguage, event) => {
        event.preventDefault()
        let data = new FormData()
        data.append('know-languages', myLanguage)
        data.append('learning-languages', learningLanguage)
        data.append('username', 'user1')
        axios.post('http://127.0.0.1:8000/chat/', data)
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }

  return (
    <Modal show={show} onHide={handleClose}>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Modal.Header closeButton>
                <Nav variant='tabs' className='justify-content-center'>
                    <Nav.Item>
                        <Nav.Link eventKey='findPartner'>Find New Partner</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey='myContacts'>My Contacts</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Modal.Header>
            <ModalBody>
                <Tab.Content>
                    <Tab.Pane eventKey='findPartner'>
                        <Form onSubmit={(event) => handleSubmit(myLanguage, learningLanguage, event)}>
                            <Form.Group className='mb-3' controlId='myLanguage'>
                                <Form.Label>I know:</Form.Label>
                                <Form.Select name='myLanguage' onChange={updateLanguages}>
                                    {languages.map((language, index) => (
                                        <option key={index} label={language}>{language}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='learningLanguage'>
                                <Form.Label>I'm learning:</Form.Label>
                                <Form.Select name='learningLanguage' onChange={updateLanguages}>
                                    {languages.map((language, index) => (
                                        <option key={index} label={language}>{language}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Button as='input' type='submit' value='Match me!'></Button>
                        </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey='myContacts'>
                        <Form>
                            <Form.Group className='mb-3' controlId='selectUsers'>
                                {options.map((option) => (
                                    <div key={option} className='mb-3'>
                                        <Form.Check type='checkbox' label={option} />
                                    </div>
                                ))}
                            </Form.Group>
                        </Form>
                    </Tab.Pane>
                </Tab.Content>
            </ModalBody>
        </Tab.Container>
    </Modal>
  )
}

export default ConvosModal