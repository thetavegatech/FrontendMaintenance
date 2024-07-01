import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilQrCode, cilBell, cilHelp } from '@coreui/icons'
import { cilMenu } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { useLogoutMutation } from 'src/slices/usersApiSlice'
import { logout } from '../slices/authSlice'
import QrScanner from '../views/QrScanner'

const AppHeader = () => {
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [scanResult, setScanResult] = useState('')
  const sidebarShow = useSelector((state) => state.custom.sidebarShow)
  const userrole = useSelector((state) => state.auth.userInfo?.plant) || ''
  const username = useSelector((state) => state.auth.userInfo?.name)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()

  const toggleQrScanner = () => {
    setIsQrScannerOpen(!isQrScannerOpen)
  }

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleScanResult = (data) => {
    setScanResult(data)
    setIsQrScannerOpen(false) // Close the scanner after successful scan
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/" />
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          {/* Other navigation items */}
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <h6>Welcome, {username}</h6>
            <h6>Role: {userrole}</h6>
          </CNavItem>
          <CNavItem>
            <CIcon
              icon={cilQrCode}
              size="3xl"
              onClick={toggleQrScanner}
              className="cursor-pointer"
            />
          </CNavItem>
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
      {isQrScannerOpen && (
        <QrScanner
          onScan={handleScanResult}
          onError={console.error}
          onClose={() => setIsQrScannerOpen(false)}
        />
      )}
    </CHeader>
  )
}

export default AppHeader
