import React from 'react'
import { CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Perform logout actions here, such as clearing user session or token.

    // For demonstration, let's clear any stored token (if you are using token-based authentication).
    localStorage.removeItem('token')
    sessionStorage.clear()

    // Redirect the user to the login page after logging out.
    navigate('/login')
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div
        style={{
          backgroundColor: '#ccc',
          marginBottom: '30%',
          //   marginLeft: 'auto',
          //   marginRight: 'auto',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          maxWidth: '400px',
        }}
      >
        <h3>Logout</h3>
        <p>Are you sure you want to log out?</p>
        <CButton color="primary" onClick={handleLogout}>
          Logout
        </CButton>
      </div>
    </div>
  )
}

export default Logout
