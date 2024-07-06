import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import '../form.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function BreakDown() {
  const { id } = useParams()
  const navigate = useNavigate()

  // State variables
  const [formData, setFormData] = useState({
    MachineName: '',
    BreakdownStartDate: '',
    Location: '',
    Shift: '',
    LineName: '',
    Operations: '',
    BreakdownPhenomenon: '',
    BreakdownStartTime: '',
    BreakdownType: '',
    WhyWhyAnalysis: '',
    RootCause: '',
    TargetDate: '',
    Responsibility: '',
    HD: '',
    Remark: '',
    BreakdownEndDate: '',
    BreakdownEndTime: '',
    Attachment: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://backendmaintenx.onrender.com/api/breakdown/${id}`)
      console.log(response.data)
      setFormData({
        MachineName: response.data.MachineName,
        BreakdownStartDate: response.data.BreakdownStartDate,
        Location: response.data.Location,
        Shift: response.data.Shift,
        LineName: response.data.LineName,
        Operations: response.data.Operations,
        BreakdownPhenomenon: response.data.BreakdownPhenomenon,
        BreakdownStartTime: response.data.BreakdownStartTime,
        BreakdownType: response.data.BreakdownType,
        WhyWhyAnalysis: response.data.WhyWhyAnalysis,
        RootCause: response.data.RootCause,
        TargetDate: response.data.TargetDate,
        Responsibility: response.data.Responsibility,
        HD: response.data.HD,
        Remark: response.data.Remark,
        BreakdownEndDate: response.data.BreakdownEndDate,
        BreakdownEndTime: response.data.BreakdownEndTime,
        Attachment: response.data.Attachment,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(
        `https://backendmaintenx.onrender.com/api/breakdown/${id}`,
        formData,
      )
      console.log(response)
      toast.success('Asset created successfully!', { autoClose: 5000 })
      // Assuming you want to clear the form after successful update
      setFormData({
        MachineName: '',
        BreakdownStartDate: '',
        Location: '',
        Shift: '',
        LineName: '',
        Operations: '',
        BreakdownPhenomenon: '',
        BreakdownStartTime: '',
        BreakdownType: '',
        WhyWhyAnalysis: '',
        RootCause: '',
        TargetDate: '',
        Responsibility: '',
        HD: '',
        Remark: '',
        BreakdownEndDate: '',
        BreakdownEndTime: '',
        Attachment: '',
      })
      // Navigate back to the previous page
      navigate(-1)
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }

  return (
    <div className="card shadow-sm mx-auto" style={{ marginTop: '0.5rem' }}>
      <Link
        to="/temperature"
        style={{ position: 'absolute', top: '10px', right: '10px', overflow: 'hidden' }}
      >
        {/* Content inside Link */}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div className="box d-flex justify-content-center align-items-center">
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
      </div>

      <div className="table-container">
        <form onSubmit={handleSubmit} style={{ marginBottom: '5rem', marginTop: '0px' }}>
          <div className="form-row1" style={{ marginLeft: '25px' }}>
            {/* First Row */}
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
                <label htmlFor="MachineName">Machine Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="MachineName"
                  name="MachineName"
                  value={formData.MachineName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownStartDate">Breakdown Start Date:</label>
                <input
                  // type="date"
                  className="form-control"
                  id="BreakdownStartDate"
                  name="BreakdownStartDate"
                  value={formData.BreakdownStartDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Location">Location:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Location"
                  name="Location"
                  value={formData.Location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Second Row */}
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
                <label htmlFor="Shift">Shift:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Shift"
                  name="Shift"
                  value={formData.Shift}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="LineName">Line Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="LineName"
                  name="LineName"
                  value={formData.LineName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Operations">Operations:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Operations"
                  name="Operations"
                  value={formData.Operations}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Third Row */}
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
                <label htmlFor="BreakdownPhenomenon">Breakdown Phenomenon:</label>
                <input
                  type="text"
                  className="form-control"
                  id="BreakdownPhenomenon"
                  name="BreakdownPhenomenon"
                  value={formData.BreakdownPhenomenon}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownStartTime">Breakdown Start Time:</label>
                <input
                  type="text"
                  className="form-control"
                  id="BreakdownStartTime"
                  name="BreakdownStartTime"
                  value={formData.BreakdownStartTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownType">Breakdown Type:</label>
                <select
                  className="form-control"
                  id="BreakdownType"
                  name="BreakdownType"
                  value={formData.BreakdownType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Hydraulic">Hydraulic</option>
                  <option value="Pneumatic">Pneumatic</option>
                  <option value="Production Setting">Production Setting</option>
                </select>
              </div>
            </div>

            {/* Fourth Row */}
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
                <label htmlFor="WhyWhyAnalysis">Why-Why Analysis:</label>
                <input
                  type="textarea"
                  className="form-control"
                  id="WhyWhyAnalysis"
                  name="WhyWhyAnalysis"
                  value={formData.WhyWhyAnalysis}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="RootCause">Root Cause:</label>
                <input
                  type="textarea"
                  className="form-control"
                  id="RootCause"
                  name="RootCause"
                  value={formData.RootCause}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="TargetDate">Target Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="TargetDate"
                  name="TargetDate"
                  value={formData.TargetDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Fifth Row */}
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
                <label htmlFor="Responsibility">Responsibility:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Responsibility"
                  name="Responsibility"
                  value={formData.Responsibility}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="HD">HD:</label>
                <input
                  type="text"
                  className="form-control"
                  id="HD"
                  name="HD"
                  value={formData.HD}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Remark">Remark:</label>
                <input
                  type="textarea"
                  className="form-control"
                  id="Remark"
                  name="Remark"
                  value={formData.Remark}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Sixth Row */}
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
                <label htmlFor="BreakdownEndDate">Breakdown End Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="BreakdownEndDate"
                  name="BreakdownEndDate"
                  value={formData.BreakdownEndDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownEndTime">Breakdown End Time:</label>
                <input
                  type="text"
                  className="form-control"
                  id="BreakdownEndTime"
                  name="BreakdownEndTime"
                  value={formData.BreakdownEndTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Attachment">Attachment:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Attachment"
                  name="Attachment"
                  value={formData.Attachment}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  float: 'left',
                  backgroundColor: '#CA226B',
                  marginTop: '10px',
                  alignItems: 'start',
                  marginRight: '60rem',
                }}
              >
                Save
              </button>
            </div>

            {/* Submit Button */}
            {/* <div className="form-group d-flex justify-content-center" style={{ marginTop: '3rem' }}>
             
            </div> */}
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}
