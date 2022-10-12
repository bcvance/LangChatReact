import React from 'react'
import { useContacts } from '../contexts/ContactsProvider'


function Contacts() {
  const { contacts } = useContacts()

  return (
    contacts.map((contact) => (
      <p>{contact}</p>
    ))
  )
}

export default Contacts