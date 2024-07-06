import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { Input } from 'reactstrap'
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mobileNo: '',
    role: '',
    plant: '',
  })
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('https://backendmaintenx.onrender.com/api/users', {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        mobileNO: formData.mobileNo,
        role: formData.role,
        plant: formData.plant,
      })

      if (response.status === 201) {
        console.log('Registration successful')
        console.log(response.data)
        setRegistrationSuccess(true)

        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        console.error('Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <Input
                      placeholder="Username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="mobileNo"
                      type="text"
                      placeholder="Mobile Number"
                      autoComplete="tel"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    {/* <CFormInput
                      name="plant"
                      type="text"
                      placeholder="Select Plant"
                      autoComplete="tel"
                      value={formData.plant}
                      onChange={handleChange}
                      required
                    /> */}
                    <select
                      className="form-select"
                      // required
                      id="plant"
                      name="plant"
                      value={formData.plant}
                      onChange={handleChange}
                    >
                      <option value="">Select an option</option>
                      <option value="Plant 1">Plant 1</option>
                      <option value="Plant 2">Plant 2</option>
                      <option value="Plant 3">Plant 3</option>
                      <option value="Plant 4">Plant 4</option>
                    </select>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <select
                      id="role"
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select User Role</option>
                      <option value="admin">Admin</option>
                      <option value="production">Production</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="PremativeMaintenance">Premative Maintenance</option>
                    </select>
                  </CInputGroup>

                  {registrationSuccess && (
                    <div className="alert alert-success" role="alert">
                      Registration successful! Redirecting to login...
                    </div>
                  )}

                  <div className="d-grid">
                    <CButton type="submit" color="success">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
// is it possible to add multile location when i register user
