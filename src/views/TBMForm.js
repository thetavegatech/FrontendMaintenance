import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { addDays, addWeeks, addMonths } from 'date-fns'
import './form.css'
import { useParams, useNavigate } from 'react-router-dom'

const TBMForm = () => {
  const [formData, setFormData] = useState({
    assetName: '',
    location: '',
    assetType: '',
    installationDate: '',
    tbmScheduleDate: '',
    tbmFrequency: '',
    nextTbmDate: '',
    status: 'Pending',
  })
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [assets, setAssets] = useState([])

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

  useEffect(() => {
    // Fetch asset names from the API
    const fetchAssets = async () => {
      try {
        const response = await axios.get('https://backendmaintenx.onrender.com/api/assets')
        setAssets(response.data)
      } catch (error) {
        console.error('Error fetching assets:', error)
      }
    }

    fetchAssets()
  }, [])

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

    if (name === 'tbmScheduleDate' || name === 'tbmFrequency') {
      const { tbmScheduleDate, tbmFrequency } = updatedFormData
      const nextTbmDate = calculateNextCbmDate(tbmScheduleDate, tbmFrequency)
      updatedFormData = {
        ...updatedFormData,
        nextTbmDate,
      }
    }

    setFormData(updatedFormData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('https://backendmaintenx.onrender.com/api/tbm', formData)
      setMessage('TBM record created successfully!')
      // Reset form data after successful submission
      setFormData((prevState) => ({
        ...prevState,
        assetName: '',
        location: '',
        assetType: '',
        installationDate: '',
        tbmScheduleDate: '',
        tbmFrequency: '',
        nextTbmDate: '',
        status: 'Pending',
      }))
      navigate(-1)
    } catch (error) {
      setMessage('Error creating TBM record.')
      console.error('There was an error creating the TBM record:', error)
    }
  }

  return (
    <div
      className="container"
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        // backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.1)',
        width: '100%',
      }}
    >
      <h4>Create TBM Record</h4>
      <form onSubmit={handleSubmit} style={{ margin: '3%' }}>
        <div className="row g-3">
          <div className="col-md-4" style={{ marginBottom: '15px' }}>
            <label>Asset Name:</label>
            <select
              name="assetName"
              className="form-control"
              value={formData.assetName}
              onChange={handleChange}
              required
            >
              <option value="">Select Asset</option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset.name}>
                  {asset.AssetName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4" style={{ marginBottom: '15px' }}>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              readOnly
              required
            />
          </div>
          <div className="col-md-4" style={{ marginBottom: '15px' }}>
            <label>TBM Schedule Date:</label>
            <input
              type="date"
              name="tbmScheduleDate"
              className="form-control"
              value={formData.tbmScheduleDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4" style={{ marginBottom: '15px' }}>
            <label>TBM Frequency:</label>
            <select
              type="text"
              name="tbmFrequency"
              className="form-control"
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
          <div className="col-md-4" style={{ marginBottom: '15px' }}>
            <label>Next TBM Date:</label>
            <input
              type="date"
              name="nextTbmDate"
              className="form-control"
              value={formData.nextTbmDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                marginTop: '20px',
                fontSize: '16px',
                backgroundColor: '#000026',
                // transition: 'background-color 0.3s',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#009bff')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
            >
              Submit
            </button>
          </div>
          {message && (
            <div className="col-12">
              <p>{message}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default TBMForm
