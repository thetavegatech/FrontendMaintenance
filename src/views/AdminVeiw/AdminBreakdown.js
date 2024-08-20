import React from 'react'
// import BDList from './BDList';
import axios from 'axios'
import { FaEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import loadingGif from '../assetTable/loader.gif'
import { CContainer, CSpinner } from '@coreui/react'
import { CInput } from '@coreui/react'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import classNames from 'classnames'
import '../assetTable/asset.css'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import '../assetTable/asset.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

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
    loading: true,
    expandedItems: [],
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true })
  }

  handleMouseLeave = () => {
    this.setState({ isHovered: false })
  }

  // handleSearchChange = (e) => {
  //   const query = e.target.value.toLowerCase()

  //   const filteredAssets = this.state.breakdowns.filter((breakDown) => {
  //     const taskLocationLower = (breakDown.Location || '').toLowerCase()
  //     const startDateMatch =
  //       !this.state.startDate ||
  //       (breakDown.BreakdownStartDate && breakDown.BreakdownStartDate >= this.state.startDate)
  //     const endDateMatch =
  //       !this.state.endDate ||
  //       (breakDown.BreakdownStartDate && breakDown.BreakdownStartDate <= this.state.endDate)
  //     return (
  //       taskLocationLower.includes(query) && startDateMatch && endDateMatch
  //       // ... other conditions if needed
  //     )
  //   })

  //   this.setState({
  //     filteredAssets,
  //     // searchLocation: e.target.value,
  //     searchQuery: query,
  //   })
  // }

  handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    this.setState({ searchQuery: query }, this.applyFilters)
  }

  componentDidMount() {
    const { selectedLocation } = this.state

    const apiUrl = selectedLocation
      ? `http://localhost:4000/getBreakdownData?location=${selectedLocation}`
      : 'http://localhost:4000/api/getBreakdownData'

    axios
      .get('http://localhost:4000/api/breakdown')
      .then((response) => {
        this.setState({
          breakdowns: Array.isArray(response.data) ? response.data : [response.data],
          loading: false,
        })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
      })
  }

  handleLocationChange = (event) => {
    this.setState({ selectedLocation: event.target.value })
  }
  formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString))
  }
  formatTime = (dateString) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }

    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString))
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

  applyFilters = () => {
    const { breakdowns, searchQuery, startDate, endDate } = this.state
    let filteredAssets = breakdowns

    if (searchQuery) {
      filteredAssets = filteredAssets.filter((breakdown) =>
        breakdown.Location.toLowerCase().includes(searchQuery),
      )
    }

    if (startDate) {
      filteredAssets = filteredAssets.filter(
        (breakdown) => new Date(breakdown.BreakdownStartDate) >= new Date(startDate),
      )
    }

    if (endDate) {
      filteredAssets = filteredAssets.filter(
        (breakdown) => new Date(breakdown.BreakdownStartDate) <= new Date(endDate),
      )
    }
    return filteredAssets
  }

  render() {
    // const { breakdowns, filteredAssets, searchLocation, searchQuery, loading } = this.state
    // const openBreakdowns = breakdowns.filter((breakdown) => breakdown.Status === 'open')
    // const validatedAssets = breakdowns.filter(
    //   (breakdowns) => breakdowns.Location && breakdowns.Location.trim() !== '',
    // )

    // const { isHovered } = this.state

    const { breakdowns, loading, isHovered } = this.state
    const openBreakdowns = breakdowns.filter((breakdown) => breakdown.Status === 'open')
    const filteredAssets = this.applyFilters()

    return (
      <div className="card shadow-sm mx-auto" style={{ marginTop: '0.5rem' }}>
        <Link
          to="/temperature"
          style={{ position: 'absolute', top: '10px', right: '10px', overflow: 'hidden' }}
        ></Link>

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
        {/* <div className="container"> */}
        <div>
          <label
            htmlFor="startDate"
            style={{
              // marginLeft: '20rem',
              margin: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              // marginLeft: '1rem',
              whiteSpace: 'nowrap',
              '@media (max-width: 750px)': {
                // marginRight: '0.8rem',
                fontSize: '14px',
              },
            }}
          >
            From:
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
              marginLeft: '10px',
              fontSize: '14px',
            }}
          />
          <label
            htmlFor="endDate"
            style={{
              marginRight: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
            }}
          >
            To:
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
          <label htmlFor="searchTask" style={{ marginLeft: 'rem' }}>
            <span role="img" aria-label="search-icon"></span>
          </label>
          <select
            value={this.searchQuery}
            onChange={this.handleSearchChange}
            style={{
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
            <option value="" disabled selected hidden>
              Search by Plant
            </option>
            <option value="Plant 1">Plant 1</option>
            <option value="Plant 2">Plant 2</option>
            <option value="Plant 3">Plant 3</option>
            <option value="Plant 4">Plant 4</option>
          </select>
        </div>

        <div className="table-container  mobile-wide" style={{ marginTop: '10px' }}>
          <Table className="custom-table">
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
              {loading ? ( // Show loader when loading is true
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    {/* Use an image tag for the loading GIF */}
                    {/* <img src={loadingGif} alt="Loading..." /> */}
                    {/* <p>Loading...</p> */}
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
                  {filteredAssets
                    .filter((breakdown) => openBreakdowns.includes(breakdown))
                    .map((breakdown) => (
                      <Tr key={breakdown._id}>
                        <Td style={{ textAlign: 'center' }}>{breakdown.MachineName}</Td>
                        <Td style={{ textAlign: 'center' }}>
                          {new Date(breakdown.BreakdownStartDate).toISOString().split('T')[0]}
                        </Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.Shift}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.Location}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.LineName}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.Operations}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.BDRaiseName}</Td>

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
                {filteredAssets
                  .filter((breakdown) => openBreakdowns.includes(breakdown))
                  .map((breakdown, index) => (
                    <div
                      key={breakdown._id}
                      className={`list-item ${
                        this.state.expandedItems.includes(index) ? 'expanded' : ''
                      }`}
                    >
                      <div className="expand">
                        {this.state.expandedItems.includes(index) ? (
                          <FaChevronUp onClick={() => this.toggleExpand(index)} />
                        ) : (
                          <FaChevronDown onClick={() => this.toggleExpand(index)} />
                        )}
                      </div>
                      <div>
                        <span>{breakdown.MachineName}</span> - <span>{breakdown.Location}</span>
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
        {/* </div> */}
      </div>
    )
  }
}
export default BDList
