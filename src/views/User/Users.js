import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import loadingGif from '../assetTable/loader.gif'
import './user.css'

export default function Users() {
  const [usernos, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get('http://localhost:4000/userInfo')
      .then((response) => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
        setLoading(false)
      })
  }, [])

  const deleteData = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this data?')
    if (isConfirmed) {
      axios
        .delete(`http://localhost:4000/UserInfo/${id}`)
        .then((response) => {
          setUsers(usernos.filter((user) => user._id !== id))
        })
        .catch((error) => {
          console.error('Error deleting user:', error)
        })
    }
  }

  return (
    <div className="container">
      <NavLink to="/userForm">
        <CButton color="info" className="mb-2" style={{ marginTop: '5px' }}>
          Add New
        </CButton>
      </NavLink>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img src={loadingGif} alt="Loading..." />
          <p>Loading...</p>
        </div>
      ) : (
        <CTable
          bordered
          striped
          hover
          responsive
          className="table-custom"
          style={{ backgroundColor: 'grey' }}
        >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Phone Number</CTableHeaderCell>
              <CTableHeaderCell>Address</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Location</CTableHeaderCell>
              <CTableHeaderCell>Edit</CTableHeaderCell>
              <CTableHeaderCell>Delete</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {usernos.map((user) => (
              <CTableRow key={user._id}>
                <CTableDataCell>{user.name}</CTableDataCell>
                <CTableDataCell>{user.phoneNumber}</CTableDataCell>
                <CTableDataCell>{user.address}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell>{user.Location}</CTableDataCell>
                <CTableDataCell>
                  <NavLink to={`/editUser/${user._id}`} className="btn-custom">
                    <FaEdit />
                  </NavLink>
                </CTableDataCell>
                <CTableDataCell>
                  <button onClick={() => deleteData(user._id)} className="btn-custom btn-delete">
                    <MdDelete />
                  </button>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </div>
  )
}
