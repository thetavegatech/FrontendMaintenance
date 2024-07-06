import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { addDays, addWeeks, addMonths } from 'date-fns'
import { useParams, useNavigate } from 'react-router-dom'
import './form.css'
import { MdDashboard } from 'react-icons/md'

import { Link } from 'react-router-dom'
import classNames from 'classnames'

const CBMEdit = () => {
  const [formData, setFormData] = useState({
    assets: '',
    assetName: '',
    location: '',
    assetType: '',
    installationDate: '',
    cbmScheduleDate: '',
    cbmFrequency: '',
    nextCbmDate: '',
    status: '',
  })

  const { id } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Fetch data by id when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://backendmaintenx.onrender.com/api/cbm/${id}`)
        const data = response.data

        setFormData({
          assetName: data.assetName,
          location: data.location,
          assetType: data.assetType,
          installationDate: data.installationDate,
          cbmScheduleDate: data.cbmScheduleDate ? data.cbmScheduleDate.split('T')[0] : '',
          cbmFrequency: data.cbmFrequency,
          nextCbmDate: data.nextCbmDate ? data.nextCbmDate.split('T')[0] : '',
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
      await axios.put(`https://backendmaintenx.onrender.com/api/cbm/${id}`, formData)
      navigate(-1) // Navigate back to the previous page
    } catch (error) {
      console.error('Error updating CBM record:', error)
      setMessage('Error updating CBM record. Please try again.')
    }
  }

  return (
    <div className="card shadow-sm mx-auto">
      <Link to="/temperature" style={{ position: 'absolute', top: '15px', right: '10px' }}></Link>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
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
        <h5 style={{ marginLeft: '25px' }}>CBM Edit</h5>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '5rem', marginTop: '0px' }}>
        <div className="form-row1" style={{ marginLeft: '30px' }}>
          <div className="form-row">
            <div className="form-group" style={{ width: '25%' }}>
              <label>Asset Name:</label>
              <input
                name="assetName"
                className="form-control col-sm-6"
                value={formData.assetName}
                onChange={handleChange}
                required
              />
              {/* </select> */}
            </div>

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="location">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                readOnly
                required
                style={{ height: '40px' }}
              />
            </div>

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="cbmScheduleDate">CBM Schedule Date</label>
              <input
                type="date"
                name="cbmScheduleDate"
                className="form-control"
                value={formData.cbmScheduleDate}
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
              <label htmlFor="cbmFrequency">CBM Frequency</label>
              <select
                name="cbmFrequency"
                className="form-control"
                value={formData.cbmFrequency}
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

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="nextCbmDate">Next CBM Date</label>
              <input
                type="date"
                name="nextCbmDate"
                className="form-control"
                value={formData.nextCbmDate}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
            </div>

            <div className="form-group" style={{ width: '25%' }}>
              <label htmlFor="status">Status</label>
              <input
                type="text"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
                required
                style={{ height: '40px' }}
              />
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

export default CBMEdit
