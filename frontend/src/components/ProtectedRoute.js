import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useUsers } from '../contexts/UserProvider'

export const ProtectedRoute = (props) => {
    const { isLoggedIn } = useUsers()
    const navigate = useNavigate()

        if (!isLoggedIn) {
            return <Navigate to='/login/' />
        }
        return props.children

}
