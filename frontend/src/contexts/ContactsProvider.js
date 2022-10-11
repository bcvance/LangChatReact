import React, { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'


const ContactsContext = React.createContext()

export function useContacts() {
  return useContext(ContactsContext)
}

export function ContactsProvider(props) {
  const [contacts, setContacts] = useLocalStorage('contacts', [])
    
  function addContact(username) {
    setContacts((prevContacts) => {
      return [...prevContacts, username]
    })
  }

  function addContactToLocalStorage(username) {
    let contactsFromLocalStorage = localStorage.getItem('contacts')
    contactsFromLocalStorage.push(username)
    localStorage.setItem(contactsFromLocalStorage)
  }

  async function getContactsFromDatabase(userId) {
    let url = 'http://127.0.0.1:8000/api/contacts/'
    try {
      let result = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({'user_id': userId}),
      headers: {'Content-Type': 'application/json'}
    })
    let data = await reponse.json()
    return data
  }catch(e) {
    return e
  }
  }


  const value = {
    contacts: contacts,
    setContacts: setContacts,
    addContact: addContact,
    addContactToLocalStorage: addContactToLocalStorage,
    getContactsFromDatabase: getContactsFromDatabase,
  }
  return (
    <ContactsContext.Provider value={value}>
      {props.children}
    </ContactsContext.Provider>
  )
}

export default ContactsProvider