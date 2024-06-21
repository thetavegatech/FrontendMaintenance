import React, { useState, useEffect } from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane, CButton } from '@coreui/react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import './table.css'

const Inventory = () => {
  const { id } = useParams()
  const [usernos, setUsers] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [assetDetails, setAssetDetails] = useState({})
  const [activeKey, setActiveKey] = useState(1)
  const [slittingData, setSlittingData] = useState([])
  const [pmData, setPmData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [assetNames, setAssetNames] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const loggedInUserrole = useSelector((state) => state.auth.userInfo?.role)
  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        const response = await axios.get(`https://backendmaintenx.onrender.com/api/assets/${id}`)
        setAssetDetails(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching asset details:', error)
        setLoading(false)
      }
    }

    fetchAssetDetails()
  }, [id])

  useEffect(() => {
    const fetchPmData = async () => {
      try {
        const response = await axios.get(
          `https://backendmaintenx.onrender.com/api/pm?assetName=${assetDetails.AssetName}`,
        )
        setPmData(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching PM data:', error)
        setLoading(false)
      }
    }

    fetchPmData()
  }, [])

  useEffect(() => {
    if (assetDetails.AssetName) {
      axios
        .get(
          `https://backendmaintenx.onrender.com/api/breakdown?assetName=${assetDetails.AssetName}`,
        )
        .then((response) => {
          setSlittingData(response.data)
        })
        .catch((error) => {
          console.error('Error fetching breakdown data:', error)
        })
    }
  }, [assetDetails.AssetName])

  return (
    <>
      <CNav
        variant="pills"
        role="tablist"
        className="custom-tabs-nav"
        // style={{ marginBottom: '1rem' }}
      >
        <CNavItem role="presentation">
          <CNavLink
            active={activeKey === 1}
            component="button"
            role="tab"
            aria-controls="home-tab-pane"
            aria-selected={activeKey === 1}
            onClick={() => setActiveKey(1)}
            // style={{ marginLeft: '1rem' }}
            className="custom-tab-link"
          >
            Asset Data
          </CNavLink>
        </CNavItem>
        {(loggedInUserrole === 'maintenance' || loggedInUserrole === 'admin') && (
          <CNavItem role="presentation">
            <CNavLink
              active={activeKey === 2}
              component="button"
              role="tab"
              aria-controls="profile-tab-pane"
              aria-selected={activeKey === 2}
              onClick={() => setActiveKey(2)}
              style={{ marginLeft: '1rem' }}
              className="custom-tab-link"
            >
              Breakdown Data
            </CNavLink>
          </CNavItem>
        )}
        {/* {loggedInUserrole === 'production' ||
          (loggedInUserrole === 'admin' && ( */}
        {(loggedInUserrole === 'maintenance' || loggedInUserrole === 'admin') && (
          <CNavItem role="presentation">
            <CNavLink
              active={activeKey === 3}
              component="button"
              role="tab"
              aria-controls="contact-tab-pane"
              aria-selected={activeKey === 3}
              onClick={() => setActiveKey(3)}
              style={{ marginLeft: '1rem' }}
              className="custom-tab-link"
            >
              PM Data
            </CNavLink>
          </CNavItem>
        )}
        {(loggedInUserrole === 'production' || loggedInUserrole === 'admin') && (
          <CNavItem role="presentation">
            <CNavLink
              active={activeKey === 4}
              component="button"
              role="tab"
              aria-controls="contact-tab-pane"
              aria-selected={activeKey === 4}
              onClick={() => setActiveKey(4)}
              style={{ marginLeft: '1rem' }}
              className="custom-tab-link"
            >
              Raise Breakdown
            </CNavLink>
          </CNavItem>
        )}
      </CNav>
      <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab-pane" visible={activeKey === 1}>
          <div>
            <h4>Asset Details</h4>
            <p>
              <strong>Machine Name:</strong> {assetDetails.AssetName}
            </p>
            <p>
              <strong>Machine Type:</strong> {assetDetails.MachineType}
            </p>
            <p>
              <strong>Location:</strong> {assetDetails.Location}
            </p>
            {assetDetails.Image && (
              <div>
                <p>
                  <strong>Image:</strong>
                </p>
                <img src={assetDetails.Image} alt="Asset" width={200} height={200} />
              </div>
            )}
          </div>
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === 2}>
          <BreakdownData assetName={assetDetails.AssetName} breakdownData={slittingData} />
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="contact-tab-pane" visible={activeKey === 3}>
          <PMData assetName={assetDetails.AssetName} pmData={pmData} />
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="contact-tab-pane" visible={activeKey === 4}>
          <Breakdown assetName={assetDetails.AssetName} />
        </CTabPane>
      </CTabContent>
    </>
  )
}

const BreakdownData = ({ assetName, breakdownData }) => {
  const navigate = useNavigate()
  const filteredData = breakdownData.filter((item) => item.MachineName === assetName)

  const handleProductionPageNavigation = (id) => {
    navigate(`/productionBD/${id}`)
  }

  return (
    <div>
      <h5>{assetName} Breakdown</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Machine Name</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Line Name</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Operations</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Location</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Breakdown Start Date</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Breakdown End Date</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Edit </th>
              <th style={{ textAlign: 'center' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                <td>{item.MachineName}</td>
                <td>{item.LineName}</td>
                <td>{item.Operations}</td>
                <td>{item.Location}</td>
                <td>{item.BreakdownStartDate}</td>
                <td>{item.BreakdownEndDate}</td>
                <td>{item.Status}</td>
                <td style={{ textAlign: 'center' }}>
                  <NavLink to={`/productionBD/${item._id}`} style={{ color: '#000080' }}>
                    <FaEdit />
                  </NavLink>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn" style={{ color: 'red' }}>
                    {/* <img src={dlt} alt="" width={30} height={30} /> */}
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const PMData = ({ assetName, pmData }) => {
  // const navigate = useNavigate()
  const filteredData = pmData.filter((item) => item.AssetName === assetName)

  const deleteData = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this data?')
    if (isConfirmed) {
      axios
        .delete(`https://backendmaintenx.onrender.com/api/pm/${id}`)
        .then((response) => {
          console.log('Data deleted:', response.data)

          // Delete from frontend
          // const index = this.state.assets.findIndex((asset) => asset._id === id)
          // if (index !== -1) {
          //   const newAssets = [...this.state.assets]
          //   newAssets.splice(index, 1).setState({
          //     assets: newAssets,
          //     message: 'Data successfully deleted!',
          //   })
          // }
        })
        .catch((error) => {
          console.error('Error deleting data:', error)
          this.setState({
            message: 'Error deleting data. Please try again.',
          })

          // Set timeout to clear the error message after 3 seconds (adjust as needed)
          setTimeout(() => {
            this.setState({
              message: '',
            })
          }, 2000)
        })
    }
  }
  // const filteredData = (item) => item.AssetName === assetName

  // const handleProductionPageNavigation = (id) => {
  //   navigate(`/productionBD/${id}`)
  // }

  return (
    <div>
      <h5>{assetName} PM Data</h5>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Asset Name</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Task Name</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Location</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>PM Schedule Date</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Next Schedule Date</th>
              <th style={{ backgroundColor: '#002244', color: 'white' }}>Scheduled Frequency</th>
              <th style={{ textAlign: 'center' }}>Edit </th>
              <th style={{ textAlign: 'center' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                <td>{item.AssetName}</td>
                <td>{item.TaskName}</td>
                <td>{item.Location}</td>
                <td>{item.startDate}</td>
                <td>{item.nextDate}</td>
                <td>{item.ScheduledMaintenanceDatesandIntervals}</td>
                <td style={{ textAlign: 'center' }}>
                  <NavLink to={`/editPM/${item._id}`} style={{ color: '#000080' }}>
                    <FaEdit />
                  </NavLink>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="btn"
                    onClick={() => deleteData(item._id)}
                    style={{ color: 'red' }}
                  >
                    {/* <img src={dlt} alt="" width={30} height={30} /> */}
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const Breakdown = ({ assetName }) => {
  const [usernos, setUsers] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const [selectedUsers, setSelectedUsers] = useState([])
  // const filteredData = breakdown.filter((item) => item.MachineName === assetName)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const [formData, setFormData] = useState({
    MachineName: assetName,
    BreakdownStartDate: '',
    BreakdownEndDate: '',
    BreakdownStartTime: '',
    BreakdownEndTime: '',
    Shift: '',
    LineName: '',
    Operations: '',
    BreakdownPhenomenons: '',
    BreakdownType: '',
    OCC: '',
    BreakdownTime: '',
    ActionTaken: '',
    WhyWhyAnalysis: '',
    RootCause: '',
    PermanentAction: '',
    TargetDate: '',
    Responsibility: '',
    HD: '',
    Remark: '',
    Status: 'open',
  })

  const [selectedUserNumbers, setSelectedUserNumbers] = useState([])

  const handleUserSelect = (selectedValue) => {
    // Check if the user is already selected
    if (selectedUserNumbers.includes(selectedValue)) {
      // If selected, remove from the array
      setSelectedUserNumbers((prevSelected) =>
        prevSelected.filter((userNumber) => userNumber !== selectedValue),
      )
    } else {
      // If not selected, add to the array
      setSelectedUserNumbers((prevSelected) => [...prevSelected, selectedValue])
    }
  }

  const username = useSelector((state) => state.auth.userInfo?.name)

  const apiKey = 'NDE1MDY2NGM2Mzc3NTI0ZjQzNmE1YTM5NDY0YzZlNzU='
  const numbers = '6020804148' // Replace with the phone numbers
  const data1 = 'test'
  const data2 = 'test'
  const sender = 'AAABRD'

  const sendSMS = (formData, selectedUsers, loggedInUsername) => {
    const { MachineName, BreakdownStartDate, Shift, LineName, Operations, BreakdownPhenomenons } =
      formData
    // Formulate a simple message
    const message = encodeURIComponent(
      'Breakdown For ' +
        MachineName +
        // 'Date of Breakdown Start' +
        // BreakdownStartDate +
        ' please visit concerned department Details are ' +
        loggedInUsername +
        ' - Aurangabad Auto Ancillary',
    )

    const phoneNumbers = usernos.map((user) => user.phoneNumber).join(',')
    // console.log(selected)
    // console.log(selectedUserNumbers.join(','))
    const selectedno = selectedUserNumbers.join(',')
    // console.log(selectedno)

    // Create the API URL
    const url = `https://api.textlocal.in/send/?apikey=${apiKey}&sender=${sender}&numbers=${selectedno}&message=${message}`

    // Use fetch to send the SMS
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log('SMS sent successfully:', data)
        console.log(selectedno, message)
      })
      .catch((error) => {
        console.error('Error sending SMS:', error)
        // console.log(selected)
      })
  }
  const handleButtonClick = () => {
    // Call the SMS sending function
    sendSMS(formData, selectedUsers, username)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const {
      MachineName,
      Location,
      BreakdownStartDate,
      BreakdownEndDate,
      BreakdownStartTime,
      BreakdownEndTime,
      Shift,
      LineName,
      Operations,
      BreakdownPhenomenons,
      BreakdownType,
      OCC,
      ActionTaken,
      WhyWhyAnalysis,
      RootCause,
      PermanentAction,
      TargetDate,
      Responsibility,
      HD,
      Remark,
      Status = 'open',
    } = formData
    setSuccessMessage('Form submitted successfully!')

    console.log(
      MachineName,
      Location,
      BreakdownStartDate,
      BreakdownEndDate,
      BreakdownStartTime,
      BreakdownEndTime,
      Shift,
      LineName,
      Operations,
      BreakdownPhenomenons,
      BreakdownType,
      OCC,
      ActionTaken,
      WhyWhyAnalysis,
      RootCause,
      PermanentAction,
      TargetDate,
      Responsibility,
      HD,
      Remark,
      Status,
    )
    setTimeout(() => {
      setSuccessMessage('')
    }, 5000)

    fetch('https://backendmaintenx.onrender.com/api/breakdown', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        MachineName,
        Location,
        BreakdownStartDate,
        BreakdownEndDate,
        BreakdownStartTime,
        BreakdownEndTime,
        Shift,
        LineName,
        Operations,
        BreakdownPhenomenons,
        BreakdownType,
        OCC,
        ActionTaken,
        WhyWhyAnalysis,
        RootCause,
        PermanentAction,
        TargetDate,
        Responsibility,
        HD,
        Remark,
        Status,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, 'add breakdown data')
        console.log(MachineName)
        navigate(-1)
      })
  }
  return (
    <div
      className="container"
      style={{
        border: '2px solid #ccc',
        backgroundColor: '',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '95%',
      }}
    >
      {/* Display success message if it exists */}
      {successMessage && (
        <div className="alert alert-success" role="alert" style={{ marginTop: '10px' }}>
          {successMessage}
        </div>
      )}

      <form action="" method="post" onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-6">
            <label htmlFor="machineName" style={{ marginBottom: '10px', fontSize: '16px' }}>
              Machine Name:
            </label>
            <input
              type="string"
              id="assetName"
              className="form-control col-sm-6"
              // name="BreakdownStartTime"
              value={assetName}
              onChange={handleChange}
            ></input>
            {/* <Select
              className="form-control col-sm-6"
              required
              name="MachineName"
              value={assetNames.find((asset) => asset === formData.AssetName)}
              onChange={(selectedOption) =>
                handleChange({ target: { name: 'MachineName', value: selectedOption.value } })
              }
              options={assetNames.map((asset) => ({ label: asset, value: asset }))}
              isSearchable
              placeholder="Select a machine"
              styles={{
                control: (provided) => ({
                  ...provided,
                  marginBottom: '10px',
                }),
              }}
            /> */}
          </div>
          <div className="col-md-6">
            <label htmlFor="assetLocation" className="form-label" style={{ marginBottom: '10px' }}>
              Location:
            </label>
            <select
              className="form-control col-sm-6"
              required
              // id="assetLocation"
              name="Location"
              value={formData.Location}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="Plant 1">Plant 1</option>
              <option value="Plant 2">Plant 2</option>
              <option value="Plant 3">Plant 3</option>
              <option value="Plant 4">Plant 4</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="breakdownDate" style={{ marginBottom: '10px' }}>
              Breakdown Start Date:
            </label>
            <input
              type="date"
              required
              className="form-control col-sm-6"
              name="BreakdownStartDate"
              value={formData.BreakdownStartDate}
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="shift" style={{ marginBottom: '10px' }}>
              Shift:
            </label>
            <input
              type="text"
              required
              className="form-control col-sm-6"
              name="Shift"
              value={formData.Shift}
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="breakdownStartTime" style={{ marginBottom: '10px' }}>
              Breakdown Start Time:
            </label>
            <input
              type="time"
              id="breakdownStartTime"
              className="form-control col-sm-6"
              name="BreakdownStartTime"
              value={formData.BreakdownStartTime}
              onChange={handleChange}
            ></input>
          </div>
          <div className="col-md-6">
            <label htmlFor="lineName" style={{ marginBottom: '10px' }}>
              Line Name:
            </label>
            <input
              type="text"
              required
              name="LineName"
              className="form-control col-sm-6"
              value={formData.LineName}
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="operations" style={{ marginBottom: '10px' }}>
              Operations:
            </label>
            <input
              type="text"
              required
              className="form-control col-sm-6"
              name="Operations"
              value={formData.Operations}
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="breakdownPhenomen" style={{ marginBottom: '10px' }}>
              Breakdown Phenomenon:
            </label>
            <input
              type="text"
              required
              name="BreakdownPhenomenons"
              className="form-control col-sm-6"
              value={formData.BreakdownPhenomenons}
              onChange={handleChange}
              placeholder=""
            />
          </div>
          <div className="row lg-2">
            <div className="col-md-6" style={{ marginTop: '2vh', overflowY: 'auto' }}>
              <label style={{ marginBottom: '10px' }}>Select users:</label>
              <div className="row">
                {usernos.map((user, index) => (
                  <React.Fragment key={user.phoneNumber}>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`checkbox-${user.phoneNumber}`}
                          // checked={selectedUserNumbers.includes(user.phoneNumber)}
                          // onChange={() => handleUserSelect(user.phoneNumber)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`checkbox-${user.phoneNumber}`}
                        >
                          {user.name}
                        </label>
                      </div>
                    </div>
                    {/* Insert a new row after every two users */}
                    {index % 2 !== 0 && <div className="w-100"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="col-md-6" style={{ marginTop: '2vh' }}>
              <label>Selected Users:</label>
              <ul>
                {/* {usernos
                        .filter((user) => selectedUserNumbers.includes(user.phoneNumber))
                        .map((user) => (
                          <li key={user.phoneNumber}>
                            {user.name} - {user.phoneNumber}
                          </li>
                        ))} */}
              </ul>
            </div>

            <div className="col-xs-12">
              <button
                type="submit"
                onClick={handleButtonClick}
                className="btn btn-primary"
                style={{
                  marginTop: '20px',
                  fontSize: '16px',
                  backgroundColor: '#3448db',
                  marginBottom: '10px',
                }}
              >
                Submit
              </button>
            </div>
          </div>
          {/* </div> */}
        </div>
      </form>
    </div>
  )
}

BreakdownData.propTypes = {
  assetName: PropTypes.string.isRequired,
  breakdownData: PropTypes.array.isRequired,
}

PMData.propTypes = {
  assetName: PropTypes.string.isRequired,
  pmData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      AssetName: PropTypes.string.isRequired,
      Location: PropTypes.string.isRequired,
      TaskName: PropTypes.string.isRequired,
      TaskDescription: PropTypes.string.isRequired,
      ScheduledMaintenanceDatesandIntervals: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      nextDate: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

Breakdown.propTypes = {
  assetName: PropTypes.string.isRequired,
  Breakdown: PropTypes.string.isRequired,
}

export default Inventory
