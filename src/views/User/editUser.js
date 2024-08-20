import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../form.css'
import { MdDashboard } from 'react-icons/md'
import classNames from 'classnames'

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
      const response = await axios.get(`http://localhost:4000/UserInfo/${id}`)
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
      await axios.put(`http://localhost:4000/UserInfo/${id}`, userData)
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
    <div className="card shadow-sm mx-auto">
      {/* <Link to="/temperature" style={{ position: 'absolute', top: '15px', right: '10px' }}></Link> */}

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          className={classNames('box', 'd-flex', 'justify-content-center', 'align-items-center')}
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
        <h5 style={{ marginLeft: '25px' }}>User Edit</h5>
      </div>
      <div className="tab-content1">
        <form onSubmit={handleUpdate} style={{ marginBottom: '5rem', marginTop: '0px' }}>
          <div className="row g-2" style={{ marginLeft: '30px' }}>
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
                type="submit"
                className="btn btn-primary ml-2"
                style={{
                  float: 'left',
                  backgroundColor: '#007bff',
                  marginTop: '10px',
                  marginLeft: '2rem',
                }}
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
