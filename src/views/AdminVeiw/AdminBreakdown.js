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

  render() {
    const { breakdowns, filteredAssets, searchLocation, searchQuery, loading } = this.state
    const openBreakdowns = breakdowns.filter((breakdown) => breakdown.Status === 'open')
    const validatedAssets = breakdowns.filter(
      (breakdowns) => breakdowns.Location && breakdowns.Location.trim() !== '',
    )

    const { isHovered } = this.state

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
              marginLeft: '1rem',
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
            From:{' '}
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
            To:{' '}
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
          <label htmlFor="searchTask" style={{ marginLeft: '0%' }}>
            <span role="img" aria-label="search-icon"></span>
          </label>
          <select
            value={this.searchQuery}
            onChange={this.handleSearchChange}
            style={{
              display: '',
              marginBottom: '20px',
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
        </div>

        <div className="table-container">
          <Table className="custom-table">
            <Thead style={{ backgroundColor: '#000026', color: 'white' }}>
              <Tr>
                <Th style={{ textAlign: 'center', color: 'gray', height: '40px' }}>Machine Name</Th>
                <Th style={{ textAlign: 'center', color: 'gray' }}>BreakDown Start Date</Th>
                <Th style={{ textAlign: 'center', color: 'gray' }}>Shift</Th>
                <Th style={{ textAlign: 'center', color: 'gray' }}>Location</Th>
                <Th style={{ textAlign: 'center', color: 'gray' }}>Line Name</Th>
                <Th style={{ textAlign: 'center', color: 'gray' }}>Operations</Th>
                <Th style={{ textAlign: 'center', color: 'gray' }}>Status</Th>
                <Th style={{ textAlign: 'center', color: 'gray' }}>Edit</Th>
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
                        <NavLink to={`/productionBD/${breakdown._id}`} style={{ color: '#000080' }}>
                          <FaEdit />
                        </NavLink>
                      </Td>
                    </Tr>
                  ))}
                </>
              )}
            </Tbody>
          </Table>
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
