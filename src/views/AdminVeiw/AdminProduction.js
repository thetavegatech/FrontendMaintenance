import React from 'react'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'
import { CSpinner } from '@coreui/react'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { IoIosAddCircle } from 'react-icons/io'
import { TfiExport } from 'react-icons/tfi'
import classNames from 'classnames'
import {
  CButton,
  // CTable,
  // CTableBody,
  // CTableDataCell,
  // CTableHead,
  // CTableHeaderCell,
  // CTableRow,
} from '@coreui/react'
import '../assetTable/asset.css'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

class BDList extends React.Component {
  state = {
    breakdowns: [],
    filteredAssets: [],
    selectedLocation: '',
    searchLocation: '',
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
    this.setState({ searchQuery: query }, this.applyFilters)
  }

  handleDateChange = (field, value) => {
    this.setState({ [field]: value }, this.applyFilters)
  }

  applyFilters = () => {
    const { breakdowns, searchQuery, startDate, endDate } = this.state

    const filteredAssets = breakdowns.filter((breakDown) => {
      const taskLocationLower = (breakDown.Location || '').toLowerCase()
      const startDateMatch =
        !startDate ||
        (breakDown.BreakdownStartDate &&
          new Date(breakDown.BreakdownStartDate) >= new Date(startDate))
      const endDateMatch =
        !endDate ||
        (breakDown.BreakdownStartDate &&
          new Date(breakDown.BreakdownStartDate) <= new Date(endDate))
      return taskLocationLower.includes(searchQuery) && startDateMatch && endDateMatch
    })

    this.setState({ filteredAssets })
  }

  componentDidMount() {
    const { selectedLocation } = this.state

    const apiUrl = selectedLocation
      ? `https://backendmaintenx.onrender.com/api/breakdown?location=${selectedLocation}`
      : 'https://backendmaintenx.onrender.com/api/breakdown'

    axios
      .get(apiUrl)
      .then((response) => {
        const breakdowns = Array.isArray(response.data) ? response.data : [response.data]
        this.setState({ breakdowns, loading: false }, this.applyFilters)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
      })
  }

  exportToExcel = () => {
    const { breakdowns, filteredAssets, searchQuery } = this.state

    const dataToExport = searchQuery ? filteredAssets : breakdowns

    if (!dataToExport.length) {
      alert('No data to export.')
      return
    }

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
      RootCause: item.RootCause,
      PreventiveAction: item.PreventiveAction,
      CorrectiveAction: item.CorrectiveAction,
      TargetDate: item.TargetDate,
      Responsibility: item.Responsibility,
      AttendedBy: item.AttendedBy,
      Status: item.Status,
      SpareParts: item.SpareParts,
      Cost: item.Cost,
      Location: item.Location,
      LineName: item.LineName,
      Remark: item.Remark,
      status: item.Status,
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
    const { breakdowns, filteredAssets, searchQuery, loading, isHovered } = this.state
    const dataToDisplay = searchQuery ? filteredAssets : breakdowns

    return (
      <div className="card shadow-sm mx-auto">
        <Link to="/temperature" style={{ position: 'absolute', top: '15px', right: '10px' }}></Link>

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
          <NavLink to="/breakdownform">
            <IoIosAddCircle
              className="mb-2"
              style={{
                marginBottom: 'rem',
                backgroundColor: 'black',
                marginLeft: '1rem',
                borderRadius: '2rem',
                width: '2rem',
                height: '2rem',
                color: 'white',
                alignContent: 'end',
                position: '',
              }}
            ></IoIosAddCircle>
          </NavLink>
          {/* <h5 style={{ marginLeft: '20px' }}>Production</h5> */}
          <TfiExport
            type="button"
            style={{
              margin: 'rem',
              backgroundColor: '#fff',
              // marginLeft: '2.5rem',
              marginBottom: '5px',
              height: '2rem',
              color: 'gray',
              width: '90px',
            }}
            onClick={this.exportToExcel}
          >
            Export to Excel
          </TfiExport>
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
            <option>Search by Plant</option>
            <option value="Plant 1">Plant 1</option>
            <option value="Plant 2">Plant 2</option>
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
              {dataToDisplay
                .filter((breakdown) => breakdown.Status === 'pending')
                .map((breakdown) => (
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
                {dataToDisplay
                  .filter((breakdown) => breakdown.Status === 'pending')
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
                        <span>{breakDown.MachineName}</span> - <span>{breakDown.Location}</span>
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
              </>
            )}
          </div>
          {loading && (
            <div className="loader-container">
              <CSpinner color="primary" />
              <div className="loader">Loading...</div>
            </div>
          )}
        </div>
      </div>
      // </div>
    )
  }
}

export default BDList
