import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '', // Assuming you have an address field in your form
    Location: '',
    plant: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()

  //   try {
  //     const response = await axios.post('https://mms-backend-n2zv.onrender.com/UserNo', formData)
  //     console.log('User created successfully:', response.data)
  //     console.log('location', Location)
  //     navigate(-1)
  //     // You can handle further actions here, such as displaying a success message or redirecting the user.
  //   } catch (error) {
  //     console.error('Error creating user:', error.response.data.error)
  //     // Handle error cases, such as displaying an error message to the user.
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Destructure form data from the state
      const {
        name,
        phoneNumber,
        email,
        address, // Assuming you have an address field in your form
        Location,
        plant,
      } = formData
      // setImage('')
      // const { name, phoneNumber, email, address, Location } = formData
      console.log('Asset Name:', name)
      console.log('Form Data:', formData)
      console.log('MachineNo:', Location)
      console.log('plant:', plant)
      // ... continue with other fields
      // setSuccessMessage('Form submitted successfully!')

      // Your fetch logic here
      const response = await fetch('http://localhost:5000/userInfo', {
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
    <div
      className="container-lg"
      style={{
        border: '2px solid #ccc',
        backgroundColor: '',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '90%',
      }}
    >
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-6">
              <label htmlFor="name">Name:</label>
              <input
                className="form-control col-sm-6"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="text"
                id="phoneNumber"
                className="form-control col-sm-6"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

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
            {/* <div className="col-md-6">
              <label
                htmlFor="assetLocation"
                className="form-label"
                style={{ marginBottom: '10px' }}
              >
                Location:
              </label>
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
            </div> */}
            {/* <div className="col-md-6">
              <label htmlFor="Location">Location:</label>
              <select
                className="form-control col-sm-6"
                required
                id="Location"
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
            </div> */}

            <div className="col-xs-12">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm
