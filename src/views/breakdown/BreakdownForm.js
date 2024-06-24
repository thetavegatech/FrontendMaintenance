import React, { useState, useEffect } from 'react'
// import './Breakdown.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CTimePicker } from '@coreui/react'
import TimePicker from 'react-time-picker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'

export default function BreakDown() {
  const [usernos, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selected, setSelected] = useState(null)
  const [isFullTime, setIsFullTime] = useState(false)
  const [selectedTime, setSelectedTime] = useState('12:00')
  const [value, setValue] = useState('')
  const [filteredAssetNames, setFilteredAssetNames] = useState([])
  const [filteredMachineNames, setFilteredMachineNames] = useState([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const username = useSelector((state) => state.auth.userInfo?.name)
  const [allUsers, setAllUsers] = useState([])
  const [breakdownStatus, setBreakdownStatus] = useState(null)

  const loggedInUsername = useSelector((state) => state.auth.userInfo?.name)

  useEffect(() => {
    // Fetch all users initially
    axios
      .get('https://backendmaintenx.onrender.com/UserInfo')
      .then((response) => {
        setAllUsers(response.data)
      })
      .catch((error) => {
        console.error('Error fetching all user data:', error)
      })
  }, [])

  const [selectedUserNumbers, setSelectedUserNumbers] = useState([])

  // Handle user selection
  const handleUserSelect = (selectedValue) => {
    if (selectedUserNumbers.includes(selectedValue)) {
      setSelectedUserNumbers((prevSelected) =>
        prevSelected.filter((userNumber) => userNumber !== selectedValue),
      )
    } else {
      setSelectedUserNumbers((prevSelected) => [...prevSelected, selectedValue])
    }
  }

  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    MachineName: '',
    Location: '',
    BreakdownStartDate: new Date().toISOString().split('T')[0],
    BreakdownEndDate: '',
    BreakdownStartTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
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
  const [machineNames, setMachineNames] = useState([])
  const [assetNames, setAssetNames] = useState([])
  // const [isFullTime, setIsFullTime] = useState(false)

  // Function to fetch location by asset name
  const fetchLocationByAssetName = async (assetName) => {
    try {
      const response = await axios.get(
        `https://backendmaintenx.onrender.com/api/assetmaster/${assetName}`,
      )
      return response.data.Location
    } catch (error) {
      console.error('Error fetching location:', error)
      return null
    }
  }

  // Function to fetch users by location
  const fetchUsersByLocation = async (location) => {
    try {
      const response = await axios.get(
        `https://backendmaintenx.onrender.com/UserInfoByLocation/${location}/Yes`,
      )
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users by location:', error)
    }
  }

  // Handle machine number change
  const handleMachineNumberChange = async (selectedOption) => {
    const selectedMachineName = selectedOption.value
    setFormData((prevFormData) => ({ ...prevFormData, MachineName: selectedMachineName }))
    const location = await fetchLocationByAssetName(selectedMachineName)
    if (location) {
      setFormData((prevFormData) => ({ ...prevFormData, Location: location }))
      fetchUsersByLocation(location)
    }
  }

  // Fetch asset names on component mount
  useEffect(() => {
    // Fetch asset names
    axios
      .get('https://backendmaintenx.onrender.com/api/assets')
      .then((res) => {
        // Extract unique asset names from the response
        const uniqueAssetNames = [...new Set(res.data.map((item) => item.AssetName))]
        // Set asset names state
        setAssetNames(uniqueAssetNames)
      })
      .catch((error) => {
        console.error('Error fetching asset names:', error)
      })
  }, [])

  useEffect(() => {
    if (formData.MachineName) {
      // Fetch breakdown status for the selected machine
      axios
        .get(`https://backendmaintenx.onrender.com/api/getBreakdownStatus/${formData.MachineName}`)
        .then((response) => {
          setBreakdownStatus(response.data.status)
          console.log(response.data.status)
        })
        .catch((error) => {
          console.error('Error fetching breakdown status:', error)
        })
    }
  }, [formData.MachineName])

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
      BDRaiseName,
      // BDRaiseName: loggedInUsername,
    } = formData
    // const loggedInUsername = useSelector((state) => state.auth.userInfo?.name)
    // Check if the breakdown status is open or pending
    if (breakdownStatus === 'open' || breakdownStatus === 'pending') {
      // Display an alert
      alert(`Breakdown status for ${MachineName} is ${breakdownStatus}`)
      return // Stop further execution
    }

    // Proceed with form submission
    fetch('https://backendmaintenx.onrender.com/saveBreakdown', {
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
        BDRaiseName: loggedInUsername,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, 'add breakdown data')
        console.log(MachineName)
        console.log(loggedInUsername)
        navigate(-1) // Navigating back after successful submission

        // Reset form state
        setFormData({
          MachineName: '',
          Location: '',
          BreakdownStartDate: new Date().toISOString().split('T')[0],
          BreakdownEndDate: '',
          BreakdownStartTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
          BreakdownEndTime: '',
          Shift: '',
          LineName: '',
          Operations: '',
          BreakdownPhenomenons: '',
          BreakdownType: '',
          OCC: '',
          ActionTaken: '',
          WhyWhyAnalysis: '',
          RootCause: '',
          PermanentAction: '',
          TargetDate: '',
          Responsibility: '',
          HD: '',
          Remark: '',
          Status: 'open',
          BDRaiseName: loggedInUsername,
        })
        // Display success message
        setSuccessMessage('Breakdown saved successfully!')

        // Call the SMS sending function
        sendSMS(formData, selectedUsers, loggedInUsername)

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      })
      .catch((error) => {
        console.error('Error submitting form:', error)
        // Handle error as needed
      })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const selectedValue = e.target.value
    if (selectedValue === 'Select an option') {
      alert('Please select a valid option from the dropdown.')
    }

    setFormData({
      ...formData,
      [name]: value,
    })

    if (name === 'Location') {
      // If the location changes, filter users based on the new location
      fetchUsersByLocation(value)
    }
  }

  const apiKey = 'NDE1MDY2NGM2Mzc3NTI0ZjQzNmE1YTM5NDY0YzZlNzU='
  const numbers = '7020804148' // Replace with the phone numbers
  const data1 = 'test'
  const data2 = { username }
  const sender = 'AAABRD'

  const sendSMS = (formData, selectedUsers, loggedInUsername) => {
    const { MachineName } = formData
    // Formulate a simple message
    const message = encodeURIComponent(
      'Breakdown For ' +
        MachineName +
        ' please visit concerned department Details are send by ' +
        loggedInUsername +
        ' - Aurangabad Auto Ancillary',
    )

    // const message = encodeURIComponent(
    //   `Breakdown For ${MachineName} please visit concerned department Details are ${username} - Aurangabad Auto Ancillary`,
    // )

    const phoneNumbers = usernos.map((user) => user.phoneNumber).join(',')

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
        console.log(selected)
      })
  }

  useEffect(() => {
    // Fetch users based on the received location
    fetchUsersByLocation(formData.Location)
  }, [formData.Location])

  useEffect(() => {
    if (formData.MachineName) {
      fetchLocationByAssetName(formData.MachineName)
    }
  }, [formData.MachineName])

  const handleButtonClick = () => {
    // Call the SMS sending function
    sendSMS(formData, selectedUsers, username)
  }

  return (
    <>
      <div
        className="container"
        style={{
          border: '2px solid #ccc',
          backgroundColor: '',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '100%',
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
                Machine Number:
              </label>
              <Select
                className="form-control"
                required
                name="MachineName"
                // value={formData.MachineName}
                value={formData.AssetName}
                // value={
                //   formData.MachineName
                //     ? { label: formData.MachineName, value: formData.MachineName }
                //     : null
                // }
                // value={selectedMachineName}
                onChange={(selectedOption) => handleMachineNumberChange(selectedOption)}
                options={assetNames.map((asset) => ({ label: asset, value: asset }))}
                placeholder="Select a machine"
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="assetLocation"
                className="form-label"
                style={{ marginBottom: '10px' }}
              >
                Location:
              </label>
              <input
                type="text"
                className="form-control col-sm-6"
                required
                id="Location"
                name="Location"
                value={formData.Location} // Bind input value to Location field in form data state
                onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
              />
              {/* <select
                className="form-control col-sm-6"
                required
                // id="assetLocation"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="AAAPL-27">AAAPL-27</option>
                <option value="AAAPL-29">AAAPL-29</option>
                <option value="AAAPL- 89">AAAPL- 89</option>
                <option value="DPAPL - 236">DPAPL - 236</option>
                <option value=" DPAPL- GN"> DPAPL- GN</option>
              </select> */}
            </div>
            <div className="col-md-6">
              <label htmlFor="breakdownDate" style={{ marginBottom: '10px' }}>
                Breakdown Start Date:
              </label>
              <input
                type="date"
                disabled
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
                disabled
                id="breakdownStartTime"
                className="form-control col-sm-6"
                name="BreakdownStartTime"
                value={formData.BreakdownStartTime}
                onChange={handleChange}
              ></input>
            </div>
            <div className="col-md-6">
              <label htmlFor="LineName" style={{ marginBottom: '10px' }}>
                Line Name:
              </label>
              <select
                className="form-control col-sm-6"
                required
                // id="assetLocation"
                name="LineName"
                value={formData.LineName}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="BOSSES">BOSSES</option>
                <option value="ARMATURE SHAFT/ RCI GEAR SHAFT">
                  ARMATURE SHAFT/ RCI GEAR SHAFT
                </option>
                <option value="SPROCKET">SPROCKET</option>
                <option value="WORM SHAFT">WORM SHAFT</option>
                <option value="K B CELL">K B CELL</option>
                <option value="SSP TSP">SSP TSP</option>
                <option value="HEAT TEEATMENT">HEAT TEEATMENT</option>
                <option value="FORGING">FORGING</option>
                <option value="CHANGE ARM/ BRACKET">CHANGE ARM/ BRACKET</option>
                <option value="BSC">BSC</option>
                <option value="SECTOE LEVER">SECTOE LEVER</option>
                <option value="SLIDER BLOCK">SLIDER BLOCK</option>
                <option value="CAM SHAFT GRINDING">CAM SHAFT GRINDING</option>
                <option value="CAM SHAFT SOFT">CAM SHAFT SOFT</option>
              </select>
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
                            checked={selectedUserNumbers.includes(user.phoneNumber)}
                            onChange={() => handleUserSelect(user.phoneNumber)}
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
                  {usernos
                    .filter((user) => selectedUserNumbers.includes(user.phoneNumber))
                    .map((user) => (
                      <li key={user.phoneNumber}>
                        {user.name} - {user.phoneNumber}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="col-xs-12">
                <button
                  type="submit"
                  // onClick={handleButtonClick}
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
      {/* </div> */}
    </>
  )
}
