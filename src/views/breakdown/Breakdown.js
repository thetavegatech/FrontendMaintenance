// here im getting plant in array but when i get data by loggedin uuser and by its plant then its not showing me data,,,,,,,,
import React, { useState, useEffect } from 'react'
// import BDList from './BDList';
import axios from 'axios'
import { FaEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import classNames from 'classnames'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import '../assetTable/asset.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import '../assetTable/asset.css'
import { CInput } from '@coreui/react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'

const BDList = () => {
  const [breakdowns, setBreakdowns] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const loggedInUserLocation = useSelector((state) => state.auth.userInfo?.plant)

  useEffect(() => {
    fetchData()
  }, [selectedLocation])

  const [expandedItems, setExpandedItems] = useState([])

  const toggleExpand = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index))
    } else {
      setExpandedItems([...expandedItems, index])
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/breakdown')
        // Filter breakdowns based on the logged-in user's location and status
        const filteredBreakdowns = response.data.filter(
          (breakdown) => breakdown.Location === loggedInUserLocation && breakdown.Status === 'open',
        )
        setBreakdowns(filteredBreakdowns)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
      }
    }

    fetchData()
  }, [loggedInUserLocation])

  const fetchData = () => {
    const apiUrl = selectedLocation
      ? `http://localhost:4000/api/breakdown?location=${selectedLocation}`
      : 'http://localhost:4000/api/breakdown'

    axios
      .get(apiUrl)
      .then((response) => {
        setBreakdowns(Array.isArray(response.data) ? response.data : [response.data])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
      })
  }

  // const handleMouseEnter = () => {
  //   this.setState({ isHovered: true })
  // }

  // const handleMouseLeave = () => {
  //   this.setState({ isHovered: false })
  // }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  // const componentDidMount() {
  //   const { selectedLocation } = this.state

  //   const apiUrl = selectedLocation
  //     ? `http://localhost:5000/getBreakdownData?location=${selectedLocation}`
  //     : 'http://localhost:5000/getBreakdownData'

  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       this.setState({
  //         breakdowns: Array.isArray(response.data) ? response.data : [response.data],
  //         loading: false,
  //       })
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error)
  //       alert('Error fetching data')
  //     })
  // }

  // const handleLocationChange = (event) => {
  //   this.setState({ selectedLocation: event.target.value })
  // }
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString))
  }
  const formatTime = (dateString) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }

    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString))
  }

  const handleDateChange = (field, value) => {
    if (field === 'startDate') {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }

  const filteredAssets = breakdowns.filter((breakdown) => {
    const taskLocationLower = (breakdown.Location || '').toLowerCase()
    const startDateMatch =
      !startDate || (breakdown.BreakdownStartDate && breakdown.BreakdownStartDate >= startDate)
    const endDateMatch =
      !endDate || (breakdown.BreakdownStartDate && breakdown.BreakdownStartDate <= endDate)
    return taskLocationLower.includes(searchQuery) && startDateMatch && endDateMatch
  })

  // render() {
  //   const { breakdowns, filteredAssets, searchLocation, searchQuery, loading } = this.state
  //   const openBreakdowns = breakdowns.filter((breakdown) => breakdown.Status === 'open')
  //   const validatedAssets = breakdowns.filter(
  //     (breakdowns) => breakdowns.Location && breakdowns.Location.trim() !== '',
  //   )

  //   const { isHovered } = this.state

  return (
    <>
      {/* <div style={{ display: '', marginBottom: 'px' }}>
        <div
          style={{
            // marginLeft: 'rem',
            marginRight: '0.2rem',
            fontSize: '16px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            marginTop: '10px',
          }}
        >
          <label htmlFor="startDate">From Date: </label>
          <input
            type="date"
            style={{
              padding: '6px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginRight: '10px',
              fontSize: '14px',
            }}
            id="startDate"
            value={startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
          />
        </div>
        <div
          style={{
            marginLeft: '1.3rem',
            fontSize: '16px',
            marginTop: '10px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            marginRight: '0.2rem',
          }}
        >
          <label htmlFor="endDate">To Date: </label>
          <input
            type="date"
            style={{
              padding: '6px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              // marginRight: '10px',
              fontSize: '14px',
              marginBottom: '0.5rem',
            }}
            id="endDate"
            value={endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
          />
        </div>
        <label htmlFor="searchTask" style={{ marginLeft: '0%' }}>
          <span role="img" aria-label="search-icon"></span>
        </label>
        <select
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            display: 'flex',
            marginBottom: '0%',
            padding: '8px',
            border: '1px solid',
            borderRadius: '4px',
            transition: 'border-color 0.3s ease-in-out',
            backgroundColor: 'transparent',
          }}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
        >
          <option>Search by Plant</option>
          <option value="AAAPL-27">AAAPL-27</option>
          <option value="AAAPL-29">AAAPL-29</option>
          <option value="AAAPL- 89">AAAPL- 89</option>
          <option value="DPAPL - 236">DPAPL - 236</option>
          <option value=" DPAPL- GN"> DPAPL- GN</option>
        </select>
        <NavLink to="/worktable">
          <CButton color="info" className="mb-2" style={{ marginTop: '5px' }}>
            Add Work
          </CButton>
        </NavLink>
        <NavLink to="/assetpart">
          <CButton color="info" className="mb-2" style={{ marginTop: '5px', marginLeft: '5px' }}>
            Add Part
          </CButton>
        </NavLink>
      </div> */}

      <div className="card shadow-sm mx-auto" style={{ marginTop: '0.5rem' }}>
        {/* <Link
          to="/temperature"
          style={{ position: 'absolute', top: '10px', right: '10px', overflow: 'hidden' }}
        ></Link> */}

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
          {/* <h5 style={{ marginLeft: '20px' }}>Create TBM Record</h5> */}
        </div>
        <div className="table-container  mobile-wide" style={{ marginTop: '10px' }}>
          <Table className="custom-table" style={{ width: '100%' }}>
            <Thead style={{ backgroundColor: '#000026', color: 'white' }}>
              <Tr>
                <Th style={{ textAlign: 'center', height: '40px' }}>Machine Name</Th>
                <Th style={{ textAlign: 'center' }}>BreakDown Start Date</Th>
                <Th style={{ textAlign: 'center' }}>Shift</Th>
                <Th style={{ textAlign: 'center' }}>Location</Th>
                <Th style={{ textAlign: 'center' }}>Line Name</Th>
                <Th style={{ textAlign: 'center' }}>Operations</Th>
                <Th style={{ textAlign: 'center' }}>BD Raised By</Th>

                <Th style={{ textAlign: 'center' }}>Status</Th>
                <Th style={{ textAlign: 'center' }}>Edit</Th>
              </Tr>
            </Thead>
            <Tbody>
              {message && (
                <Tr>
                  <CTableDataCell colSpan="8" style={{ textAlign: 'center' }}>
                    {message}
                  </CTableDataCell>
                </Tr>
              )}
              {filteredAssets.map((breakdown) => (
                <Tr key={breakdown._id}>
                  <Td style={{ textAlign: 'center' }}>{breakdown.MachineName}</Td>
                  <Td style={{ textAlign: 'center' }}>
                    {new Date(breakdown.BreakdownStartDate).toLocaleDateString()}
                    {/* {new Date(breakdown.BreakdownStartDate).toISOString().split('T')[0]} */}
                  </Td>
                  <Td style={{ textAlign: 'center' }}>{breakdown.Shift}</Td>
                  <Td style={{ textAlign: 'center' }}>{breakdown.Location}</Td>
                  <Td style={{ textAlign: 'center' }}>{breakdown.LineName}</Td>
                  <Td style={{ textAlign: 'center' }}>{breakdown.Operations}</Td>
                  <Td style={{ textAlign: 'center' }}>{breakdown.BDRaiseName}</Td>

                  <Td style={{ textAlign: 'center' }}>{breakdown.Status}</Td>
                  <Td style={{ textAlign: 'center' }}>
                    <NavLink to={`/productionBD/${breakdown._id}`} style={{ color: '#000080' }}>
                      <FaEdit />
                    </NavLink>
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
                {/* {this.message && (
                  <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'red' }}>
                    {this.message}
                  </p>
                )} */}
                {/* {filteredAssets */}
                {filteredAssets.map((breakdown, index) => (
                  <div
                    key={breakdown._id}
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
                      <span>{breakdown.MachineName}</span> - <span>{breakdown.Location}</span>
                    </div>
                    <div
                      className={`expanded-content ${
                        expandedItems.includes(index) ? 'visible' : 'hidden'
                      }`}
                    >
                      <div className="table-like">
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>BreakdownStartDate:</strong>
                          </div>
                          <div className="table-cell">
                            {new Date(breakdown.BreakdownStartDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>Shift:</strong>
                          </div>
                          <div className="table-cell">{breakdown.Shift}</div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>LineName:</strong>
                          </div>
                          <div className="table-cell">{breakdown.LineName}</div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>Operations:</strong>
                          </div>
                          <div className="table-cell">{breakdown.Operations}</div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>status:</strong>
                          </div>
                          <div className="table-cell">{breakdown.Status}</div>
                        </div>
                      </div>
                    </div>
                    <div className="actions">
                      <NavLink to={`/productionBD/${breakdown._id}`} style={{ color: '#000080' }}>
                        <FaEdit />
                      </NavLink>
                      {/* <button
                          className="btn"
                          onClick={() => deleteData(cbm._id)}
                          style={{ color: 'red' }}
                        >
                          <MdDelete />
                        </button> */}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          {loading && (
            <div className="loader-container">
              {/* <div className="loader">Loading...</div> */}
              <CSpinner color="primary" />
              <div className="loader">Loading...</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
  // }
}
export default BDList
