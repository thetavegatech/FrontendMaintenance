import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { CTable, CTableHead, CButton } from '@coreui/react'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
// import QrReader from 'react-qr-reader'

const PmTable = () => {
  const [pms, setPms] = useState([])
  const [filteredPms, setFilteredPms] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [scannedData, setScannedData] = useState(null)

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/pm')
      .then((response) => {
        const pmData = Array.isArray(response.data) ? response.data : [response.data]
        setPms(pmData)
        setFilteredPms(pmData)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
        setLoading(false)
      })
  }, [])

  const deleteData = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this data?')
    if (isConfirmed) {
      axios
        .delete(`http://localhost:4000/api/pm/${id}`)
        .then((response) => {
          const newPms = pms.filter((pm) => pm._id !== id)
          setPms(newPms)
          setFilteredPms(newPms)
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
    const filteredPms = pms.filter((pm) => {
      const locationLower = (pm.location || '').toLowerCase()
      const assetNameLower = (pm.assetName || '').toLowerCase()
      return locationLower.includes(query) || assetNameLower.includes(query)
    })
    setFilteredPms(filteredPms)
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

  return (
    <div className="container">
      <NavLink to="/pmForm">
        <CButton color="info" className="mb-2" style={{ marginTop: '5px' }}>
          Add New
        </CButton>
      </NavLink>
      <label htmlFor="searchTask" style={{ marginLeft: '70%' }}>
        <span role="img" aria-label="search-icon"></span>
      </label>
      <input
        placeholder="Search by Asset/Location"
        style={{
          marginBottom: '10px',
          padding: '8px',
          border: '1px solid ',
          borderRadius: '4px',
          transition: 'border-color 0.3s ease-in-out, background-color 0.3s ease-in-out',
        }}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <CTable bordered striped hover responsive>
        <CTableHead color="dark">
          <tr>
            <th style={{ textAlign: 'center' }}>Sr No</th>
            <th style={{ textAlign: 'center' }}>Asset Name</th>
            <th style={{ textAlign: 'center' }}>Asset Type</th>
            <th style={{ textAlign: 'center' }}>Location</th>
            <th style={{ textAlign: 'center' }}>PM Task Name</th>
            <th style={{ textAlign: 'center' }}>PM Schedule Date</th>
            <th style={{ textAlign: 'center' }}>Next Schedule Date</th>
            <th style={{ textAlign: 'center' }}>Description</th>
            <th style={{ textAlign: 'center' }}>PM Details</th>
            <th style={{ textAlign: 'center' }}>Status</th>
            <th style={{ textAlign: 'center' }}>QR Code</th>
            <th style={{ textAlign: 'center' }}>Edit</th>
            <th style={{ textAlign: 'center' }}>Delete</th>
          </tr>
        </CTableHead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="13" style={{ textAlign: 'center' }}>
                <p>Loading...</p>
              </td>
            </tr>
          ) : (
            <>
              {message && (
                <tr>
                  <td
                    colSpan="13"
                    style={{ textAlign: 'center', fontStyle: 'italic', color: 'red' }}
                  >
                    {message}
                  </td>
                </tr>
              )}
              {filteredPms.map((pm, index) => (
                <tr key={pm._id}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>{pm.assetName}</td>
                  <td style={{ textAlign: 'center' }}>{pm.assetType}</td>
                  <td style={{ textAlign: 'center' }}>{pm.location}</td>
                  <td style={{ textAlign: 'center' }}>{pm.pmTaskName}</td>
                  <td style={{ textAlign: 'center' }}>
                    {new Date(pm.pmScheduleDate).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {new Date(pm.nextScheduleDate).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'center' }}>{pm.description}</td>
                  <td style={{ textAlign: 'center' }}>{pm.pmDetails}</td>
                  <td style={{ textAlign: 'center' }}>{pm.status}</td>
                  <td style={{ textAlign: 'center' }}>
                    {pm.qrCode && <img src={pm.qrCode} alt="QR Code" width={50} height={50} />}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <NavLink to={`/editpm/${pm._id}`} style={{ color: '#000080' }}>
                      <FaEdit />
                    </NavLink>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn"
                      onClick={() => deleteData(pm._id)}
                      style={{ color: 'red' }}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </CTable>
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
  )
}

export default PmTable
