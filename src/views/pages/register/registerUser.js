import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import dlt from './delete.png'
import { CTable, CTableHead, CButton } from '@coreui/react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

export default function Users() {
  const [usernos, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user data from the server
    axios
      .get('http://localhost:4000/getuser')
      .then((response) => {
        setUsers(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  }, [])

  const deleteData = (id) => {
    // Send DELETE request to the server to delete the user
    const isConfirmed = window.confirm('Are you sure you want to delete this data?')
    if (isConfirmed) {
      axios
        .delete(`http://localhost:4000/getuser/${id}`)
        .then((response) => {
          console.log('User deleted successfully:', response.data)
          // Update the user list after deletion
          setUsers(usernos.filter((user) => user._id !== id))
        })
        .catch((error) => {
          console.error('Error deleting user:', error)
        })
    }
  }

  return (
    <div className="container">
      <NavLink to="/register">
        <CButton color="info" className="mb-2" style={{ marginTop: '5px' }}>
          Add New
        </CButton>
      </NavLink>
      <div className="table-container">
        <Table className="custom-table">
          <Thead color="dark">
            <Tr>
              <Th>Name</Th>
              <Th style={{ textAlign: 'center' }}>Role</Th>
              {/* <th style={{ textAlign: 'center' }}>Role</th> */}
              <Th style={{ textAlign: 'center' }}>Email</Th>
              <Th style={{ textAlign: 'center' }}>Phone No</Th>
              <Th style={{ textAlign: 'center' }}>Plant</Th>
              {/* <th style={{ textAlign: 'center' }}>Validation</th> */}
              <Th style={{ textAlign: 'center' }}>Edit</Th>
              <Th style={{ textAlign: 'center' }}>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usernos.map((user) => (
              <Tr key={user.phoneNumber}>
                <Td style={{ textAlign: 'center' }}>{user.name}</Td>
                <Td style={{ textAlign: 'center' }}>{user.role}</Td>
                <Td style={{ textAlign: 'center' }}>{user.email}</Td>
                <Td style={{ textAlign: 'center' }}>{user.mobileNO}</Td>
                <Td style={{ textAlign: 'center' }}>{user.plant}</Td>
                {/* <td style={{ textAlign: 'center' }}>{user.Validation}</td> */}
                <Td style={{ textAlign: 'center' }}>
                  <NavLink to={`/editRegisterUser/${user._id}`} style={{ color: '#000080' }}>
                    <FaEdit />
                  </NavLink>
                </Td>
                <Td style={{ textAlign: 'center' }}>
                  <button
                    className="btn"
                    onClick={() => deleteData(user._id)}
                    style={{ color: 'red' }}
                  >
                    <MdDelete />
                    {/* <img src={dlt} alt="" width={30} height={25} /> */}
                  </button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  )
}
