import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { addDays, addWeeks, addMonths } from 'date-fns'
import './widgets/TBMform.css'
import { useParams, useNavigate } from 'react-router-dom'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

  const calculateNextTbmDate = (scheduleDate, frequency) => {
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
      const nextTbmDate = calculateNextTbmDate(tbmScheduleDate, tbmFrequency)
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
      toast.success('TBM record created successfully!', { autoClose: 5000 })
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
        <h5 style={{ marginLeft: '25px' }}>Create TBM Record</h5>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '5rem', marginTop: '0px' }}>
        <div className="form-row1" style={{ marginLeft: '15px' }}>
          <div className="form-row">
            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="assetName">Asset Name</label>
              <select
                type="text"
                name="assetName"
                className="form-control"
                placeholder="assetName"
                value={formData.assetName}
                onChange={handleChange}
                readOnly
                required
                style={{ height: '40px' }}
              >
                <option value="" style={{ fontSize: '1px' }}>
                  Select Asset Name
                </option>
                {assets.map((asset) => (
                  <option key={asset._id} value={asset.name}>
                    {asset.AssetName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="location">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="Location"
                value={formData.location}
                readOnly
                required
                style={{ height: '40px' }}
              />
            </div>

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="tbmScheduleDate">TBM Schedule Date</label>
              <input
                type="date"
                name="tbmScheduleDate"
                className="form-control"
                value={formData.tbmScheduleDate}
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
            <div className="form-group1" style={{ width: '33.5%' }}>
              <label htmlFor="tbmFrequency">TBM Frequency</label>
              <select
                name="tbmFrequency"
                className="form-control"
                value={formData.tbmFrequency}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              >
                <option value="">Select Frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="fifteen days">Fifteen Days</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half year">Half Year</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="form-group2" style={{}}>
              <label htmlFor="nextTbmDate">Next TBM Date</label>
              <input
                type="date"
                name="nextTbmDate"
                className="form-control"
                value={formData.nextTbmDate}
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
            Save
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}

export default TBMForm
