import React, { useState } from 'react'
// import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
import { MdDashboard } from 'react-icons/md'
import classNames from 'classnames'
import '../form.css'

const UserForm = () => {
  // State for form data and locations
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    email: '',
    location: '',
  })

  const [locations] = useState(['Location 1', 'Location 2', 'Location 3']) // Define the locations array here

  const navigate = useNavigate()

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!formData.Location && !formData.Validation) {
        alert('Please select a Value')
        return // Stop form submission
      }
      // Destructure form data from the state
      const {
        name,
        phoneNumber,
        email,
        address, // Assuming you have an address field in your form
        Location,
        plant,
        Validation,
      } = formData
      // setImage('')
      // const { name, phoneNumber, email, address, Location } = formData
      console.log('Asset Name:', name)
      console.log('Form Data:', formData)
      console.log('MachineNo:', Location)
      console.log('plant:', plant, Validation)
      // ... continue with other fields
      // setSuccessMessage('Form submitted successfully!')

      // Your fetch logic here
      const response = await fetch('http://localhost:4000/userInfo', {
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
      // uploadImage(e, data._id)
      // navigate(-1)
    } catch (error) {
      console.error('Error:', error)
      // navigate(-1)
    }
  }

  return (
    <div className="card shadow-sm mx-auto">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          className={classNames('box', 'd-flex', 'justify-content-center', 'align-items-center')}
          style={{ backgroundColor: '#007bff' }}
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
        <h5 style={{ marginLeft: '25px' }}>Create User</h5>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '5rem', marginTop: '0px' }}>
        <div className="form-row" style={{ marginLeft: '15px', marginRight: '15px' }}>
          <div className="form-group col-md-6">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ height: '40px' }}
            />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              className="form-control"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              style={{ height: '40px' }}
            />
          </div>
        </div>

        <div className="form-row" style={{ marginLeft: '15px', marginRight: '15px' }}>
          <div className="form-group col-md-6">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              style={{ height: '40px' }}
            />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ height: '40px' }}
            />
          </div>
        </div>

        <div className="form-row" style={{ marginLeft: '15px', marginRight: '15px' }}>
          <div className="col-md-6">
            <label htmlFor="Location">Location:</label>
            {/* <input
                type="text"
                className="form-control col-sm-6"
                id="Location"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
              /> */}
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
          </div>
          <div className="col-md-6">
            <label>Validation For Send SMS:</label>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="Validation"
                name="Validation" // Change this to "Validation"
                value="Yes"
                checked={formData.Validation === 'Yes'}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="yesCheckbox">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="Validation"
                name="Validation"
                value="No"
                checked={formData.Validation === 'No'}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="noCheckbox">
                No
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary ml-2"
          style={{
            float: 'left',
            backgroundColor: '#007bff',
            marginTop: '10px',
            marginLeft: '2rem',
          }}
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}

export default UserForm
