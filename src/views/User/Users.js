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
import { IoIosAddCircle } from 'react-icons/io'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import loadingGif from '../assetTable/loader.gif'
// import './user.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import '../assetTable/asset.css'
import classNames from 'classnames'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
// import './Users.css' // Import your custom CSS file

export default function Users() {
  const [usernos, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState([])

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
        <NavLink to="/userForm">
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
      </div>
      <div className="table-container mobile-wide">
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '0px' }}>
            <img src={loadingGif} alt="Loading..." />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <table className="custom-table" style={{ width: '100%' }}>
              <Thead color="dark">
                <Tr>
                  <Th>Name</Th>
                  <Th>Phone Number</Th>
                  <Th>Address</Th>
                  <Th>Email</Th>
                  <Th>Location</Th>
                  <Th>Edit</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {usernos.map((user, index) => (
                  <Tr key={user._id}>
                    <Td>{user.name}</Td>
                    <Td>{user.phoneNumber}</Td>
                    <Td>{user.address}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.Location}</Td>
                    <Td>
                      <NavLink to={`/editUser/${user._id}`} className="btn-custom">
                        <FaEdit />
                      </NavLink>
                    </Td>
                    <Td>
                      <button
                        className="btn"
                        onClick={() => deleteData(user._id)}
                        style={{ color: 'red' }}
                      >
                        <MdDelete />
                      </button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </table>
            <div className="list-view">
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
                          <strong>name:</strong>
                        </div>
                        <div className="table-cell">{user.name}</div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>role:</strong>
                        </div>
                        <div className="table-cell">{user.role}</div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>email:</strong>
                        </div>
                        <div className="table-cell">{user.email}</div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>Phone no:</strong>
                        </div>
                        <div className="table-cell">{user.phoneNumber}</div>
                      </div>
                    </div>
                  </div>
                  <div className="actions">
                    <NavLink to={`/editUser/${user._id}`} style={{ color: '#000080' }}>
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
            </div>
          </>
        )}
      </div>
    </div>
  )
}
