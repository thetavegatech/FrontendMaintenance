// AppHeader.js
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { BiSolidUser } from 'react-icons/bi'
import { IoIosNotifications } from 'react-icons/io'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CDropdown,
  // BiSolidUser,
  // CButton,
  // CFormInput,
  CModal,
  // CModalHeader,
  // CModalTitle,
  // CModalBody,
  // CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilQrCode, cilSearch, CInputGroup } from '@coreui/icons'
import { cilMenu } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { useLogoutMutation } from 'src/slices/usersApiSlice'
import { logout } from '../slices/authSlice'
import QrScanner from '../views/QrScanner'

const AppHeader = () => {
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [qrModal, setQrModal] = useState()
  const [scanResult, setScanResult] = useState('')
  const sidebarShow = useSelector((state) => state.custom.sidebarShow)
  // const userrole = useSelector((state) => state.auth.userInfo?.plant) || ''
  // const username = useSelector((state) => state.auth.userInfo?.name)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()

  const toggleQrScanner = () => {
    setIsQrScannerOpen(!isQrScannerOpen)
  }

  const logoutHandler = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?')
    if (confirmLogout) {
      try {
        await logoutApiCall().unwrap()
        dispatch(logout())
        navigate('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    } else {
      console.log('Logout canceled')
    }
  }

  const goToQrScanner = () => {
    navigate('/qrscanner')
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

        <CHeaderNav className="me-3 d-flex align-items-center">
          {/* Toggle QR Scanner Icon */}
          <CIcon
            icon={cilQrCode}
            size="xl"
            onClick={goToQrScanner}
            className="cursor-pointer me-3"
          />

          {/* Notification Icon */}
          <CNavItem className="me-1">
            <IoIosNotifications size={24} className="cursor-pointer" />
          </CNavItem>

          {/* User Icon */}
          <CDropdown>
            <CDropdownToggle color="" className="cursor-pointer">
              <BiSolidUser size={24} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="/profile">Profile</CDropdownItem>
              <CDropdownItem onClick={logoutHandler}>Logout</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
      {isQrScannerOpen && <QrScanner onClose={toggleQrScanner} />}
      {/* <CModal show={qrModal} onClose={() => setQrModal(true)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Scan QR Code</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
          {scanResult && (
            <div>
              <p>Scanned Data: {scanResult}</p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setQrModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal> */}
    </CHeader>
  )
}

export default AppHeader
