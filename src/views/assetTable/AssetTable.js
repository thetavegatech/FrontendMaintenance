import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { CButton } from '@coreui/react'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import './asset.css'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

const AssetTable = () => {
  const [assets, setAssets] = useState([])
  const [filteredAssets, setFilteredAssets] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get('https://backendmaintenx.onrender.com/api/assets')
      .then((response) => {
        const assetsData = Array.isArray(response.data) ? response.data : [response.data]
        setAssets(assetsData)
        setFilteredAssets(assetsData)
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
        .delete(`https://backendmaintenx.onrender.com/api/assets/${id}`)
        .then(() => {
          const newAssets = assets.filter((asset) => asset._id !== id)
          setAssets(newAssets)
          setFilteredAssets(newAssets)
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
    const filteredAssets = assets.filter((asset) => {
      const locationLower = (asset.Location || '').toLowerCase()
      const assetNameLower = (asset.AssetName || '').toLowerCase()
      return locationLower.includes(query) || assetNameLower.includes(query)
    })
    setFilteredAssets(filteredAssets)
    setSearchQuery(query)
  }

  const handleResult = (result, error) => {
    if (!!result) {
      console.log('QR Code Result:', result.text)
      navigate(`/assetRecord/${result.text}`)
    }

    if (!!error) {
      console.info(error)
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
    <div className="container">
      <NavLink to="/assetForm">
        <CButton className="mb-2" style={{ marginTop: '10px', backgroundColor: '#000026' }}>
          Add New
        </CButton>
      </NavLink>
      <label htmlFor="searchTask" style={{ marginLeft: '0%' }}>
        <span role="img" aria-label="search-icon"></span>
      </label>
      <input
        placeholder="Search"
        style={{
          marginBottom: '10px',
          padding: '6px',
          border: '1px solid ',
          borderRadius: '6px',
          transition: 'border-color 0.3s ease-in-out, background-color 0.3s ease-in-out',
        }}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className="table-container">
        <Table className="custom-table">
          <Thead>
            <Tr>
              <Th>Sr No</Th>
              <Th>Machine Name</Th>
              <Th>Machine Type</Th>
              <Th>Location</Th>
              <Th>QR Code</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan="8" style={{ textAlign: 'center' }}>
                  <p>Loading...</p>
                </Td>
              </Tr>
            ) : (
              <>
                {message && (
                  <Tr>
                    <Td
                      colSpan="8"
                      style={{ textAlign: 'center', fontStyle: 'italic', color: 'red' }}
                    >
                      {message}
                    </Td>
                  </Tr>
                )}
                {filteredAssets.map((asset, index) => (
                  <Tr key={asset._id}>
                    <Td data-label="Sr No">{index + 1}</Td>
                    <Td data-label="Machine Name">{asset.AssetName}</Td>
                    <Td data-label="Machine Type">{asset.MachineType}</Td>
                    <Td data-label="Location">{asset.Location}</Td>
                    <Td data-label="QR Code">
                      {asset.qrCode && (
                        <img src={asset.qrCode} alt="QR Code" width={50} height={50} />
                      )}
                    </Td>
                    <Td data-label="Edit">
                      <NavLink to={`/editasset/${asset._id}`} style={{ color: '#000080' }}>
                        <FaEdit />
                      </NavLink>
                    </Td>
                    <Td data-label="Delete">
                      <button
                        className="btn"
                        onClick={() => deleteData(asset._id)}
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
              {filteredAssets.map((asset, index) => (
                <div
                  key={asset._id}
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
                    <span>{asset.AssetName}</span> - <span>{asset.Location}</span>
                  </div>
                  <div
                    className={`expanded-content ${
                      expandedItems.includes(index) ? 'visible' : 'hidden'
                    }`}
                  >
                    <div className="table-like">
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>QR Code:</strong>
                        </div>
                        <div className="table-cell">
                          {asset.qrCode && (
                            <img src={asset.qrCode} alt="QR Code" width={50} height={50} />
                          )}
                        </div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>Machine Type:</strong>
                        </div>
                        <div className="table-cell">{asset.MachineType}</div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>Controller:</strong>
                        </div>
                        <div className="table-cell">{asset.Controller}</div>
                      </div>
                      <div className="table-row">
                        <div className="table-cell">
                          <strong>Capacity Spindle:</strong>
                        </div>
                        <div className="table-cell">{asset.CapecitySpindle}</div>
                      </div>
                    </div>
                  </div>
                  <div className="actions">
                    <NavLink to={`/editasset/${asset._id}`} style={{ color: '#000080' }}>
                      <FaEdit />
                    </NavLink>
                    <button
                      className="btn"
                      onClick={() => deleteData(asset._id)}
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

export default AssetTable
