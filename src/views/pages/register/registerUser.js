import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
// import dlt from './delete.png'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import { CButton } from '@coreui/react'
import classNames from 'classnames'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
// import '../asset.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

export default function Users() {
  const [usernos, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user data from the server
    axios
      .get('https://backendmaintenx.onrender.com/getuser')
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
        .delete(`https://backendmaintenx.onrender.com/getuser/${id}`)
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

  const [expandedItems, setExpandedItems] = useState([])

  const toggleExpand = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index))
    } else {
      setExpandedItems([...expandedItems, index])
    }
  }

  return (
    <div className="card shadow-sm mx-auto">
      <Link to="/temperature" style={{ position: 'absolute', top: '15px', right: '10px' }}></Link>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          // className="d-flex justify-content-center align-items-center"
          className={classNames(
            'box',
            'd-flex',
            'justify-content-center',
            'align-items-center',
            'd-flex justify-content-center align-items-center',
          )}
        >
          <MdDashboard
            className="icon"
            style={{
              width: '30px',
              height: '30px',
              fill: 'white',
              marginTop: '1px',
              marginLeft: '3px',
            }}
          />
        </div>
        <NavLink to="/register">
          <IoIosAddCircle
            className="mb-2"
            style={{
              marginBottom: '1.5rem',
              backgroundColor: 'black',
              marginLeft: '1rem',
              borderRadius: '2rem',
              width: '2rem',
              height: '2rem',
              color: 'white',
              alignContent: 'end',
              position: '',
            }}
          ></IoIosAddCircle>
        </NavLink>
        {/* <h5 style={{ marginLeft: '20px' }}>Create TBM Record</h5> */}
      </div>
      {/* <div className="container"> */}
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
        <div className="list-view">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {message && (
                <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'red' }}>{message}</p>
              )}
              {usernos.map((user, index) => (
                <div
                  key={user._id}
                  className={`list-item ${expandedItems.includes(index) ? 'expanded' : ''}`}
                >
                  <div className="expand">
                    {expandedItems.includes(index) ? (
                      <FaChevronUp onClick={() => toggleExpand(index)} />
                    ) : (
                      <FaChevronDown onClick={() => toggleExpand(index)} />
                    )}
                  </div>
                  <div>
                    <span>{user.name}</span> - <span>{user.role}</span>
                  </div>
                  <div
                    className={`expanded-content ${
                      expandedItems.includes(index) ? 'visible' : 'hidden'
                    }`}
                  >
                    <div className="table-like">
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>tbmScheduleDate:</strong>
                        </div>
                        <div className="table-cell">
                          {new Date(user.tbmScheduleDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>tbmFrequency:</strong>
                        </div>
                        <div className="table-cell">{user.tbmFrequency}</div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>nextTbmDate:</strong>
                        </div>
                        <div className="table-cell">
                          {new Date(user.nextTbmDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>status:</strong>
                        </div>
                        <div className="table-cell">{user.status}</div>
                      </div>
                    </div>
                  </div>
                  <div className="actions">
                    <NavLink to={`/editcbm/${user._id}`} style={{ color: '#000080' }}>
                      <FaEdit />
                    </NavLink>
                    <button
                      className="btn"
                      onClick={() => deleteData(user._id)}
                      style={{ color: 'red' }}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}
