import React from 'react'


const ContactsContext = React.createContext()

function ContactsProvider(props) {
    
  return (
    <ContactsContext.Provider>
      {props.children}
    </ContactsContext.Provider>
  )
}

export default ContactsProvider