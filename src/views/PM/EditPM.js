import React, { useEffect, useState } from 'react'
import { MdDashboard } from 'react-icons/md'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames'
import '../form.css'

export default function EditForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  // State variables
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    startDate: '',
    nextDate: '',
    ScheduledMaintenanceDatesandIntervals: '',
    status: '',
    attachment: null, // File handling example
  })

  // Fetch data on mount
  useEffect(() => {
    fetchData()
  }, [])

  // Fetch initial data
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://backendmaintenx.onrender.com/api/pm/${id}`)
      const { data } = response

      // Update formData state
      setFormData({
        taskName: data.TaskName,
        description: data.TaskDescription,
        startDate: formatDate(data.startDate),
        nextDate: formatDate(data.nextDate),
        ScheduledMaintenanceDatesandIntervals: data.ScheduledMaintenanceDatesandIntervals,
        status: data.status,
        // Update other fields as needed
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(
        `https://backendmaintenx.onrender.com/api/pm/${id}`,
        formData,
      )
      console.log('Update successful:', response.data)
      setFormData({
        taskName: '',
        description: '',
        startDate: '',
        nextDate: '',
        ScheduledMaintenanceDatesandIntervals: '',
        status: '',
        attachment: null,
      })
      navigate(-1) // Navigate back to previous page
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Function to format date
  const formatDate = (dateString) => {
    const parsedDate = new Date(dateString)
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData({
      ...formData,
      attachment: file,
    })
  }

  return (
    <div className="card shadow-sm mx-auto">
      <Link to="/temperature" style={{ position: 'absolute', top: '15px', right: '10px' }}></Link>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          className={classNames('box', 'd-flex', 'justify-content-center', 'align-items-center')}
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
        <h5 style={{ marginLeft: '25px' }}>PM Edit</h5>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '5rem', marginTop: '0px' }}>
        <div className="form-row1" style={{ marginLeft: '25px' }}>
          <div className="form-row">
            <div className="form-group" style={{ width: '25%' }}>
              <label>Task Name:</label>
              <input
                name="taskName"
                className="form-control col-sm-6"
                value={formData.taskName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="location">Description:</label>
              <input
                type="text"
                name="description"
                className="form-control"
                value={formData.description}
                readOnly
                required
                style={{ height: '40px' }}
              />
            </div>

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="startDate">Start Date</label>
              <input
                // type="date"
                name="startDate"
                className="form-control"
                value={formData.startDate}
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
              marginTop: '20px',
            }}
          >
            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="nextDate">Next Date:</label>
              <input
                name="nextDate"
                className="form-control"
                value={formData.nextDate}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              ></input>
            </div>

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="scheduledMaintenance">
                Scheduled Maintenance Date and Intervals:
              </label>
              <select
                className="form-control col-sm-6"
                required
                id="scheduledMaintenance"
                name="ScheduledMaintenanceDatesandIntervals"
                onChange={handleChange}
                value={formData.ScheduledMaintenanceDatesandIntervals}
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

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="status">Status:</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              float: 'left',
              backgroundColor: '#CA226B',
              marginTop: '15px',
              alignItems: 'end',
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
