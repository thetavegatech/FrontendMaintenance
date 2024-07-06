import React, { useState, useEffect } from 'react'
// import './Breakdown.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
// import '../assetForm/AssetForm'
import '../assetTable/asset.css'
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
        <h5 style={{ marginLeft: '20px' }}>BreakDown</h5>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '5rem', marginTop: '0px' }}>
        <div className="form-row1" style={{ marginLeft: '15px' }}>
          <div
            className="form-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 'px',
              marginBottom: '20px',
            }}
          >
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="machineNumber">Machine Number</label>
              <Select
                className="form-control"
                required
                name="MachineName"
                value={formData.AssetName}
                onChange={(selectedOption) => handleMachineNumberChange(selectedOption)}
                options={assetNames.map((asset) => ({ label: asset, value: asset }))}
                placeholder="Select a machine"
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="location">Location</label>
              <input
                type="text"
                className="form-control col-sm-6"
                required
                readOnly
                id="Location"
                name="Location"
                value={formData.Location}
                onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="breakdownStartDate">Breakdown Start Date</label>
              <input
                type="Date"
                name="BreakdownStartDate"
                className="form-control"
                value={formData.BreakdownStartDate}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>
          </div>

          <div
            className="form-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="breakdownShiftTime">Breakdown start Time</label>
              <input
                type="time"
                name="breakdownShiftTime"
                className="form-control"
                value={formData.BreakdownStartTime}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="shift">Shift</label>
              <input
                type="text"
                name="Shift"
                className="form-control"
                value={formData.machineType}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="lineName">Line Name</label>
              <select
                className="form-control col-sm-6"
                required
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
                <option value="HEAT TREATMENT">HEAT TREATMENT</option>
                <option value="FORGING">FORGING</option>
                <option value="CHANGE ARM/ BRACKET">CHANGE ARM/ BRACKET</option>
                <option value="BSC">BSC</option>
                <option value="SECTOR LEVER">SECTOR LEVER</option>
                <option value="SLIDER BLOCK">SLIDER BLOCK</option>
                <option value="CAM SHAFT GRINDING">CAM SHAFT GRINDING</option>
                <option value="CAM SHAFT SOFT">CAM SHAFT SOFT</option>
              </select>
            </div>
          </div>

          <div
            className="form-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="operations" style={{ marginBottom: '10px' }}>
                Operations:
              </label>
              <input
                type="text"
                required
                className="form-control"
                name="Operations"
                value={formData.Operations}
                onChange={handleChange}
                placeholder=""
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="breakdownPhenomenon">Breakdown Phenomenon</label>
              <input
                type="text"
                name="BreakdownPhenomenons"
                className="form-control col-sm-6l"
                value={formData.BreakdownPhenomenons}
                onChange={handleChange}
                placeholder=""
                required
                style={{ height: '40px' }}
              />
            </div>
            {/* <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="breakdownPhenomenon">Breakdown Phenomenon</label>
              <input
                type="text"
                name="breakdownPhenomenon"
                className="form-control col-sm-6l"
                value={formData.BreakdownPhenomenons}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div> */}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              float: 'left',
              backgroundColor: '#CA226B',
              marginTop: '10px',
              alignItems: 'end',
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
