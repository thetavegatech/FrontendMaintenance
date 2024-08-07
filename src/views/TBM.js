import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { CTable, CTableHead, CButton } from '@coreui/react'
import { MdDelete } from 'react-icons/md'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import { FaEdit } from 'react-icons/fa'
import './assetTable/asset.css'
import classNames from 'classnames'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

const TbmTable = () => {
  const [tbms, setTbms] = useState([])
  const [filteredTbms, setFilteredTbms] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [scannedData, setScannedData] = useState(null)

  useEffect(() => {
    axios
      .get('https://backendmaintenx.onrender.com/api/tbm')
      .then((response) => {
        const tbmData = Array.isArray(response.data) ? response.data : [response.data]
        setTbms(tbmData)
        setFilteredTbms(tbmData)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const updateNextDate = async () => {
      const today = new Date()
      const updatedAssets = await Promise.all(
        tbms.map(async (tbm) => {
          const nextDate = new Date(tbm.nextTbmDate)
          if (today >= nextDate) {
            let daysToAdd = 1
            switch (tbm.tbmFrequency.toLowerCase()) {
              case 'daily':
                daysToAdd = 1
                break
              case 'weekly':
                daysToAdd = 7
                break
              case 'fifteen days':
                daysToAdd = 15
                break
              case 'monthly':
                daysToAdd = 30
                break
              case 'quarterly':
                daysToAdd = 90
                break
              case 'half year':
                daysToAdd = 180
                break
              case 'yearly':
                daysToAdd = 365
                break
              default:
                daysToAdd = 1
            }
            nextDate.setDate(nextDate.getDate() + daysToAdd)
            tbm.nextTbmDate = nextDate.toISOString().split('T')[0]
            tbm.status = 'Pending'
          }
          return tbm
        }),
      )
      setTbms(updatedAssets)
      setFilteredTbms(updatedAssets)
      try {
        await axios.put('https://backendmaintenx.onrender.com/api/tbmupdateRecords', {
          tbms: updatedAssets,
        })
      } catch (error) {
        console.error('Error updating Next Date in the database:', error)
      }
    }

    const scheduleUpdate = () => {
      const now = new Date()
      const nextUpdate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        14,
        27,
        0,
        0, // Set to 11:30 PM
      )

      // If 11:30 PM has already passed for today, schedule for tomorrow
      if (now >= nextUpdate) {
        nextUpdate.setDate(nextUpdate.getDate() + 1)
      }

      const timeToNextUpdate = nextUpdate - now

      setTimeout(() => {
        updateNextDate()
        setInterval(updateNextDate, 24 * 60 * 60 * 1000) // Run every 24 hours
      }, timeToNextUpdate)
    }

    scheduleUpdate()
  }, [tbms])

  const deleteData = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this data?')
    if (isConfirmed) {
      axios
        .delete(`https://backendmaintenx.onrender.com/api/tbm/${id}`)
        .then((response) => {
          const newTbms = tbms.filter((tbm) => tbm._id !== id)
          setTbms(newTbms)
          setFilteredTbms(newTbms)
          setMessage('Data successfully deleted!')
          setTimeout(() => {
            setMessage('')
          }, 2000)
        })
        .catch((error) => {
          console.error('Error deleting data:', error)
          setMessage('Error deleting data. Please try again.')
          setTimeout(() => {
            setMessage('')
          }, 2000)
        })
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    const filteredTbms = tbms.filter((tbm) => {
      const locationLower = (tbm.location || '').toLowerCase()
      const assetNameLower = (tbm.assetName || '').toLowerCase()
      return locationLower.includes(query) || assetNameLower.includes(query)
    })
    setFilteredTbms(filteredTbms)
    setSearchQuery(query)
  }

  const handleScan = (data) => {
    if (data) {
      setScannedData(data)
    }
  }

  const handleError = (err) => {
    console.error(err)
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
      <Link to="/temperature" style={{ position: 'absolute', top: '10px', right: '10px' }}></Link>

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
        <NavLink to="/TBMForm">
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
        <label htmlFor="searchTask" style={{ marginLeft: 'rem' }}>
          <span role="img" aria-label="search-icon"></span>
        </label>
        <input
          placeholder="Search"
          style={{
            display: 'flex',
            marginBottom: '10px',
            padding: '6px',
            border: '1px solid ',
            borderRadius: '6px',
            width: '8rem',
            transition: 'border-color 0.3s ease-in-out, background-color 0.3s ease-in-out',
          }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {/* <h5 style={{ marginLeft: '20px' }}>Create TBM Record</h5> */}
      </div>
      <div className="table-container">
        <Table className="custom-table">
          <Thead style={{ backgroundColor: '#000026', color: 'white' }}>
            <Tr>
              <Th style={{ textAlign: 'center', height: '40px' }}>Sr No</Th>
              <Th style={{ textAlign: 'center' }}>Asset Name</Th>
              <Th style={{ textAlign: 'center' }}>Location</Th>
              {/* <th style={{ textAlign: 'center' }}>Asset Type</th> */}
              {/* <Th style={{ textAlign: 'center' }}>Installation Date</Th> */}
              <Th style={{ textAlign: 'center' }}>TBM Schedule Date</Th>
              <Th style={{ textAlign: 'center' }}>TBM Frequency</Th>
              <Th style={{ textAlign: 'center' }}>Next TBM Date</Th>
              <Th style={{ textAlign: 'center' }}>Status</Th>
              {/* <th style={{ textAlign: 'center' }}>QR Code</th> */}
              <Th style={{ textAlign: 'center' }}>Edit</Th>
              <Th style={{ textAlign: 'center' }}>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center' }}>
                  <p>Loading...</p>
                </td>
              </tr>
            ) : (
              <>
                {message && (
                  <tr>
                    <td
                      colSpan="12"
                      style={{ textAlign: 'center', fontStyle: 'italic', color: 'red' }}
                    >
                      {message}
                    </td>
                  </tr>
                )}
                {filteredTbms.map((tbm, index) => (
                  <Tr key={tbm._id}>
                    <Td style={{ textAlign: 'center' }}>{index + 1}</Td>
                    <Td style={{ textAlign: 'center' }}>{tbm.assetName}</Td>
                    <Td style={{ textAlign: 'center' }}>{tbm.location}</Td>
                    {/* <td style={{ textAlign: 'center' }}>{tbm.assetType}</td> */}
                    {/* <Td style={{ textAlign: 'center' }}>
                    {new Date(tbm.installationDate).toLocaleDateString()}
                  </Td> */}
                    <Td style={{ textAlign: 'center' }}>
                      {new Date(tbm.tbmScheduleDate).toLocaleDateString()}
                    </Td>
                    <Td style={{ textAlign: 'center' }}>{tbm.tbmFrequency}</Td>
                    <Td style={{ textAlign: 'center' }}>
                      {new Date(tbm.nextTbmDate).toLocaleDateString()}
                    </Td>
                    <Td style={{ textAlign: 'center' }}>{tbm.status} </Td>
                    {/* <td style={{ textAlign: 'center' }}>
                    {tbm.qrCode && <img src={tbm.qrCode} alt="QR Code" width={50} height={50} />}
                  </td> */}
                    <Td style={{ textAlign: 'center' }}>
                      <NavLink to={`/edittbm/${tbm._id}`} style={{ color: '#000080' }}>
                        <FaEdit />
                      </NavLink>
                    </Td>
                    <Td style={{ textAlign: 'center' }}>
                      <button
                        className="btn"
                        onClick={() => deleteData(tbm._id)}
                        style={{ color: 'red' }}
                      >
                        <MdDelete />
                      </button>
                    </Td>
                  </Tr>
                ))}
              </>
            )}
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
              {filteredTbms.map((tbm, index) => (
                <div
                  key={tbm._id}
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
                    <span>{tbm.assetName}</span> - <span>{tbm.location}</span>
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
                          {new Date(tbm.tbmScheduleDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>tbmFrequency:</strong>
                        </div>
                        <div className="table-cell">{tbm.tbmFrequency}</div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>nextTbmDate:</strong>
                        </div>
                        <div className="table-cell">
                          {new Date(tbm.nextTbmDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>status:</strong>
                        </div>
                        <div className="table-cell">{tbm.status}</div>
                      </div>
                    </div>
                  </div>
                  <div className="actions">
                    <NavLink to={`/editcbm/${tbm._id}`} style={{ color: '#000080' }}>
                      <FaEdit />
                    </NavLink>
                    <button
                      className="btn"
                      onClick={() => deleteData(tbm._id)}
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
        <div>
          {/* <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '300px' }}
        /> */}
          {scannedData && (
            <div>
              <h3>Scanned Data:</h3>
              <p>{scannedData}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TbmTable
