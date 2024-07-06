import React from 'react'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import { CContainer, CSpinner } from '@coreui/react'

// import BDList from './BDList';
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import '../assetTable/asset.css'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
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

    // Filter assets based on the search query
    // const filteredAssets = this.state.breakdowns.filter((breakDown) => {
    // const taskLocationLower = (breakDown.Location || '').toLowerCase()

    const filteredAssets = this.state.breakdowns.filter((breakDown) => {
      const taskLocationLower = (breakDown.Location || '').toLowerCase()
      const startDateMatch =
        !this.state.startDate ||
        (breakDown.BreakdownStartDate && breakDown.BreakdownStartDate >= this.state.startDate)
      const endDateMatch =
        !this.state.endDate ||
        (breakDown.BreakdownStartDate && breakDown.BreakdownStartDate <= this.state.endDate)

      // return taskLocationLower.includes(query)
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

  handleDateChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }

  componentDidMount() {
    const { selectedLocation } = this.state

    const apiUrl = selectedLocation
      ? `https://backendmaintenx.onrender.com/api/breakdown?location=${selectedLocation}`
      : 'https://backendmaintenx.onrender.com/api/breakdown'

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

  exportToExcel = () => {
    // const { breakdowns, searchLocation } = this.state
    const { filteredAssets } = this.state
    // const dataToExport = searchQuery ? filteredBreakdowns : breakdowns

    // Filter data based on the selected plant
    // const filteredData = searchLocation
    //   ? breakdowns.filter((breakdown) => breakdown.Location === searchLocation)
    //   : breakdowns

    // const dataToExport = breakdowns
    // const exportData = dataToExport.map((item) => ({
    if (filteredAssets && filteredAssets.length > 0) {
      const exportData = filteredAssets.map((item) => ({
        Date: format(new Date(item.BreakdownStartDate), 'HH:mm:ss dd-MM-yyyy'),
        MachineName: item.MachineName,
        BreakdownStartDate: item.BreakdownStartDate,
        BreakdownType: item.BreakdownType,
        BreakdownEndDate: item.BreakdownEndDate,
        Shift: item.Shift,
        Operations: item.Operations,
        BreakdownPhenomenons: item.BreakdownPhenomenons,
        WhyWhyAnalysis: item.WhyWhyAnalysis,
        // OCC: item.OCC,
        RootCause: item.RootCause,
        PreventiveAction: item.PreventiveAction,
        CorrectiveAction: item.CorrectiveAction,
        TargetDate: item.TargetDate,
        Responsibility: item.Responsibility,
        AttendedBy: item.AttendedBy,
        // HD: item.HD,
        Status: item.Status,
        SpareParts: item.SpareParts,
        Cost: item.Cost,
        Location: item.Location,
        LineName: item.LineName,
        Remark: item.Remark,
        // Status: item.Status,
      }))

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'ReportData')
      XLSX.writeFile(wb, 'reportdata.xlsx')
    }
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
    // const { breakdowns, selectedLocation } = this.state
    const { breakdowns, filteredAssets, searchLocation, searchQuery, loading } = this.state
    const openBreakdowns = breakdowns.filter((breakdown) => breakdown.Status === 'pending')

    const validatedAssets = breakdowns.filter(
      (breakdowns) => breakdowns.Location && breakdowns.Location.trim() !== '',
    )

    const { isHovered } = this.state

    return (
      <>
        <div className="container">
          <div>
            <NavLink to="/breakdownForm">
              {' '}
              <CButton
                // color="info"
                // shape="rounded-pill"
                className="mb-2"
                style={{ marginTop: '5px', backgroundColor: '#000026' }}
              >
                Add New
              </CButton>
            </NavLink>
            <label
              htmlFor="startDate"
              style={{
                // marginLeft: '20rem',
                marginRight: '0.2rem',
                fontSize: '16px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                '@media (max-width: 750px)': {
                  // marginLeft: '3rem',
                  // marginRight: '0.8rem',
                  fontSize: '14px',
                },
              }}
            >
              From Date:
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
                marginRight: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              To Date:
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
                // marginLeft: '70%',
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
              <option>Search by Location</option>
              <option value="Plant 1">Plant 1</option>
              <option value="Plant 2">Plant 2 </option>
              <option value="Plant 3">Plant 3</option>
              <option value="Plant 4">Plant 4</option>
            </select>
          </div>
          <div className="table-container">
            <Table className="custom-table">
              <Thead>
                <Tr>
                  <Th style={{ textAlign: 'center', height: '40px' }}>Machine Code</Th>
                  <Th style={{ textAlign: 'center' }}>BreakDown Start Date</Th>
                  <Th style={{ textAlign: 'center' }}>Breakdown Type</Th>
                  <Th style={{ textAlign: 'center' }}>Location</Th>
                  <Th style={{ textAlign: 'center' }}>Line Name</Th>
                  <Th style={{ textAlign: 'center' }}>Remark</Th>
                  <Th style={{ textAlign: 'center' }}>Status</Th>
                  <Th style={{ textAlign: 'center' }}>Edit</Th>
                  {/* <CTableHeaderCell style={{ textAlign: 'center' }}>excel</CTableHeaderCell> */}
                </Tr>
              </Thead>
              <Tbody>
                {this.state.message && (
                  <Tr>
                    <Td colSpan="8">{this.state.message}</Td>
                  </Tr>
                )}
                {(this.state.searchQuery
                  ? filteredAssets.filter((breakdown) => openBreakdowns.includes(breakdown))
                  : validatedAssets.filter((breakdown) => openBreakdowns.includes(breakdown))
                ).map((breakdown) => (
                  <Tr key={breakdown._id}>
                    <Td style={{ textAlign: 'center' }}>{breakdown.MachineName}</Td>
                    <Td style={{ textAlign: 'center' }}>
                      {' '}
                      {new Date(breakdown.Date).toLocaleDateString()}
                    </Td>
                    <Td style={{ textAlign: 'center' }}>{breakdown.BreakdownType}</Td>
                    <Td style={{ textAlign: 'center' }}>{breakdown.Location}</Td>
                    <Td style={{ textAlign: 'center' }}>{breakdown.LineName}</Td>
                    <Td style={{ textAlign: 'center' }}>{breakdown.Remark}</Td>
                    <Td style={{ textAlign: 'center' }}>{breakdown.Status}</Td>
                    <Td style={{ textAlign: 'center' }}>
                      <NavLink to={`/pbdStatus/${breakdown._id}`} style={{ color: '#000080' }}>
                        <FaEdit />
                      </NavLink>
                    </Td>
                    {/* <CButton
                    type="button"
                    style={{ margin: '1rem', backgroundColor: 'grey' }}
                    onClick={this.exportToExcel}
                  >
                    Export to Excel
                  </CButton> */}
                  </Tr>
                ))}
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
                              {this.state.expandedItems.includes(index) ? (
                                <FaChevronUp onClick={() => this.toggleExpand(index)} />
                              ) : (
                                <FaChevronDown onClick={() => this.toggleExpand(index)} />
                              )}
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
                                    <strong>BreakdownType:</strong>
                                  </div>
                                  <div className="table-cell">{breakDown.BreakdownType}</div>
                                </div>
                                <div className="table-row">
                                  <div className="table-cell">
                                    <strong>LineName:</strong>
                                  </div>
                                  <div className="table-cell">{breakDown.LineName}</div>
                                </div>
                                <div className="table-row">
                                  <div className="table-cell">
                                    <strong>Remark:</strong>
                                  </div>
                                  <div className="table-cell">{breakDown.Remark}</div>
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
                                to={`/pbdStatus/${breakDown._id}`}
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
  }
}
export default BDList
