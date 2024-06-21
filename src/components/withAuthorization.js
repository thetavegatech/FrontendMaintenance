import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const withAuthorization = (Component, allowedRoles) => {
  const IsAuthenticated = () => {
    const username = useSelector((state) => state.auth.userInfo?.roles) // Retrieve the token from storage
    return username
  }

  const name = IsAuthenticated()

  // Check if the user's role is included in the allowedRoles array
  if (name === allowedRoles) {
    // User has permission to access the routes
    return <Component />
  } else {
    // User doesn't have permission, redirect them to a restricted page
    return <Navigate to="/login" />
  }

  // Set a displayName for the HOC
}

export default withAuthorization
