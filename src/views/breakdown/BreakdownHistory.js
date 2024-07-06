import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { CContainer, CSpinner } from '@coreui/react'
import { CAvatar, CButton, CTable, CTableHead } from '@coreui/react'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import { useDispatch, useSelector } from 'react-redux'
import { Placeholder } from 'reactstrap'

function BreakdownHistory() {
  const [breakdowns, setBreakdowns] = useState([])
  const [selectedMachine, setSelectedMachine] = useState('')
  const [mttr, setMttr] = useState('')
  const [mtbf, setMtbf] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [Location, setLoction] = useState('')
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [TotalBDTime, setTotalBDTime] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  // const [loggedInUsername, setLoggedInUsername] = useState('Mayuri ')
  const [filteredAssets, setFilteredAssets] = useState([])

  const loggedInUsername = useSelector((state) => state.auth.userInfo?.name)

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
        const response = await axios.get('https://backendmaintenx.onrender.com/api/breakdown')
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

  const exportToExcel = () => {
    // const { breakdowns, searchLocation } = this.state

    // Check if a search plant is selected
    if (!searchLocation) {
      alert('Please select a search plant before exporting to Excel.')
      return
    }

    // Filter data based on the selected plant
    const filteredData = breakdowns.filter((breakdown) =>
      breakdown.Location.toLowerCase().includes(searchTerm.toLowerCase()),
    )

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
      // Status: item.Status,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'ReportData')
    XLSX.writeFile(wb, 'reportdata.xlsx')
  }

  return (
    <>
      <div className="container" style={{ marginTop: '0px' }}>
        <div>
          <CButton
            color="info"
            type="button"
            style={{ margin: '1rem', marginRight: 'rem' }}
            onClick={exportToExcel}
          >
            Export to Excel
          </CButton>
        </div>
        <CTable
          bordered
          striped
          hover
          responsive
          style={{
            marginTop: '20px',
            borderCollapse: 'collapse',
            width: '100%',
          }}
        >
          <CTableHead color="dark">
            <tr>
              <th style={{ textAlign: 'center' }}>Machine Number</th>
              <th style={{ textAlign: 'center' }}>BreakDown Start Date</th>
              <th style={{ textAlign: 'center' }}>BreakDown End Date</th>
              <th style={{ textAlign: 'center' }}>Attended By</th>
              <th style={{ textAlign: 'center' }}>BD Raised By</th>
              <th style={{ textAlign: 'center' }}>Line Name</th>
              <th style={{ textAlign: 'center' }}>Location</th>
              {/* <th style={{ textAlign: 'center' }}>BD Raised By</th> */}
              <th style={{ textAlign: 'center' }}>TotalRepairtime</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th>Attachment</th>
            </tr>
          </CTableHead>
          <tbody>
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
                  <tr key={breakdown._id}>
                    <td style={{ textAlign: 'center' }}>{breakdown.MachineName}</td>
                    <td style={{ textAlign: 'center' }}>
                      {new Date(breakdown.BreakdownStartDate).toISOString().split('T')[0]}
                    </td>
                    {/* <td>{new Date(breakdown.BreakdownStartDate).toISOString().split('T')[0]}</td> */}
                    <td style={{ textAlign: 'center' }}>
                      {new Date(breakdown.BreakdownEndDate).toISOString().split('T')[0]}
                    </td>
                    <td style={{ textAlign: 'center' }}>{breakdown.AttendedBy}</td>
                    <td style={{ textAlign: 'center' }}>{breakdown.BDRaiseName}</td>
                    <td style={{ textAlign: 'center' }}>{breakdown.LineName}</td>
                    <td style={{ textAlign: 'center' }}>{breakdown.Location}</td>
                    {/* <td style={{ textAlign: 'center' }}>
                      {Number(breakdown.TotalBDTime).toFixed(2)}
                    </td> */}
                    <td>
                      {breakdown.TotalBDTime != null ? breakdown.TotalBDTime.toFixed(2) : 'N/A'}
                    </td>

                    <td style={{ textAlign: 'center' }}>{breakdown.Status}</td>
                    <td style={{ textAlign: 'center' }}>
                      <NavLink to={`/pbdStatus/${breakdown._id}`} style={{ color: '#000080' }}>
                        <FaEdit />
                      </NavLink>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {breakdown.Image && (
                        <a href={breakdown.Image} download>
                          Download File
                        </a>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </CTable>
        {loading && (
          <div className="loader-container">
            {/* <div className="loader">Loading...</div> */}
            <CSpinner color="primary" />
            <div className="loader">Loading...</div>
          </div>
        )}

        <div
          className="container"
          style={{
            marginTop: '20px',
            // padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
          }}
        >
          <div className="row g-2">
            <div className="col-md-6" style={{ marginBottom: '10px' }}>
              <label>Select Machine: </label>
              <select
                onChange={(e) => {
                  setSelectedMachine(e.target.value)
                  calculateMTBF() // Call calculateMTBF directly after updating state
                }}
                value={selectedMachine}
                style={{ marginLeft: 'px', padding: '5px' }}
              >
                <option value="">Select Machine</option>
                {Array.from(new Set(breakdowns.map((breakdown) => breakdown.MachineName))).map(
                  (machineName) => (
                    <option key={machineName} value={machineName}>
                      {machineName}
                    </option>
                  ),
                )}
              </select>
              <CButton
                color="info"
                onClick={calculateMTBF}
                // shape="rounded-pill"
                className="mb-2"
                marginLeft="20px"
                padding="8px"
                style={{ marginTop: '5px', marginLeft: '10px' }}
              >
                Calculate MTBF
              </CButton>
            </div>
            <div
              className="col-md-6"
              style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}
            >
              <label style={{ marginLeft: '' }}>MTBF (hours): </label>
              <input
                type="text"
                value={mtbf}
                readOnly
                style={{ marginLeft: 'px', padding: '5px' }}
              />
            </div>

            <div className="col-md-6" style={{ marginBottom: '10px' }}>
              <label>Select Machine: </label>
              <select
                onChange={(e) => {
                  setSelectedMachine(e.target.value)
                  calculateMTTR() // Call calculateMTTR directly after updating state
                }}
                value={selectedMachine}
                style={{ marginLeft: 'px', padding: '5px' }}
              >
                <option value="">Select Machine</option>
                {Array.from(new Set(breakdowns.map((breakdown) => breakdown.MachineName))).map(
                  (machineName) => (
                    <option key={machineName} value={machineName}>
                      {machineName}
                    </option>
                  ),
                )}
              </select>
              <CButton
                color="info"
                onClick={calculateMTTR}
                // shape="rounded-pill"
                className="mb-2"
                marginLeft="20px"
                padding="8px"
                style={{ marginTop: '5px', marginLeft: '10px' }}
              >
                Calculate MTTR
              </CButton>
            </div>
            <div
              className="col-md-6"
              style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}
            >
              <label style={{ marginLeft: '' }}>MTTR (hours): </label>
              <input
                type="text"
                value={mttr}
                readOnly
                style={{ marginLeft: 'px', padding: '5px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BreakdownHistory
