// import React, { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { NavLink, useNavigate } from 'react-router-dom'
// import '../components/header/appheader.css'
// import {
//   CContainer,
//   CHeader,
//   CHeaderBrand,
//   CHeaderDivider,
//   CHeaderNav,
//   CHeaderToggler,
//   CNavLink,
//   CNavItem,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilMenu } from '@coreui/icons' // Removed other icons for simplicity
// import { AppBreadcrumb } from './index'
// import { useLocation } from 'react-router-dom'
// import { useLogoutMutation } from 'src/slices/usersApiSlice'
// import { logout } from '../slices/authSlice'

// const AppHeader = () => {
//   const sidebarShow = useSelector((state) => state.sidebarShow)

//   const userrole = useSelector((state) => state.auth.userInfo?.role) || ''
//   const username = useSelector((state) => state.auth.userInfo?.name)

//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const [logoutApiCall] = useLogoutMutation()

//   const logoutHandler = async () => {
//     try {
//       await logoutApiCall().unwrap()
//       dispatch(logout())
//       navigate('/login')
//     } catch (error) {}
//   }

//   return (
//     <CHeader position="sticky" className="mb-4">
//       <CContainer fluid>
//         <CHeaderToggler
//           className="ps-1"
//           onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
//         >
//           <CIcon icon={cilMenu} size="lg" />
//         </CHeaderToggler>
//         <CHeaderBrand className="mx-auto d-md-none" to="/">
//           {/* <CIcon icon={logo} height={48} alt="Logo" /> */}
//         </CHeaderBrand>
//         <CHeaderNav className="d-none d-md-flex me-auto">
//           <CNavItem>
//             <CNavLink to="/dashboard" component={NavLink}>
//               Dashboard
//             </CNavLink>
//           </CNavItem>
//           {/* Other navigation items */}
//         </CHeaderNav>
//         <CHeaderNav>
//           <CNavItem>
//             <h5>Welcome , {username} </h5>
//             <p>
//               Role: {userrole} &nbsp;{' '}
//               <button className="button-91" role="button" onClick={logoutHandler}>
//                 LogOut
//               </button>
//             </p>
//             {/* <button className="button-91" role="button">
//               Button 91
//             </button> */}
//             {/* <button onClick={logoutHandler}>Logout</button> */}
//             <CNavLink href="#" style={{ fontSize: '25px', color: 'orange' }}>
//               {/* {currentUser.name} */}
//             </CNavLink>
//           </CNavItem>
//         </CHeaderNav>
//       </CContainer>
//       <CHeaderDivider />
//       <CContainer fluid>
//         <AppBreadcrumb />
//       </CContainer>
//     </CHeader>
//   )
// }

// export default AppHeader

// AppHeader.js
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilQrCode, cilBell, cilHelp } from '@coreui/icons'
import { cilMenu } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { useLogoutMutation } from 'src/slices/usersApiSlice'
import { logout } from '../slices/authSlice'
// import QrScanner from '../views/QrScanner'

const AppHeader = () => {
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [qrModal, setQrModal] = useState()
  const [scanResult, setScanResult] = useState('')
  const sidebarShow = useSelector((state) => state.custom.sidebarShow)
  const userrole = useSelector((state) => state.auth.userInfo?.role) || ''
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

  const handleScan = (data) => {
    if (data) {
      console.log('QR Code Data:', data)
      setScanResult(data.text)
      setQrModal(false)
    }
  }

  const handleError = (error) => {
    console.error('QR Scanner Error:', error)
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
            {/* <CButton color="warning" onClick={() => setQrModal(true)}>
              Scan QR Code
            </CButton> */}
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
      {/* {isQrScannerOpen && <QrScanner onClose={toggleQrScanner} />} */}
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
