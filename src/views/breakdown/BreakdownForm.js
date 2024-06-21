import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CTimePicker } from '@coreui/react'
import TimePicker from 'react-time-picker'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch, useSelector } from 'react-redux'

export default function BreakDown() {
  const [usernos, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedUserName, setSelectedUserName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selected, setSelected] = useState(null)
  const [isFullTime, setIsFullTime] = useState(false)
  const [selectedTime, setSelectedTime] = useState('12:00')
  const [value, setValue] = useState('')
  // const [filteredAssetNames, setFilteredAssetNames] = useState([])
  const [filteredAssetNames, setFilteredAssetNames] = useState([])
  const [filteredMachineNames, setFilteredMachineNames] = useState([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  useEffect(() => {
    // Fetch user data from the server
    axios
      .get('http://192.168.1.3:5000/UserInfo')
      .then((response) => {
        setUsers(response.data)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })
  }, [])

  const [selectedUserNumbers, setSelectedUserNumbers] = useState([])

  const handleUserSelect = (selectedValue) => {
    if (selectedUserNumbers.includes(selectedValue)) {
      setSelectedUserNumbers((prevSelected) =>
        prevSelected.filter((userNumber) => userNumber !== selectedValue),
      )
    } else {
      setSelectedUserNumbers((prevSelected) => [...prevSelected, selectedValue])
    }
  }

  const handleOptionSelect = async (selectedValue) => {
    // handleChange({ target: { name: 'MachineName', value: selectedOption.value } })
    const machineName = selectedValue.value
    setFormData((prevFormData) => ({
      ...prevFormData,
      MachineName: machineName,
    }))

    try {
      const response = await axios.get(
        `https://backendmaintenx.onrender.com/api/locations/${machineName}`,
      )
      const location = response.data.Location
      setFormData((prevFormData) => ({
        ...prevFormData,
        Location: location,
      }))
    } catch (error) {
      console.error('Error fetching location:', error)
    }

    setIsDropdownVisible(false)
  }

  // const handleUserSelect = (_id) => {
  //   // console.log(_id)
  //   setSelected(_id)
  //   return _id
  // }
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    MachineName: '',
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
  const [machineNames, setMachineNames] = useState([])
  const [assetNames, setAssetNames] = useState([])
  // const [isFullTime, setIsFullTime] = useState(false)

  const onChange = (event) => {
    const searchValue = event.target.value
    setFormData({
      ...formData,
      MachineName: searchValue,
    })

    // Trigger search for machine names
    onSearch(searchValue, machineNames, setFilteredMachineNames)
  }

  const onSearch = (searchTerm, items, setFilteredItems) => {
    setValue(searchTerm)

    // Check if items is an array before filtering
    const filteredItems = Array.isArray(items)
      ? items.filter((item) =>
          item ? item.toLowerCase().includes(searchTerm.toLowerCase()) : false,
        )
      : []

    setFilteredItems(filteredItems)
    setIsDropdownVisible(filteredItems.length > 0)
  }

  // const handleOptionSelect = (selectedValue) => {
  //   setFormData({
  //     ...formData,
  //     AssetName: selectedValue,
  //     MachineName: selectedValue,
  //   })

  //   setIsDropdownVisible(false) // Hide the dropdown after selecting an option
  // }

  useEffect(() => {
    // Fetch asset names from 'http://192.168.1.16:5000/getAllData'
    fetch('https://backendmaintenx.onrender.com/api/assets')
      .then((res) => res.json())
      .then((data) => {
        // Extract unique asset names from the data
        const uniqueAssetNames = [...new Set(data.map((item) => item.AssetName))]
        // Set the assetNames state with the unique asset names
        setAssetNames(uniqueAssetNames)
      })
      .catch((error) => {
        console.error('Error fetching asset names: ', error)
      })
  }, [])

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const userrole = useSelector((state) => state.auth.userInfo?.role) || ''
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
        console.log(selected)
      })
  }

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
              <Select
                className="form-control col-sm-6"
                required
                name="MachineName"
                value={assetNames.find((asset) => asset === formData.AssetName)}
                // onChange={(selectedOption) =>
                //   handleChange({ target: { name: 'MachineName', value: selectedOption.value } })
                // }
                onChange={handleOptionSelect}
                options={assetNames.map((asset) => ({ label: asset, value: asset }))}
                isSearchable
                placeholder="Select a machine"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    marginBottom: '10px',
                  }),
                }}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="Location" className="form-label" style={{ marginBottom: '10px' }}>
                Location:
              </label>
              <input
                type="text"
                className="form-control col-sm-6"
                name="Location"
                value={formData.Location}
                readOnly
                required
              />
            </div>
            {/* <div className="col-md-6">
              <label
                htmlFor="assetLocation"
                className="form-label"
                style={{ marginBottom: '10px' }}
              >
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
            </div> */}
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
            {/* <div className="row lg-2">
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
            </div> */}
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
            {/* </div> */}
          </div>
        </form>
      </div>
      {/* </div> */}
    </>
  )
}
