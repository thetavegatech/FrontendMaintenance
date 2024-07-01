import React from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
// import { CContainer, CSpinner } from '@coreui/react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CContainer,
  CSpinner,
} from '@coreui/react'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
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
    loading: true,
    expandedItems: [],
    filteredAssets: [], // Initialize filteredAssets
    modalVisible: false,
    selectedMonth: '',
    selectedYear: '',
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
      searchLocation: e.target.value,
      searchQuery: query,
    })
  }

  componentDidMount() {
    // Fetch breakdown data and calculate TotalBDTime
    this.fetchBreakdownData()
  }

  fetchBreakdownData = () => {
    const { selectedLocation } = this.state

    const apiUrl = selectedLocation
      ? `https://backendmaintenx.onrender.com/api/breakdown?location=${selectedLocation}`
      : 'https://backendmaintenx.onrender.com/api/breakdown'

    axios
      .get(apiUrl)
      .then((response) => {
        const breakdowns = Array.isArray(response.data) ? response.data : [response.data]
        const breakdownsWithTotalBDTime = breakdowns.map((breakdown) => {
          const startDateTime = new Date(`${breakdown.BreakdownStartDate}`)
          const endDateTime = new Date(`${breakdown.BreakdownEndDate}`)
          const repairTimeMs = endDateTime - startDateTime
          const repairTimeHours = repairTimeMs / (1000 * 60 * 60) // milliseconds to hours
          return {
            ...breakdown,
            TotalBDTime: repairTimeHours,
          }
        })

        this.setState({
          breakdowns: breakdownsWithTotalBDTime,
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

  fetchBreakdownsData = () => {
    const { selectedLocation, fromDate, toDate } = this.state

    let apiUrl = 'http://localhost:5000/getBreakdownData'

    if (selectedLocation || fromDate || toDate) {
      const params = new URLSearchParams()
      if (selectedLocation) params.append('location', selectedLocation)
      if (fromDate) params.append('fromDate', fromDate)
      if (toDate) params.append('toDate', toDate)

      apiUrl = `${apiUrl}?${params.toString()}`
    }

    axios
      .get(apiUrl)
      .then((response) => {
        const breakdowns = Array.isArray(response.data) ? response.data : [response.data]
        const breakdownsWithTotalBDTime = breakdowns.map((breakdown) => {
          const startDateTime = new Date(`${breakdown.BreakdownStartDate}`)
          const endDateTime = new Date(`${breakdown.BreakdownEndDate}`)
          const repairTimeMs = endDateTime - startDateTime
          const repairTimeHours = repairTimeMs / (1000 * 60 * 60) // milliseconds to hours
          return {
            ...breakdown,
            TotalBDTime: repairTimeHours,
          }
        })

        this.setState({
          breakdowns: breakdownsWithTotalBDTime,
          loading: false,
        })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
      })
  }

  calculateMTTR = () => {
    const filteredBreakdowns = this.filterBreakdownsByMonthYear()
    const { selectedMachine } = this.state

    if (!selectedMachine) {
      this.setState({ mttr: null })
      return
    }

    const machineBreakdowns = filteredBreakdowns.filter(
      (breakdown) => breakdown.MachineName === selectedMachine,
    )

    if (machineBreakdowns.length === 0) {
      this.setState({ mttr: null })
      return
    }

    let totalRepairTimeMs = 0

    machineBreakdowns.forEach((breakdown) => {
      const startDate = new Date(breakdown.BreakdownStartDate)
      const endDate = new Date(breakdown.BreakdownEndDate)
      const repairTimeMs = endDate - startDate
      totalRepairTimeMs += repairTimeMs
    })

    const totalRepairTimeHours = totalRepairTimeMs / (1000 * 3600) // Convert milliseconds to hours
    const mttr = totalRepairTimeHours / machineBreakdowns.length
    console.log(machineBreakdowns.length, totalRepairTimeHours)
    this.setState({ mttr })
  }

  calculateMTBF = () => {
    const filteredBreakdowns = this.filterBreakdownsByMonthYear()
    const { selectedMachine } = this.state

    if (!selectedMachine) {
      this.setState({ mtbf: null })
      return
    }

    const machineBreakdowns = filteredBreakdowns.filter(
      (breakdown) => breakdown.MachineName === selectedMachine,
    )

    if (machineBreakdowns.length === 0) {
      this.setState({ mtbf: null })
      return
    }

    const fixedOperatingTime = 208 * 3600 * 1000 // 8 hours in milliseconds
    const numberOfFailures = machineBreakdowns.length

    const mtbf = fixedOperatingTime / (numberOfFailures * 1000 * 3600) // Convert milliseconds to hours
    console.log(numberOfFailures, mtbf)
    this.setState({ mtbf })
  }

  exportToExcel = () => {
    const { breakdowns, searchLocation, fromDate, toDate } = this.state

    const filteredData = breakdowns.filter((breakdown) => {
      const breakdownDate = new Date(breakdown.BreakdownStartDate)
      const isWithinDateRange =
        (!fromDate || breakdownDate >= new Date(fromDate)) &&
        (!toDate || breakdownDate <= new Date(toDate))
      return (
        isWithinDateRange &&
        (!searchLocation || breakdown.Location === searchLocation) &&
        breakdown.Status === 'close'
      )
    })
    // Check if a search plant is selected
    if (!searchLocation) {
      alert('Please select a search plant before exporting to Excel.')
      return
    }

    // Filter data based on the selected plant
    // const filteredData = breakdowns.filter((breakdown) => breakdown.Location === searchLocation)

    if (filteredData.length === 0) {
      alert('No data found for the selected plant. Please refine your search.')
      return
    }

    // const dataToExport = searchQuery ? filteredBreakdowns : breakdowns
    const dataToExport = breakdowns
    // const exportData = dataToExport.map((item) => ({
    const exportData = filteredData.map((item) => ({
      Date: format(new Date(item.BreakdownStartDate), 'dd-MM-yyyy HH:mm:ss'),
      MachineName: item.MachineName,
      BreakdownStartDate: item.BreakdownStartDate,
      BreakdownEndDate: item.BreakdownEndDate,
      TotalBDTime: item.TotalBDTime,
      BreakdownType: item.BreakdownType,
      Shift: item.Shift,
      Operations: item.Operations,
      BreakdownPhenomenons: item.BreakdownPhenomenons,
      WhyWhyAnalysis: item.WhyWhyAnalysis,
      Attended_By: item.AttendedBy,
      BD_Raised_By: item.BDRaiseName,
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

  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }

  filterBreakdownsByMonthYear = () => {
    const { breakdowns, selectedMonth, selectedYear } = this.state

    if (!selectedMonth || !selectedYear) {
      return []
    }

    return breakdowns.filter((breakdown) => {
      const breakdownDate = new Date(breakdown.BreakdownStartDate)
      return (
        breakdownDate.getMonth() + 1 === parseInt(selectedMonth, 10) &&
        breakdownDate.getFullYear() === parseInt(selectedYear, 10)
      )
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
      loading,
      fromDate,
      selectedMonth,
      selectedYear,
      toDate,
      modalVisible,
    } = this.state
    const openBreakdowns = breakdowns.filter((breakdown) => breakdown.Status === 'close')
    const filteredBreakdowns = openBreakdowns.filter((breakdown) => {
      const breakdownDate = new Date(breakdown.BreakdownStartDate)
      const isWithinDateRange =
        (!fromDate || breakdownDate >= new Date(fromDate)) &&
        (!toDate || breakdownDate <= new Date(toDate))
      return isWithinDateRange && (!searchLocation || breakdown.Location === searchLocation)
    })
    const validatedAssets = breakdowns.filter(
      (breakdowns) => breakdowns.Location && breakdowns.Location.trim() !== '',
    )
    const { isHovered } = this.state

    return (
      <>
        <div className="container" style={{ marginTop: '0px' }}>
          <div>
            <label htmlFor="searchTask" style={{ marginRight: '0%', marginTop: '15px' }}>
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
            <CButton onClick={this.toggleModal} style={{ backgroundColor: '#000026' }}>
              Calculate MTBF & MTTR
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
                  <th style={{ textAlign: 'center' }}>TotalRepairtime</th>
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
                      {/* <img src={loadingGif} alt="Loading..." />
                      <p>Loading...</p> */}
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
                        <Td style={{ textAlign: 'center' }}>
                          {breakdown.TotalBDTime != null ? breakdown.TotalBDTime.toFixed(2) : 'N/A'}
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

          <CModal visible={modalVisible} onClose={this.toggleModal}>
            <CModalHeader className="cmodal-header">MTBF & MTTR Calculation</CModalHeader>
            <CModalBody className="cmodal-body">
              <div>
                <label htmlFor="machineSelect">Select Machine:</label>
                <select
                  id="machineSelect"
                  value={selectedMachine}
                  onChange={(e) => this.setState({ selectedMachine: e.target.value })}
                  className="cmodal-body select"
                >
                  <option value="">Select Machine</option>
                  {Array.from(new Set(breakdowns.map((breakdown) => breakdown.MachineName))).map(
                    (machineName, index) => (
                      <option key={index} value={machineName}>
                        {machineName}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="monthSelect">Select Month:</label>
                <select
                  id="monthSelect"
                  value={selectedMonth}
                  onChange={(e) => this.setState({ selectedMonth: e.target.value })}
                  className="cmodal-body select"
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="yearSelect">Select Year:</label>
                <select
                  id="yearSelect"
                  value={selectedYear}
                  onChange={(e) => this.setState({ selectedYear: e.target.value })}
                  className="cmodal-body select"
                >
                  <option value="">Select Year</option>
                  {Array.from(
                    new Set(
                      breakdowns.map((breakdown) =>
                        new Date(breakdown.BreakdownStartDate).getFullYear(),
                      ),
                    ),
                  ).map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <button className="cbutton mt-2" onClick={this.calculateMTTR}>
                Calculate MTTR
              </button>
              <button className="cbutton mt-2" onClick={this.calculateMTBF}>
                Calculate MTBF
              </button>
              <div>
                <strong>MTTR:</strong> {mttr !== null ? mttr : 'N/A'} hours
              </div>
              <div>
                <strong>MTBF:</strong> {mtbf !== null ? mtbf : 'N/A'} hours
              </div>
            </CModalBody>
            <CModalFooter>
              <button className="cbutton" onClick={this.toggleModal}>
                Close
              </button>
            </CModalFooter>
          </CModal>
        </div>
      </>
    )
  }
}

export default BreakdownHistory
