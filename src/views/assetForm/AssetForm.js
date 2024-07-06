import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../assetForm/Assetform.css'
import classNames from 'classnames'

const MyFormComponent = () => {
  const [formData, setFormData] = useState({
    AssetName: '',
    MachineNo: '',
    SrNo: '',
    MachineType: '',
    Model: '',
    Controller: '',
    PowerRatting: '',
    CapecitySpindle: '',
    AxisTravels: '',
    Ranking: '',
    InstallationDate: '',
    Location: '',
    ManufacturingYear: '',
    Image: '',
  })
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState('')

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
  const { id } = useParams()
  const uploadImage = (e, id) => {
    e.preventDefault()
    axios
      .put(`https://backendmaintenx.onrender.com/api/assets/${id}`, {
        Image,
      })
      .then((result) => {
        console.log(result)
        setImage('')
        navigate(-1)
      })
      .catch((err) => console.log(err))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const {
        AssetName,
        MachineNo,
        SrNo,
        MachineType,
        Make,
        Controller,
        PowerRatting,
        CapecitySpindle,
        AxisTravels,
        Ranking,
        Location,
        InstallationDate,
        ManufacturingYear,
        Image,
      } = formData

      setSuccessMessage('Form submitted successfully!')

      const response = await fetch('https://backendmaintenx.onrender.com/api/assets', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Response from server:', data)
      uploadImage(e, data._id)
      toast.success('Asset created successfully!', { autoClose: 15000 })

      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
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
        <h5 style={{ marginLeft: '25px' }}>Create Assets Record</h5>
      </div>
      {successMessage && (
        <div className="alert alert-success" role="alert" style={{ marginTop: '10px' }}>
          {successMessage}
        </div>
      )}
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
              <label htmlFor="machineName">Machine Name</label>
              <input
                type="text"
                name="machineName"
                className="form-control"
                value={formData.AssetName}
                onChange={(e) => setFormData({ ...formData, AssetName: e.target.value })}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="machineNo">Machine No</label>
              <input
                type="text"
                name="machineNo"
                className="form-control"
                value={formData.MachineNo}
                onChange={(e) => setFormData({ ...formData, MachineNo: e.target.value })}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="srNo">Sr No</label>
              <input
                type="text"
                name="srNo"
                className="form-control"
                value={formData.SrNo}
                onChange={(e) => setFormData({ ...formData, SrNo: e.target.value })}
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
              <label htmlFor="machineType">Machine Type</label>
              <input
                type="text"
                name="machineType"
                className="form-control"
                value={formData.MachineType}
                onChange={(e) => setFormData({ ...formData, MachineType: e.target.value })}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="model">Model</label>
              <input
                type="text"
                name="model"
                className="form-control"
                value={formData.Model}
                onChange={(e) => setFormData({ ...formData, Model: e.target.value })}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="controller">Controller</label>
              <input
                type="text"
                name="controller"
                className="form-control"
                value={formData.Controller}
                onChange={(e) => setFormData({ ...formData, Controller: e.target.value })}
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
              <label htmlFor="powerRatting">Power Rating</label>
              <input
                type="text"
                name="powerRatting"
                className="form-control"
                value={formData.PowerRatting}
                onChange={(e) => setFormData({ ...formData, PowerRatting: e.target.value })}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="capacitySpindle">Capacity Spindle</label>
              <input
                type="text"
                name="capacitySpindle"
                className="form-control"
                value={formData.CapecitySpindle}
                onChange={(e) => setFormData({ ...formData, CapecitySpindle: e.target.value })}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="axisTravels">Axis Travels</label>
              <input
                type="text"
                name="axisTravels"
                className="form-control"
                value={formData.AxisTravels}
                onChange={(e) => setFormData({ ...formData, AxisTravels: e.target.value })}
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
              <label htmlFor="location">Location</label>
              <select
                className="form-control"
                required
                id="assetLocation"
                name="assetLocation"
                onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
              >
                <option value="">Select an option</option>
                <option value="Plant 1">Plant 1</option>
                <option value="Plant 2">Plant 2</option>
                <option value="Plant 3">Plant 3</option>
                <option value="Plant 4">Plant 4</option>
              </select>
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="ranking">Ranking</label>
              <select
                className="form-control"
                required
                id="ranking"
                name="ranking"
                onChange={(e) => setFormData({ ...formData, Ranking: e.target.value })}
              >
                <option value="">Select an option</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="installationDate">Installation Date</label>
              <input
                type="date"
                name="installationDate"
                className="form-control"
                value={formData.InstallationDate}
                onChange={(e) => setFormData({ ...formData, InstallationDate: e.target.value })}
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
              <label htmlFor="manufacturingYear">Manufacturing Year</label>
              <input
                type="text"
                name="manufacturingYear"
                className="form-control"
                value={formData.ManufacturingYear}
                onChange={(e) => setFormData({ ...formData, ManufacturingYear: e.target.value })}
                required
                style={{ height: '40px' }}
              />
            </div>
            <div className="form-group" style={{ width: '30%' }}>
              <label htmlFor="attachment">Attachment</label>
              <input
                type="file"
                name="attachment"
                className="form-control"
                value={formData.attachment}
                onChange={(e) => setFormData({ ...formData, attachment: e.target.value })}
                // required
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
              marginTop: '10px',
              alignItems: 'end',
            }}
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}

export default MyFormComponent
