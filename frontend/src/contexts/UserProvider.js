import React, { useContext, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const UserContext = React.createContext();

export function useUsers() {
    return useContext(UserContext)
}

export function UsersProvider(props) {
    const [activeUser, setActiveUser] = useLocalStorage('user', {})

    const value = {
        activeUser: activeUser,
        setActiveUser: setActiveUser
      }

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UsersProvider
