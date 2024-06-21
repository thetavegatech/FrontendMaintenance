import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { addDays, addWeeks, addMonths } from 'date-fns'
import { useParams, useNavigate } from 'react-router-dom'

const CBMEdit = () => {
  const [formData, setFormData] = useState({
    assetName: '',
    location: '',
    assetType: '',
    installationDate: '',
    tbmScheduleDate: '',
    tbmFrequency: '',
    nextTbmDate: '',
    status: '',
  })

  const { id } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Fetch data by id when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://backendmaintenx.onrender.com/api/tbm/${id}`)
        const data = response.data

        setFormData({
          assetName: data.assetName,
          location: data.location,
          assetType: data.assetType,
          installationDate: data.installationDate,
          tbmScheduleDate: data.tbmScheduleDate ? data.tbmScheduleDate.split('T')[0] : '',
          tbmFrequency: data.tbmFrequency,
          nextTbmDate: data.nextTbmDate ? data.nextTbmDate.split('T')[0] : '',
          status: data.status,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        setMessage('Error fetching data. Please try again.')
      }
    }

    fetchData()
  }, [id])

  const calculateNextCbmDate = (scheduleDate, frequency) => {
    if (!scheduleDate || !frequency) return ''

    const date = new Date(scheduleDate)
    switch (frequency) {
      case 'daily':
        return addDays(date, 1).toISOString().split('T')[0]
      case 'weekly':
        return addWeeks(date, 1).toISOString().split('T')[0]
      case 'fifteen days':
        return addDays(date, 15).toISOString().split('T')[0]
      case 'monthly':
        return addMonths(date, 1).toISOString().split('T')[0]
      case 'quarterly':
        return addMonths(date, 3).toISOString().split('T')[0]
      case 'half year':
        return addMonths(date, 6).toISOString().split('T')[0]
      case 'yearly':
        return addMonths(date, 12).toISOString().split('T')[0]
      default:
        return ''
    }
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
            location: response.data.Location,
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error)
      }
    }

    if (name === 'cbmScheduleDate' || name === 'cbmFrequency') {
      const { cbmScheduleDate, cbmFrequency } = updatedFormData
      const nextCbmDate = calculateNextCbmDate(cbmScheduleDate, cbmFrequency)
      updatedFormData = {
        ...updatedFormData,
        nextCbmDate,
      }
    }

    setFormData(updatedFormData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`https://backendmaintenx.onrender.com/api/tbm/${id}`, formData)
      navigate(-1) // Navigate back to the previous page
    } catch (error) {
      console.error('Error updating CBM record:', error)
      setMessage('Error updating CBM record. Please try again.')
    }
  }

  return (
    <div
      className="container"
      style={{
        border: '1px solid #ccc',
        padding: '5px',
        backgroundColor: '',
        borderRadius: '10px',
        boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.1)',
        height: '50%',
        width: '100%',
      }}
    >
      <h4>Edit TBM Record</h4>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label>Asset Name:</label>
            <input
              name="assetName"
              className="form-control col-sm-6"
              value={formData.assetName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              className="form-control col-sm-4"
              value={formData.location}
              onChange={handleChange}
              readOnly
              required
            />
          </div>
          <div className="col-md-4">
            <label>TBM Schedule Date:</label>
            <input
              type="date"
              name="tbmScheduleDate"
              className="form-control col-sm-6"
              value={formData.tbmScheduleDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label>TBM Frequency:</label>
            <select
              type="text"
              name="tbmFrequency"
              className="form-control col-sm-6"
              value={formData.tbmFrequency}
              onChange={handleChange}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="fifteen days">Fifteen Days</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half year">Half Year</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="col-md-4">
            <label>Next TBM Date:</label>
            <input
              type="date"
              name="nextTbmDate"
              className="form-control col-sm-6"
              value={formData.nextTbmDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="status">Status</label>
            <select
              className="form-control col-sm-6"
              // style={{ width: '80%' }}
              required
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              {/* <option value="open">Open</option> */}
            </select>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default CBMEdit
