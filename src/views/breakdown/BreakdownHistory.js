import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { CContainer, CSpinner } from '@coreui/react'
import { CAvatar, CButton, CTable, CTableHead } from '@coreui/react'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import '../assetTable/asset.css'
import classNames from 'classnames'
import { TfiExport } from 'react-icons/tfi'
import { useDispatch, useSelector } from 'react-redux'
import { Placeholder } from 'reactstrap'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import { CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react'

function BreakdownHistory() {
  const [breakdowns, setBreakdowns] = useState([])
  const [selectedMachine, setSelectedMachine] = useState('')
  // const [mttr, setMttr] = useState('')
  // const [mtbf, setMtbf] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [Location, setLoction] = useState('')
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [TotalBDTime, setTotalBDTime] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  // const [loggedInUsername, setLoggedInUsername] = useState('Mayuri ')
  const [filteredAssets, setFilteredAssets] = useState([])

  const loggedInUsername = useSelector((state) => state.auth.userInfo?.name)
  // const [selectedMachine, setSelectedMachine] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [mttr, setMttr] = useState(null)
  const [mtbf, setMtbf] = useState(null)
  const loggedInUserLocation = useSelector((state) => state.auth.userInfo?.plant)
  // const loggedInUserLocation = 'AAAPL-29'
  const openBreakdowns = breakdowns.filter((breakdown) => breakdown.Status === 'close')

  const validatedAssets = breakdowns.filter(
    (breakdowns) => breakdowns.Location && breakdowns.Location.trim() !== '',
  )

  // Plant options for the dropdown
  const plantOptions = ['AAAPL-27', 'AAAPL- 89', 'AAAPL-29', 'DPAPL - 236', 'DPAPL- GN']

  // const handleFilterChange = (value) => {
  //   setSearchTerm(value) // Update search term

  //   if (value === 'All Plants') {
  //     setFilteredAssets(validatedAssets) // If 'All Plants' selected, show all assets
  //   } else {
  //     // Filter assets based on selected plant, open breakdowns, and logged-in user
  //     const filtered = breakdowns.filter(
  //       (breakdown) =>
  //         breakdown.Location.toLowerCase().includes(value.toLowerCase()) &&
  //         openBreakdowns.includes(breakdown) &&
  //         breakdown.BDRaiseName === loggedInUsername,
  //     )
  //     setFilteredAssets(filtered)
  //   }
  // }

  const handleSearchChange = (event) => {
    console.log('Handle search change triggered')
    const searchTerm = event.target.value.toLowerCase() // Convert search term to lowercase
    setSearchTerm(searchTerm) // Update search term state
    setSearchLocation(searchTerm)
    console.log('Search location:', searchLocation)

    // If 'All Plants' selected, show all validated assets
    if (searchTerm === 'all plants') {
      setBreakdowns(breakdowns)
    } else {
      // Filter breakdowns based on search term
      const filtered = breakdowns.filter((breakdown) => {
        const breakdownValues = Object.values(breakdown).map((value) => String(value).toLowerCase())
        return breakdownValues.some((value) => value.includes(searchTerm))
      })
      setFilteredAssets(filtered)
    }
  }

  useEffect(() => {
    const calculateTotalBDTime = () => {
      if (!breakdowns || breakdowns.length === 0) return

      const breakdownsWithTotalBDTime = breakdowns.map((breakdown) => {
        const startDateTime = new Date(`${breakdown.BreakdownStartDate}`)
        const endDateTime = new Date(`${breakdown.BreakdownEndDate}`)

        const repairTimeMs = endDateTime - startDateTime
        const repairTimeHours = repairTimeMs / (1000 * 60 * 60) // milliseconds to hours

        return {
          ...breakdown,
          TotalBDTime: repairTimeHours, // Assign TotalBDTime to the breakdown object
        }
      })

      setBreakdowns(breakdownsWithTotalBDTime)
    }

    calculateTotalBDTime()
  }, [breakdowns])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/breakdown')
        // Filter breakdowns based on the logged-in user's location and status
        const filteredBreakdowns = response.data.filter(
          (breakdown) =>
            breakdown.Location === loggedInUserLocation && breakdown.Status === 'close',
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

  // useEffect(() => {
  //   const apiUrl = selectedLocation
  //     ? `http://localhost:5000/getBreakdownData?location=${selectedLocation}`
  //     : 'http://localhost:5000/getBreakdownData'

  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       setBreakdowns(Array.isArray(response.data) ? response.data : [response.data])
  //       setLoading(false)
  //       console.log('TotalBDTime saved to backend:', response.data, TotalBDTime)
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error)
  //       alert('Error fetching data')
  //     })
  // }, [selectedLocation])

  // const calculateMTTR = () => {
  //   // const { breakdowns, selectedMachine } = this.state

  //   if (!selectedMachine) {
  //     setSelectedMachine({ mttr: 'Please select a machine.' })
  //     return
  //   }

  //   const filteredBreakdowns = breakdowns.filter(
  //     (breakdown) => breakdown.MachineName === selectedMachine,
  //   )

  //   if (filteredBreakdowns.length === 0) {
  //     setSelectedMachine({ mttr: 'No breakdowns found for selected machine.' })
  //     return
  //   }

  //   let totalRepairTimeMs = 0

  //   filteredBreakdowns.forEach((breakdown) => {
  //     const startDate = new Date(breakdown.BreakdownStartDate)
  //     const endDate = new Date(breakdown.BreakdownEndDate)
  //     const repairTimeMs = endDate - startDate
  //     totalRepairTimeMs = repairTimeMs
  //   })

  //   const totalRepairTimeHours = totalRepairTimeMs / (1000 * 3600) // Convert milliseconds to hours
  //   console.log(totalRepairTimeHours, totalRepairTimeMs)
  //   const mttr = totalRepairTimeHours / filteredBreakdowns.length

  //   setMttr({ mttr })
  // }

  // const calculateMTBF = () => {
  //   // const { breakdowns, selectedMachine } = this.state

  //   if (!selectedMachine) {
  //     setSelectedMachine({ mtbf: 'Please select a machine.' })
  //     return
  //   }

  //   const filteredBreakdowns = breakdowns.filter(
  //     (breakdown) => breakdown.MachineName === selectedMachine,
  //   )

  //   if (filteredBreakdowns.length === 0) {
  //     setMtbf('No breakdowns found for selected machine.')
  //     return
  //   }

  //   const fixedOperatingTime = 208 * 3600 * 1000 // 8 hours in milliseconds
  //   const numberOfFailures = filteredBreakdowns.length

  //   const mtbf = fixedOperatingTime / (numberOfFailures * 1000 * 3600) // Convert milliseconds to hours

  //   setMtbf(mtbf)
  // }

  const exportToExcel = () => {
    // const { breakdowns, searchLocation } = this.state

    // Check if a search plant is selected
    // if (!searchLocation) {
    //   alert('Please select a search plant before exporting to Excel.')
    //   return
    // }

    // Filter data based on the selected plant
    const filteredData = breakdowns.filter((breakdown) =>
      breakdown.Location.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // if (filteredData.length === 0) {
    //   alert('No data found for the selected plant. Please refine your search.')
    //   return
    // }

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
      // HD: item.HD,
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

    // Set column widths
    const columnWidths = [
      { wpx: 150 }, // Date
      { wpx: 200 }, // MachineName
      { wpx: 150 }, // BreakdownStartDate
      { wpx: 150 }, // BreakdownEndDate
      { wpx: 100 }, // TotalBDTime
      { wpx: 150 }, // BreakdownType
      { wpx: 100 }, // Shift
      { wpx: 200 }, // Operations
      { wpx: 200 }, // BreakdownPhenomenons
      { wpx: 250 }, // WhyWhyAnalysis
      { wpx: 150 }, // Attended_By
      { wpx: 150 }, // BD_Raised_By
      { wpx: 250 }, // RootCause
      { wpx: 250 }, // PreventiveAction
      { wpx: 250 }, // CorrectiveAction
      { wpx: 150 }, // TargetDate
      { wpx: 150 }, // Responsibility
      { wpx: 100 }, // HD
      { wpx: 100 }, // Status
      { wpx: 150 }, // SpareParts
      { wpx: 100 }, // Cost
      { wpx: 150 }, // Location
      { wpx: 150 }, // LineName
      { wpx: 250 }, // Remark
    ]
    ws['!cols'] = columnWidths

    XLSX.writeFile(wb, 'reportdata.xlsx')
  }

  // const calculateMTTR = () => {
  //   const filteredBreakdowns = this.filterBreakdownsByMonthYear()
  //   const { selectedMachine } = this.state

  //   if (!selectedMachine) {
  //     this.setState({ mttr: null })
  //     return
  //   }

  //   const machineBreakdowns = filteredBreakdowns.filter(
  //     (breakdown) => breakdown.MachineName === selectedMachine,
  //   )

  //   if (machineBreakdowns.length === 0) {
  //     this.setState({ mttr: null })
  //     return
  //   }

  //   let totalRepairTimeMs = 0

  //   machineBreakdowns.forEach((breakdown) => {
  //     const startDate = new Date(breakdown.BreakdownStartDate)
  //     const endDate = new Date(breakdown.BreakdownEndDate)
  //     const repairTimeMs = endDate - startDate
  //     totalRepairTimeMs += repairTimeMs
  //   })

  //   const totalRepairTimeHours = totalRepairTimeMs / (1000 * 3600) // Convert milliseconds to hours
  //   const mttr = totalRepairTimeHours / machineBreakdowns.length
  //   console.log(machineBreakdowns.length, totalRepairTimeHours)
  //   this.setState({ mttr })
  // }

  // const calculateMTBF = () => {
  //   const filteredBreakdowns = this.filterBreakdownsByMonthYear()
  //   const { selectedMachine } = this.state

  //   if (!selectedMachine) {
  //     this.setState({ mtbf: null })
  //     return
  //   }

  //   const machineBreakdowns = filteredBreakdowns.filter(
  //     (breakdown) => breakdown.MachineName === selectedMachine,
  //   )

  //   if (machineBreakdowns.length === 0) {
  //     this.setState({ mtbf: null })
  //     return
  //   }

  //   const fixedOperatingTime = 208 * 3600 * 1000 // 8 hours in milliseconds
  //   const numberOfFailures = machineBreakdowns.length

  //   const mtbf = fixedOperatingTime / (numberOfFailures * 1000 * 3600) // Convert milliseconds to hours
  //   console.log(numberOfFailures, mtbf)
  //   this.setState({ mtbf })
  // }

  const calculateMTTR = () => {
    // const { breakdowns, selectedMachine } = this.state

    if (!selectedMachine) {
      setSelectedMachine({ mttr: 'Please select a machine.' })
      return
    }

    const filteredBreakdowns = breakdowns.filter(
      (breakdown) => breakdown.MachineName === selectedMachine,
    )

    if (filteredBreakdowns.length === 0) {
      setSelectedMachine({ mttr: 'No breakdowns found for selected machine.' })
      return
    }

    let totalRepairTimeMs = 0

    filteredBreakdowns.forEach((breakdown) => {
      const startDate = new Date(breakdown.BreakdownStartDate)
      const endDate = new Date(breakdown.BreakdownEndDate)
      const repairTimeMs = endDate - startDate
      totalRepairTimeMs = repairTimeMs
    })

    const totalRepairTimeHours = totalRepairTimeMs / (1000 * 3600) // Convert milliseconds to hours
    console.log(totalRepairTimeHours, totalRepairTimeMs)
    const mttr = totalRepairTimeHours / filteredBreakdowns.length

    setMttr({ mttr })
  }

  const calculateMTBF = () => {
    // const { breakdowns, selectedMachine } = this.state

    if (!selectedMachine) {
      setSelectedMachine({ mtbf: 'Please select a machine.' })
      return
    }

    const filteredBreakdowns = breakdowns.filter(
      (breakdown) => breakdown.MachineName === selectedMachine,
    )

    if (filteredBreakdowns.length === 0) {
      setMtbf('No breakdowns found for selected machine.')
      return
    }

    const fixedOperatingTime = 208 * 3600 * 1000 // 8 hours in milliseconds
    const numberOfFailures = filteredBreakdowns.length

    const mtbf = fixedOperatingTime / (numberOfFailures * 1000 * 3600) // Convert milliseconds to hours

    setMtbf(mtbf)
  }

  const [expandedItems, setExpandedItems] = useState([])

  const toggleExpand = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index))
    } else {
      setExpandedItems([...expandedItems, index])
    }
  }

  const handleDateChange = (event) => {
    this.setState({ [event.target.id]: event.target.value })
  }
  const [modalVisible, setModalVisible] = useState(false)
  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }
  return (
    <>
      <div className="card shadow-sm mx-auto">
        <Link to="/temperature" style={{ position: 'absolute', top: '15px', right: '10px' }}></Link>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
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
          <TfiExport
            type="button"
            style={{
              margin: 'rem',
              backgroundColor: '',
              marginLeft: '1rem',
              marginBottom: '5px',
              height: '2rem',
              color: 'gray',
              width: '50px',
            }}
            onClick={exportToExcel}
          >
            Export to Excel
          </TfiExport>

          {/* <CButton
            onClick={toggleModal}
            style={{
              backgroundColor: 'grey',
              width: '15rem',
              marginBottom: '1rem',
              marginLeft: '1.5rem',
            }}
          >
            Calculate MTBF & MTTR
          </CButton> */}
        </div>
        {/* </div> */}
        {/* <CButton
          onClick={toggleModal}
          style={{
            backgroundColor: 'grey',
            width: '15rem',
            marginBottom: '1rem',
            marginLeft: '1.5rem',
          }}
        >
          Calculate MTBF & MTTR
        </CButton> */}
        <div className="table-container  mobile-wide">
          <Table className="custom-table">
            <Thead>
              <Tr>
                <Th style={{ textAlign: 'center' }}>Machine Number</Th>
                <Th style={{ textAlign: 'center' }}>BreakDown Start Date</Th>
                <Th style={{ textAlign: 'center' }}>BreakDown End Date</Th>
                <Th style={{ textAlign: 'center' }}>Attended By</Th>
                {/* <Th style={{ textAlign: 'center' }}>BD Raised By</Th> */}
                <Th style={{ textAlign: 'center' }}>Line Name</Th>
                <Th style={{ textAlign: 'center' }}>Location</Th>
                {/* <th style={{ textAlign: 'center' }}>BD Raised By</th> */}
                <Th style={{ textAlign: 'center' }}>TotalRepairtime</Th>
                <Th style={{ textAlign: 'center' }}>Status</Th>
                <Th style={{ textAlign: 'center' }}>Edit</Th>
                {/* <Th>Attachment</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center' }}>
                    <CSpinner color="primary" />
                    <div className="loader">Loading...</div>
                  </td>
                </tr>
              ) : (
                breakdowns
                  .filter((breakdown) => {
                    // Filter breakdowns based on the search term
                    const searchTermLowerCase = searchTerm.toLowerCase()
                    return breakdown.Location.toLowerCase().includes(searchTermLowerCase)
                  })
                  .map((breakdown) => (
                    <Tr key={breakdown._id}>
                      <Td style={{ textAlign: 'center' }}>{breakdown.MachineName}</Td>
                      <Td style={{ textAlign: 'center' }}>
                        {new Date(breakdown.BreakdownStartDate).toLocaleDateString()}
                      </Td>
                      {/* <td>{new Date(breakdown.BreakdownStartDate).toISOString().split('T')[0]}</td> */}
                      <Td style={{ textAlign: 'center' }}>
                        {new Date(breakdown.BreakdownEndDate).toLocaleDateString()}
                      </Td>
                      <Td style={{ textAlign: 'center' }}>{breakdown.AttendedBy}</Td>
                      {/* <Td style={{ textAlign: 'center' }}>{breakdown.BDRaiseName}</Td> */}
                      <Td style={{ textAlign: 'center' }}>{breakdown.LineName}</Td>
                      <Td style={{ textAlign: 'center' }}>{breakdown.Location}</Td>
                      {/* <Td style={{ textAlign: 'center' }}>
                      {Number(breakdown.TotalBDTime).toFixed(2)}
                    </Td> */}
                      <Td>
                        {breakdown.TotalBDTime != null ? breakdown.TotalBDTime.toFixed(2) : 'N/A'}
                      </Td>

                      <Td style={{ textAlign: 'center' }}>{breakdown.Status}</Td>
                      <Td style={{ textAlign: 'center' }}>
                        <NavLink to={`/pbdStatus/${breakdown._id}`} style={{ color: '#000080' }}>
                          <FaEdit />
                        </NavLink>
                      </Td>
                      <Td style={{ textAlign: 'center' }}>
                        {breakdown.Image && (
                          <a href={breakdown.Image} download>
                            Download File
                          </a>
                        )}
                      </Td>
                    </Tr>
                  ))
              )}
            </Tbody>
          </Table>
          <div className="list-view">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {/* {message && (
                  <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'red' }}>
                    {message}
                  </p>
                )} */}
                {breakdowns
                  .filter((breakDown) => {
                    // Filter breakdowns based on the search term
                    const searchTermLowerCase = searchTerm.toLowerCase()
                    return breakDown.Location.toLowerCase().includes(searchTermLowerCase)
                  })
                  .map((breakDown, index) => (
                    <div
                      key={breakDown._id}
                      className={`list-item ${expandedItems.includes(index) ? 'expanded' : ''}`}
                    >
                      <div className="expand d-flex">
                        <div>
                          <span>{breakDown.MachineName}</span> - <span>{breakDown.Location}</span>
                        </div>
                        <div className="Expand1">
                          {expandedItems.includes(index) ? (
                            <FaChevronUp onClick={() => toggleExpand(index)} />
                          ) : (
                            <FaChevronDown onClick={() => toggleExpand(index)} />
                          )}
                        </div>
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
                        <NavLink to={`/pbdStatus/${breakDown._id}`} style={{ color: '#000080' }}>
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
                {/* //{' '} */}
              </>
            )}
            {/* </div> */}
          </div>

          {loading && (
            <div className="loader-container">
              {/* <div className="loader">Loading...</div> */}
              <CSpinner color="primary" />
              <div className="loader">Loading...</div>
            </div>
          )}
          {/* <button onClick={toggleModal}>Open Modal</button> */}
          {/* <CModal visible={modalVisible} onClose={toggleModal}>
          <CModalHeader className="cmodal-header">MTBF & MTTR Calculation</CModalHeader>
          <CModalBody className="cmodal-body">
            <div>
              <label htmlFor="machineSelect">Select Machine:</label>
              <select
                id="machineSelect"
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
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
                onChange={(e) => setSelectedMonth(e.target.value)}
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
                onChange={(e) => setSelectedYear(e.target.value)}
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
            <button className="cbutton mt-2" onClick={calculateMTTR}>
              Calculate MTTR
            </button>
            <button className="cbutton mt-2" onClick={calculateMTBF}>
              Calculate MTBF
            </button>
            <div>
              <strong>MTTR:</strong> {mttr !== null ? `${mttr} hours` : 'N/A'}
            </div>
            <div>
              <strong>MTBF:</strong> {mtbf !== null ? `${mtbf} hours` : 'N/A'}
            </div>
          </CModalBody>
        </CModal> */}
        </div>
      </div>
    </>
  )
}

export default BreakdownHistory
