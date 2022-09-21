import React, { useState } from 'react'
import { Form, ModalBody, Button, Nav, Tab } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

function ConvosModal({show, setShow}) {
    const options = ['user1','user2','user3']
    const handleClose = () => setShow(false)
    const [activeTab, setActiveTab] = useState('findPartner')
    const languages = ['English', 'French', 'German', 'Russian', 'Spanish']

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
                        <Form>
                            <Form.Group className='mb-3' controlId='myLanguage'>
                                <Form.Label>I know:</Form.Label>
                                <Form.Select>
                                    {languages.map((language, index) => (
                                        <option key={index} label={language}>{language}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='learningLanguage'>
                                <Form.Label>I'm learning:</Form.Label>
                                <Form.Select>
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