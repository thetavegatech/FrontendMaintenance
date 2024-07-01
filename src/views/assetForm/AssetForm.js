import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const MyFormComponent = () => {
  // Define state variables for form inputs
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
        // AssetName,
        // MachineNo,
        // SrNo,
        // MachineType,
        // Make,
        // Controller,
        // PowerRatting,
        // CapecitySpindle,
        // AxisTravels,
        // Ranking,
        // Location,
        // InstallationDate,
        // ManufacturingYear,
        Image,
      })
      .then((result) => {
        console.log(result)
        // setAssetName('')
        setImage('')

        // Assuming you have a navigate function or useHistory from react-router-dom
        // Navigate back to the previous page
        navigate(-1)
      })
      .catch((err) => console.log(err))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Destructure form data from the state
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
        // InstallationDate,
        InstallationDate,
        ManufacturingYear,
        Image,
        // Image,
      } = formData
      // setImage('')
      console.log('Asset Name:', AssetName)
      console.log('MachineNo:', MachineNo)
      console.log('SrNo:', SrNo)
      console.log('Location:', Location)
      console.log('MachineType:', MachineType)
      console.log('Make:', Make)
      console.log('Controller:', Controller)
      console.log('PowerRatting:', PowerRatting)
      console.log('Image:', Image)
      console.log('InstallationDate:', InstallationDate)
      // ... continue with other fields
      setSuccessMessage('Form submitted successfully!')

      // Your fetch logic here
      const response = await fetch('https://backendmaintenx.onrender.com/api/assets', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(formData),
      })
      navigate(-1)

      const data = await response.json()
      console.log('Response from server:', data)
      uploadImage(e, data._id)
      // navigate(-1)

      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    } catch (error) {
      console.error('Error:', error)
      // navigate(-1)
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
      {/* Display success message if it exists */}
      {successMessage && (
        <div className="alert alert-success" role="alert" style={{ marginTop: '10px' }}>
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ margin: '3%' }}>
        <div className="row g-3">
          {[
            { label: 'Machine Name', id: 'assetName', type: 'text', valueKey: 'AssetName' },
            { label: 'Machine No', id: 'MachineNo', type: 'number', valueKey: 'MachineNo' },
            { label: 'Sr No', id: 'srno', type: 'number', valueKey: 'SrNo' },
            { label: 'Machine Type', id: 'MachineType', type: 'text', valueKey: 'MachineType' },
            { label: 'Model', id: 'Model', type: 'text', valueKey: 'Model' },
            { label: 'Controller', id: 'controller', type: 'text', valueKey: 'Controller' },
            { label: 'Power Rating', id: 'powerRatting', type: 'text', valueKey: 'PowerRatting' },
            {
              label: 'Capacity Spindle',
              id: 'capecitySpindle',
              type: 'text',
              valueKey: 'CapecitySpindle',
            },
            { label: 'Axis Travels', id: 'axistravels', type: 'text', valueKey: 'AxisTravels' },
          ].map(({ label, id, type, valueKey }) => (
            <div className="col-md-3" key={id} style={{ marginBottom: '15px' }}>
              <label htmlFor={id} style={{ marginBottom: '5px', display: 'block' }}>
                {label}:
              </label>
              <input
                required
                type={type}
                className="form-control"
                id={id}
                onChange={(e) => setFormData({ ...formData, [valueKey]: e.target.value })}
              />
            </div>
          ))}
          <div className="col-md-3" style={{ marginBottom: '15px' }}>
            <label htmlFor="assetLocation" className="form-label">
              Location:
            </label>
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
          <div className="col-md-3" style={{ marginBottom: '15px' }}>
            <label htmlFor="ranking" className="form-label">
              Ranking:
            </label>
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
          <div className="col-md-3" style={{ marginBottom: '15px' }}>
            <label htmlFor="installationDate" style={{ marginBottom: '5px', display: 'block' }}>
              Installation Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="InstallationDate"
              name="InstallationDate"
              onChange={(e) => setFormData({ ...formData, InstallationDate: e.target.value })}
            />
          </div>
          <div className="col-md-3" style={{ marginBottom: '15px' }}>
            <label htmlFor="manufacturingyear" style={{ marginBottom: '5px', display: 'block' }}>
              Manufacturing Year:
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="manufacturingyear"
              onChange={(e) => setFormData({ ...formData, ManufacturingYear: e.target.value })}
            />
          </div>
          <div className="col-md-3" style={{ marginBottom: '15px' }}>
            <label htmlFor="attachment">Attachment:</label>
            <input
              type="file"
              id="Image"
              name="Image"
              className="form-control"
              onChange={convertToBse64}
            />
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                marginTop: '10px',
                fontSize: '16px',
                backgroundColor: '#000026',
                // transition: 'background-color 0.3s',
                cursor: 'pointer',
              }}
              // onMouseOver={(e) => (e.target.style.backgroundColor = '#009bff')}
              // onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>

    // </div>
  )
}

export default MyFormComponent
