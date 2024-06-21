import React from 'react'
// import BDList from './BDList';
import axios from 'axios'
import { FaEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import '../assetTable/asset.css'
import loadingGif from '../assetTable/loader.gif'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

class BDList extends React.Component {
  state = {
    breakdowns: [],
    selectedLocation: '',
    searchLocation: '', // New state for the search term
    message: '',
    searchQuery: '',
    isHovered: false,
    startDate: '',
    endDate: '',
    loading: true, // New state for loading
    expandedItems: [],
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true })
  }

  handleMouseLeave = () => {
    this.setState({ isHovered: false })
  }

  handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()

    const filteredAssets = this.state.breakdowns.filter((breakDown) => {
      const taskLocationLower = (breakDown.Location || '').toLowerCase()
      const startDateMatch =
        !this.state.startDate ||
        (breakDown.BreakdownStartDate && breakDown.BreakdownStartDate >= this.state.startDate)
      const endDateMatch =
        !this.state.endDate ||
        (breakDown.BreakdownStartDate && breakDown.BreakdownStartDate <= this.state.endDate)
      // return taskLocationLower.includes(query)
      // taskDescriptionLower.includes(query) ||
      // scheduledMaintenanceLower.includes(query) ||
      // statusLower.includes(query)
      return (
        taskLocationLower.includes(query) && startDateMatch && endDateMatch
        // ... other conditions if needed
      )
    })

    this.setState({
      filteredAssets,
      // searchLocation: e.target.value,
      searchQuery: query,
    })
  }

  componentDidMount() {
    const { selectedLocation } = this.state

    const apiUrl = selectedLocation
      ? `https://backendmaintenx.onrender.com/getBreakdownData?location=${selectedLocation}`
      : 'https://backendmaintenx.onrender.com/api/getBreakdownData'

    axios
      .get('https://backendmaintenx.onrender.com/api/breakdown')
      .then((response) => {
        this.setState({
          breakdowns: Array.isArray(response.data) ? response.data : [response.data],
          loading: false,
        })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
        this.setState({ loading: false })
      })
  }

  handleLocationChange = (event) => {
    this.setState({ selectedLocation: event.target.value })
  }

  handleDateChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }

  toggleExpand = (index) => {
    this.setState((prevState) => {
      const expandedItems = prevState.expandedItems.includes(index)
        ? prevState.expandedItems.filter((item) => item !== index)
        : [...prevState.expandedItems, index]
      return { expandedItems }
    })
  }

  render() {
    const { breakdowns, filteredAssets, searchLocation, searchQuery, loading } = this.state
    const openBreakdowns = breakdowns.filter((breakdown) => breakdown.Status === 'open')
    const validatedAssets = breakdowns.filter(
      (breakdowns) => breakdowns.Location && breakdowns.Location.trim() !== '',
    )

    const { isHovered } = this.state

    return (
      <>
        <div className="container">
          <div>
            <label
              htmlFor="startDate"
              style={{
                marginLeft: 'rem',
                marginTop: '15px',
                fontSize: '16px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                '@media (max-width: 650px)': {
                  // marginLeft: '3rem',
                  // marginRight: '0.8rem',
                  fontSize: '14px',
                },
              }}
            >
              From Date:{' '}
            </label>
            <input
              type="date"
              id="startDate"
              value={this.state.startDate}
              onChange={(e) => this.handleDateChange('startDate', e.target.value)}
              style={{
                padding: '6px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginRight: '10px',
                marginLeft: '12px',
                fontSize: '14px',
              }}
            />
            <label
              htmlFor="endDate"
              style={{
                marginRight: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              To Date:{' '}
            </label>
            <input
              type="date"
              id="endDate"
              value={this.state.endDate}
              onChange={(e) => this.handleDateChange('endDate', e.target.value)}
              style={{
                padding: '6px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginRight: '10px',
                fontSize: '14px',
                marginBottom: '0.5rem',
              }}
            />
          </div>
          <label htmlFor="searchTask" style={{ marginLeft: '0%' }}>
            <span role="img" aria-label="search-icon"></span>
          </label>
          <select
            value={this.searchQuery}
            onChange={this.handleSearchChange}
            style={{
              display: 'flex',
              marginBottom: '10px',
              padding: '8px',
              border: '1px solid',
              borderRadius: '4px',
              transition: 'border-color 0.3s ease-in-out',
              backgroundColor: isHovered ? '#f0f0f0' : 'transparent',
            }}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            {/* <option value="Plant 1">Search by Plant</option> */}
            <option>Search by Plant </option>
            <option value="Plant 1">Plant 1</option>
            <option value="Plant 2">Plant 2</option>
            <option value="Plant 3">Plant 3</option>
            {/* <option value="Plant 1, Plant 2, Plant 3">Search </option> */}
          </select>
          <div className="table-container">
            <Table className="custom-table">
              <Thead style={{ backgroundColor: '#000026', color: 'white' }}>
                <Tr>
                  <Th style={{ textAlign: 'center', color: 'white', height: '40px' }}>
                    Machine Name
                  </Th>
                  <Th style={{ textAlign: 'center', color: 'white' }}>BreakDown Start Date</Th>
                  <Th style={{ textAlign: 'center', color: 'white' }}>Shift</Th>
                  <Th style={{ textAlign: 'center', color: 'white' }}>Location</Th>
                  <Th style={{ textAlign: 'center', color: 'white' }}>Line Name</Th>
                  <Th style={{ textAlign: 'center', color: 'white' }}>Operations</Th>
                  <Th style={{ textAlign: 'center', color: 'white' }}>Status</Th>
                  <Th style={{ textAlign: 'center', color: 'white' }}>Edit</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? ( // Show loader when loading is true
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      {/* Use an image tag for the loading GIF */}
                      <img src={loadingGif} alt="Loading..." />
                      <p>Loading...</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {this.state.message && (
                      <Tr>
                        <CTableDataCell colSpan="8" style={{ textAlign: 'center' }}>
                          {this.state.message}
                        </CTableDataCell>
                      </Tr>
                    )}
                    {(this.state.searchQuery
                      ? filteredAssets.filter((breakdown) => openBreakdowns.includes(breakdown))
                      : validatedAssets.filter((breakdown) => openBreakdowns.includes(breakdown))
                    ).map((breakdown) => (
                      <Tr key={breakdown._id}>
                        <Td style={{ textAlign: 'center' }}>{breakdown.MachineName}</Td>
                        <Td style={{ textAlign: 'center' }}>
                          {new Date(breakdown.BreakdownStartDate).toISOString().split('T')[0]}
                        </Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.Shift}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.Location}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.LineName}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.Operations}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.Status}</Td>
                        <Td style={{ textAlign: 'center' }}>
                          <NavLink
                            to={`/productionBD/${breakdown._id}`}
                            style={{ color: '#000080' }}
                          >
                            <FaEdit />
                          </NavLink>
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
                  {this.message && (
                    <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'red' }}>
                      {this.message}
                    </p>
                  )}
                  {this.state.searchQuery
                    ? filteredAssets.filter((breakdown) => openBreakdowns.includes(breakdown))
                    : validatedAssets
                        .filter((breakdown) => openBreakdowns.includes(breakdown))
                        .map((breakDown, index) => (
                          <div
                            key={breakDown._id}
                            className={`list-item ${
                              this.state.expandedItems.includes(index) ? 'expanded' : ''
                            }`}
                          >
                            <div className="expand">
                              <FontAwesomeIcon
                                icon={
                                  this.state.expandedItems.includes(index)
                                    ? faChevronUp
                                    : faChevronDown
                                }
                                onClick={() => this.toggleExpand(index)}
                              />
                            </div>
                            <div>
                              <span>{breakDown.MachineName}</span> -{' '}
                              <span>{breakDown.Location}</span>
                            </div>
                            <div
                              className={`expanded-content ${
                                this.state.expandedItems.includes(index) ? 'visible' : 'hidden'
                              }`}
                            >
                              <div className="table-like">
                                <div className="table-row">
                                  <div className="table-cell">
                                    <strong>BreakdownStartDate:</strong>
                                  </div>
                                  <div className="table-cell">
                                    {new Date(breakDown.BreakdownStartDate).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="table-row">
                                  <div className="table-cell">
                                    <strong>Shift:</strong>
                                  </div>
                                  <div className="table-cell">{breakDown.Shift}</div>
                                </div>
                                <div className="table-row">
                                  <div className="table-cell">
                                    <strong>LineName:</strong>
                                  </div>
                                  <div className="table-cell">{breakDown.LineName}</div>
                                </div>
                                <div className="table-row">
                                  <div className="table-cell">
                                    <strong>Operations:</strong>
                                  </div>
                                  <div className="table-cell">{breakDown.Operations}</div>
                                </div>
                                <div className="table-row">
                                  <div className="table-cell">
                                    <strong>status:</strong>
                                  </div>
                                  <div className="table-cell">{breakDown.Status}</div>
                                </div>
                              </div>
                            </div>
                            <div className="actions">
                              <NavLink
                                to={`/productionBD/${breakDown._id}`}
                                style={{ color: '#000080' }}
                              >
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
          </div>
        </div>
      </>
    )
  }
}

export default BDList
