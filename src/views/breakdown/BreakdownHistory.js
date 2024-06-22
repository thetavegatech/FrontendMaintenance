import React from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import loadingGif from '../assetTable/loader.gif'
import '../assetTable/asset.css'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

class BreakdownHistory extends React.Component {
  state = {
    breakdowns: [],
    selectedMachine: '',
    // mtbf: '',
    mttr: '',
    selectedLocation: '',
    searchLocation: '', // New state for the search term
    message: '',
    searchQuery: '',
    isHovered: false,
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

    // Filter assets based on the search query
    const filteredAssets = this.state.breakdowns.filter((breakDown) => {
      const taskLocationLower = (breakDown.Location || '').toLowerCase()
      // const taskDescriptionLower = (asset.TaskDescription || '').toLowerCase()
      // const scheduledMaintenanceLower = (
      //   asset.ScheduledMaintenanceDatesandIntervals || ''
      // ).toLowerCase()
      // const statusLower = (asset.status || '').toLowerCase()

      return taskLocationLower.includes(query)
      // taskDescriptionLower.includes(query) ||
      // scheduledMaintenanceLower.includes(query) ||
      // statusLower.includes(query)
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
      ? `https://backendmaintenx.onrender.com/api/breakdown?location=${selectedLocation}`
      : 'https://backendmaintenx.onrender.com/api/breakdown'

    axios
      .get(apiUrl)
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

  calculateMTTR = () => {
    const { breakdowns, selectedMachine } = this.state

    if (!selectedMachine) {
      this.setState({ mttr: 'Please select a machine.' })
      return
    }

    const filteredBreakdowns = breakdowns.filter(
      (breakdown) => breakdown.MachineName === selectedMachine,
    )

    if (filteredBreakdowns.length === 0) {
      this.setState({ mttr: 'No breakdowns found for selected machine.' })
      return
    }

    let totalRepairTimeMs = 0

    filteredBreakdowns.forEach((breakdown) => {
      const startDate = new Date(breakdown.BreakdownStartDate)
      const endDate = new Date(breakdown.BreakdownEndDate)
      const repairTimeMs = endDate - startDate
      totalRepairTimeMs += repairTimeMs
    })

    const totalRepairTimeHours = totalRepairTimeMs / (1000 * 3600) // Convert milliseconds to hours

    const mttr = totalRepairTimeHours / filteredBreakdowns.length

    this.setState({ mttr })
  }

  calculateMTBF = () => {
    const { breakdowns, selectedMachine } = this.state

    if (!selectedMachine) {
      this.setState({ mtbf: 'Please select a machine.' })
      return
    }

    const filteredBreakdowns = breakdowns.filter(
      (breakdown) => breakdown.MachineName === selectedMachine,
    )

    if (filteredBreakdowns.length === 0) {
      this.setState({ mtbf: 'No breakdowns found for selected machine.' })
      return
    }

    const fixedOperatingTime = 208 * 3600 * 1000 // 8 hours in milliseconds
    const numberOfFailures = filteredBreakdowns.length

    const mtbf = fixedOperatingTime / (numberOfFailures * 1000 * 3600) // Convert milliseconds to hours

    this.setState({ mtbf })
  }

  exportToExcel = () => {
    const { breakdowns } = this.state
    // const dataToExport = searchQuery ? filteredBreakdowns : breakdowns
    const dataToExport = breakdowns
    const exportData = dataToExport.map((item) => ({
      Date: format(new Date(item.BreakdownStartDate), 'HH:mm:ss dd-MM-yyyy'),
      MachineName: item.MachineName,
      BreakdownStartDate: item.BreakdownStartDate,
      BreakdownType: item.BreakdownType,
      BreakdownEndDate: item.BreakdownEndDate,
      Shift: item.Shift,
      Operations: item.Operations,
      BreakdownPhenomenons: item.BreakdownPhenomenons,
      WhyWhyAnalysis: item.WhyWhyAnalysis,
      OCC: item.OCC,
      RootCause: item.RootCause,
      PreventiveAction: item.PreventiveAction,
      CorrectiveAction: item.CorrectiveAction,
      TargetDate: item.TargetDate,
      Responsibility: item.Responsibility,
      HD: item.HD,
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

  toggleExpand = (index) => {
    this.setState((prevState) => {
      const expandedItems = prevState.expandedItems.includes(index)
        ? prevState.expandedItems.filter((item) => item !== index)
        : [...prevState.expandedItems, index]
      return { expandedItems }
    })
  }

  render() {
    // const { breakdowns, selectedMachine, mttr } = this.state;
    const {
      breakdowns,
      selectedMachine,
      mtbf,
      mttr,
      filteredAssets,
      searchLocation,
      searchQuery,
      loading,
    } = this.state
    const openBreakdowns = breakdowns.filter((breakdown) => breakdown.Status === 'close')

    const validatedAssets = breakdowns.filter(
      (breakdowns) => breakdowns.Location && breakdowns.Location.trim() !== '',
    )

    const { isHovered } = this.state

    return (
      <>
        <div className="container" style={{ marginTop: '0px' }}>
          <div>
            <label htmlFor="searchTask" style={{ marginRight: '0%', marginTop: '10px' }}>
              <span role="img" aria-label="search-icon"></span>
            </label>
            <select
              value={this.searchQuery}
              onChange={this.handleSearchChange}
              style={{
                // display: 'flex',
                marginBottom: '0px',
                padding: '8px',
                margin: '8px',
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
              <option value="Plant 2">Plant 2</option>
              <option value="Plant 3">Plant 3</option>
            </select>
            <CButton
              className="mb-2"
              style={{ marginTop: '5px', backgroundColor: '#000026' }}
              onClick={this.exportToExcel}
            >
              Export to Excel
            </CButton>
          </div>
          <div className="table-container">
            <Table className="custom-table">
              <Thead>
                <Tr>
                  <Th style={{ textAlign: 'center', height: '40px' }}>Machine Name</Th>
                  <Th style={{ textAlign: 'center' }}>BreakDown Start Date</Th>
                  {/* <Td></Td> */}
                  <Th style={{ textAlign: 'center' }}>Shift</Th>
                  <Th style={{ textAlign: 'center' }}>Line Name</Th>
                  <Th style={{ textAlign: 'center' }}>Location</Th>
                  <Th style={{ textAlign: 'center' }}>End Date</Th>
                  <Th style={{ textAlign: 'center' }}>Status</Th>
                  <Th style={{ textAlign: 'center' }}>Edit</Th>
                  {/* <th>Images</th> */}
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
                      <tr>
                        <td colSpan="11" style={{ textAlign: 'center' }}>
                          {this.state.message}
                        </td>
                      </tr>
                    )}
                    {(this.state.searchQuery
                      ? filteredAssets.filter((breakdown) => openBreakdowns.includes(breakdown))
                      : validatedAssets.filter((breakdown) => openBreakdowns.includes(breakdown))
                    ).map((breakdown) => (
                      <Tr key={breakdown._id}>
                        <Td style={{ textAlign: 'center' }}>{breakdown.MachineName}</Td>
                        <Td style={{ textAlign: 'center' }}>
                          {new Date(breakdown.BreakdownStartDate).toLocaleDateString()}
                        </Td>
                        {/* <Td></Td> */}
                        <Td style={{ textAlign: 'center' }}>{breakdown.Shift}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.LineName}</Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.Location}</Td>
                        <Td style={{ textAlign: 'center' }}>
                          {new Date(breakdown.BreakdownEndDate).toLocaleDateString()}
                        </Td>
                        <Td style={{ textAlign: 'center' }}>{breakdown.Status}</Td>
                        <Td style={{ textAlign: 'center' }}>
                          <NavLink to={`/pbdStatus/${breakdown._id}`} style={{ color: '#000080' }}>
                            <FaEdit />
                          </NavLink>
                        </Td>
                        {/* <td style={{ textAlign: 'center' }}>
                        <NavLink to={`/breakDownRecord/${breakdown._id}`}>
                          <img src={breakdown.Image} height={50} width={50} />
                        </NavLink>
                      </td> */}
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
                                    <strong>BreakdownEndDate:</strong>
                                  </div>
                                  <div className="table-cell">
                                    {new Date(breakDown.BreakdownEndDate).toLocaleDateString()}
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
                                    <strong>Status:</strong>
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
          </div>

          <div
            className="responsive-form"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '10px',
              marginBottom: '10px',
            }}
          >
            <select
              value={this.state.selectedMachine}
              onChange={(e) => this.setState({ selectedMachine: e.target.value })}
              style={{
                padding: '8px',
                border: '1px solid',
                borderRadius: '4px',
                width: '100%',
                maxWidth: '400px',
                margin: '10px 0',
              }}
            >
              <option value="">Select Machine</option>
              {validatedAssets.map((breakdown) => (
                <option key={breakdown._id} value={breakdown.MachineName}>
                  {breakdown.MachineName}
                </option>
              ))}
            </select>
            <div
              className="responsive-buttons"
              style={{ display: 'flex', gap: '10px', marginTop: '10px' }}
            >
              <button
                onClick={this.calculateMTTR}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '150px',
                }}
              >
                Calculate MTTR
              </button>
              <button
                onClick={this.calculateMTBF}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '150px',
                }}
              >
                Calculate MTBF
              </button>
            </div>
            <div
              className="responsive-buttons"
              // style={{ marginTop: '20px', width: '100%', maxWidth: '400px', textAlign: 'center' }}
            >
              <input
                type="text"
                value={mttr}
                readOnly
                placeholder="MTTR Result"
                style={{
                  padding: '8px',
                  border: '1px solid',
                  borderRadius: '4px',
                  width: '100%',
                  margin: '10px',
                  marginBottom: '10px',
                }}
              />
              <input
                type="text"
                value={mtbf}
                readOnly
                placeholder="MTBF Result"
                style={{
                  padding: '8px',
                  border: '1px solid',
                  borderRadius: '4px',
                  width: '100%',
                  margin: '10px',
                  marginBottom: '10px',
                }}
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default BreakdownHistory
