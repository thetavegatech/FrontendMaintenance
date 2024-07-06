import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import '../tasks/Taskform.css'
import classNames from 'classnames'

const MyFormComponent = () => {
  // Define state variables for form inputs
  const [formData, setFormData] = useState({
    AssetName: '',
    ScheduledMaintenanceDatesandIntervals: '',
    // PMDetails: '',
    TaskName: '',
    TaskDescription: '',
    startDate: '',
    nextDate: '',
    Location: '',
    status: 'Pending',
    pmScheduleDate: '',
    nextScheduleDate: '',
  })
  const navigate = useNavigate()
  const [assetNames, setAssetNames] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [file, setFile] = useState(null)

  const [Image, setImage] = useState('')
  function convertToBse64(e) {
    console.log(e)
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
      console.log(reader.result) // base64encoded string
      setImage(reader.result)
    }
    reader.onerror = (err) => {
      console.log(err)
    }
  }

  useEffect(() => {
    // Fetch asset names when the component mounts
    axios
      .get('https://backendmaintenx.onrender.com/api/assets')
      .then((response) => {
        const names = Array.from(new Set(response.data.map((asset) => asset.AssetName)))
        setAssetNames(names)
      })
      .catch((error) => {
        console.error('Error fetching asset names:', error)
      })
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Destructure form data from the state
      const {
        AssetName,
        Location,
        ScheduledMaintenanceDatesandIntervals,
        pmScheduleDate,
        nextScheduleDate,
        TaskName,
        TaskDescription,
        status = 'Pending',
      } = formData

      console.log('Asset Name:', AssetName)
      console.log('Location:', Location)
      console.log('Task Name:', TaskName)
      console.log('status', status)
      console.log(formData)
      setSuccessMessage('Form submitted successfully!')

      // ... continue with other fields

      // Your fetch logic here
      const response = await fetch('https://backendmaintenx.onrender.com/api/pm', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          AssetName,
          ScheduledMaintenanceDatesandIntervals,
          Location,
          TaskName,
          TaskDescription,
          startDate: pmScheduleDate,
          nextDate: nextScheduleDate,
          // Add other form data here as needed
          status,
        }),
      })
      navigate(-1)

      const data = await response.json()
      console.log('Response from server:', data)

      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const someFunction = () => {
    const startDate = this.state.pmScheduleDate
    const frequency = this.state.ScheduledMaintenanceDatesandIntervals
    const nextDate = this.getNextScheduleDate(startDate, frequency)
    this.setState({ nextScheduleDate: nextDate.toISOString().split('T')[0] })
    console.log(nextDate) // or any other logic you want with nextDate
  }

  // Handle frequency change
  const handleFrequencyChange = (e) => {
    const frequency = e.target.value
    const startDate = formData.pmScheduleDate
    const nextDate = getNextScheduleDate(startDate, frequency)
    setFormData({
      ...formData,
      ScheduledMaintenanceDatesandIntervals: frequency,
      nextScheduleDate: nextDate.toISOString().split('T')[0],
    })
  }

  // JavaScript
  function uploadFile() {
    const fileInput = document.getElementById('fileInput')
    const file = fileInput.files[0]

    const formData = new FormData()
    formData.append('file', file)

    fetch('http://192.168.1.17:5000/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        console.log(data.message)
      })
      .catch((error) => {
        console.error('Error:', error.message)
      })
  }

  const getNextScheduleDate = (startDate, frequency) => {
    let newDate = new Date(startDate)

    const skipSundays = () => {
      while (newDate.getDay() === 0) {
        newDate.setDate(newDate.getDate() + 1)
      }
    }

    const addWeekdays = (numDays) => {
      let count = 0
      while (count < numDays) {
        newDate.setDate(newDate.getDate() + 1)
        if (newDate.getDay() !== 0) {
          // Count only weekdays (excluding Sundays)
          count++
        }
      }
    }

    switch (frequency.toLowerCase()) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1)
        skipSundays()
        break
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7)
        skipSundays()
        break
      case 'fifteen days':
        addWeekdays(15)
        break
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1)
        // newDate.setDate(1)
        addWeekdays(4)
        skipSundays()
        break
      case 'quarterly':
        // Move to the first day of the next month
        newDate.setMonth(newDate.getMonth() + 3)
        // newDate.setDate(1)
        addWeekdays(14)
        skipSundays()
        break
      case 'half year':
        newDate.setMonth(newDate.getMonth() + 6)
        // newDate.setDate(1)
        addWeekdays(28)
        skipSundays()
        break
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + 1)
        // newDate.setMonth(0)
        // newDate.setDate(1)
        addWeekdays(52)
        skipSundays()
        break
      default:
        throw new Error('Unsupported frequency')
    }

    console.log('New Scheduled Date:', newDate)
    return newDate
  }

  const handleChange = async (e) => {
    const { name, value } = e.target
    let updatedFormData = {
      ...formData,
      [name]: value,
    }

    if (name === 'assetName') {
      try {
        const response = await axios.get(
          `https://backendmaintenx.onrender.com/api/locations/${value}`,
        )
        if (response.data && response.data.Location) {
          updatedFormData = {
            ...updatedFormData,
            Location: response.data.Location,
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error)
      }
    }

    setFormData(updatedFormData)
  }

  const handleAssetNameChange = async (e) => {
    const selectedAssetName = e.target.value
    let updatedFormData = {
      ...formData,
      AssetName: selectedAssetName,
    }

    try {
      const response = await axios.get(
        `https://backendmaintenx.onrender.com/api/locations/${selectedAssetName}`,
      )
      if (response.data && response.data.Location) {
        updatedFormData = {
          ...updatedFormData,
          Location: response.data.Location,
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error)
    }

    setFormData(updatedFormData)
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileUpload = async () => {
    try {
      const formData = new FormData()
      formData.append('image', file)

      await axios.post('http://192.168.1.17:3000/upload', formData)

      // File uploaded successfully
      console.log('File uploaded')
    } catch (error) {
      console.error('Error uploading file', error)
    }
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
        <h5 style={{ marginLeft: '20px' }}>PM Schedule</h5>
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
              <label htmlFor="assetName">Asset Name</label>
              <select
                name="assetName"
                className="form-control col-sm-6"
                value={formData.AssetName}
                onChange={handleAssetNameChange}
                required
              >
                <option value="">Select Asset</option>
                {assetNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="Location">Location</label>
              <input
                type="text"
                id="Location"
                name="Location"
                className="form-control"
                value={formData.Location}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="Task Name">Task Name</label>
              <input
                type="text"
                name="Task Name"
                className="form-control"
                value={formData.TaskName}
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
              <label htmlFor="description">Task Description</label>
              <input
                type="text"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="pmScheduleDate">Start From</label>
              <input
                type="text"
                name="pmScheduleDate"
                className="form-control"
                value={formData.pmScheduleDate}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="NextDateofMaintenance">Next Date of Maintenance </label>
              <input
                type="text"
                name="NextDateofMaintenance"
                className="form-control"
                value={formData.NextDateofMaintenance}
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
              <label htmlFor="scheduledMaintenance">Scheduled Maintenance Dates & Intervals:</label>
              <select
                className="form-control col-sm-6"
                required
                id="scheduledMaintenance"
                name="ScheduledMaintenanceDatesandIntervals"
                onChange={handleFrequencyChange}
              >
                <option value="">Select an option</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="fifteen Days">Fifteen Days</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half Year">Half Year</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="attachment">Attachment</label>
              <input
                type="file"
                name="attachment"
                className="form-control"
                value={formData.attachment}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="NextDateofMaintenance"> </label>
              {/* <input
                type="text"
                name="NextDateofMaintenance"
                className="form-control"
                value={formData.NextDateofMaintenance}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              /> */}
            </div>
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

export default MyFormComponent
