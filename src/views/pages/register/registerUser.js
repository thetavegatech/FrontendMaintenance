import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import classNames from 'classnames'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import '../register/asset.css' // Make sure to import your custom CSS file

export default function Users() {
  const [usernos, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get('https://backendmaintenx.onrender.com/getuser')
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
        .delete(`https://backendmaintenx.onrender.com/getuser/${id}`)
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
          className={classNames('box', 'd-flex', 'justify-content-center', 'align-items-center')}
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
            }}
          />
        </NavLink>
      </div>
      <div className="table-container">
        <table className="custom-table" style={{ width: '100%' }}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th style={{ textAlign: 'center' }}>Role</Th>
              <Th style={{ textAlign: 'center' }}>Email</Th>
              <Th style={{ textAlign: 'center' }}>Phone No</Th>
              <Th style={{ textAlign: 'center' }}>Plant</Th>
              <Th style={{ textAlign: 'center' }}>Edit</Th>
              <Th style={{ textAlign: 'center' }}>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usernos.map((user, index) => (
              <Tr key={user._id}>
                <Td style={{ textAlign: 'center' }}>{user.name}</Td>
                <Td style={{ textAlign: 'center' }}>{user.role}</Td>
                <Td style={{ textAlign: 'center' }}>{user.email}</Td>
                <Td style={{ textAlign: 'center' }}>{user.mobileNO}</Td>
                <Td style={{ textAlign: 'center' }}>{user.plant}</Td>
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
                  </button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </table>
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
                        <div className="table-cell">{user.mobileNO}</div>
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
    </div>
  )
}
