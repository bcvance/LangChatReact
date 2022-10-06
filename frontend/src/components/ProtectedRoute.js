import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useUsers } from '../contexts/UserProvider'
import ConversationsProvider from '../contexts/ConversationsProvider'
import ContactsProvider from '../contexts/ContactsProvider'
import UserProvider from '../contexts/UserProvider'

export const ProtectedRoute = (props) => {
    const { isLoggedIn } = useUsers()
    const navigate = useNavigate()

        if (!isLoggedIn) {
            return <Navigate to='/login/' />
        }
        return (
                <ConversationsProvider>
                    <ContactsProvider>
                        {props.children}
                    </ContactsProvider>
                </ConversationsProvider>
        )

}
