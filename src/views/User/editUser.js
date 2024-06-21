import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function EditUser() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
    Location: '',
  })
  const [address, setAddress] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/UserInfo/${id}`)
      const { name, phoneNumber, address, email, Location } = response.data
      setUserData({ name, phoneNumber, address, email, Location })
      setAddress(response.data.address)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:5000/UserInfo/${id}`, userData)
      // Clear form data after successful update
      setUserData({
        name: '',
        address: '',
        email: '',
        phoneNumber: '',
        Location: '',
      })
      // Navigate back to the previous page
      navigate(-1)
    } catch (error) {
      console.error('Error updating user:', error)
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
      <div className="tab-content1">
        <form onSubmit={handleUpdate} style={{ marginLeft: '12%' }}>
          <div className="row g-2">
            <div className="col-md-5">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                required
                className="form-control col-sm-4"
                name="name"
                id="name"
                value={userData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-5">
              <label htmlFor="name">Phone No:</label>
              <input
                type="text"
                required
                className="form-control col-sm-4"
                name="phoneNumber"
                id="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-5">
              <label htmlFor="name">Address:</label>
              <input
                type="text"
                required
                className="form-control col-sm-4"
                name="address"
                id="address"
                value={userData.address}
                onChange={handleInputChange}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <label htmlFor="name">Email:</label>
              <input
                type="text"
                required
                className="form-control col-sm-4"
                name="email"
                id="email"
                value={userData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-5">
              <label htmlFor="Location">Location:</label>
              <input
                type="text"
                required
                className="form-control col-sm-4"
                name="Location"
                id="Location"
                value={userData.Location}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <button
                className="btn btn-primary"
                style={{ width: '30%', marginBottom: '10px' }}
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
