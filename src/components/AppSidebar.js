import React from 'react'
// import '../App.css'
import { useSelector, useDispatch } from 'react-redux'
import logo from '../assets/logo.svg'
import {
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'

import { CNavItem, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// Sidebar navigation config
import navigation from '../_nav'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../slices/authSlice'
import { useLogoutMutation } from 'src/slices/usersApiSlice'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.custom.sidebarUnfoldable) // Update 'custom' based on your actual reducer key
  const sidebarShow = useSelector((state) => state.custom.sidebarShow) // Update 'custom' based on your actual reducer key
  const userrole = useSelector((state) => state.auth.userInfo?.role)

  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    // Show a confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to logout?')

    // If the user clicks "OK", proceed with logout
    if (confirmLogout) {
      try {
        // Your logout API call and logic
        await logoutApiCall().unwrap()
        // Dispatch the logout action
        dispatch(logout())
        // Navigate to the login page
        navigate('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    } else {
      // If the user clicks "Cancel", do nothing or handle accordingly
      console.log('Logout canceled')
    }
  }

  const sidebarStyles = {
    backgroundColor: '#000026', // Dark background color
    color: '#ffffff', // Text color
  }

  const sidebarNavStyles = {
    backgroundColor: '#000026', // Ensures the nav has the same background
  }
  // #eefbfd

  const brandTextStyles = {
    fontSize: '25px',
    color: 'orange',
  }

  const navItemStyles = {
    color: '#ffffff', // Nav item text color
  }

  const navItemHoverStyles = {
    color: '#1e90ff', // Hover color
  }

  const activeNavItemStyles = {
    backgroundColor: '#1e90ff', // Active link background color
    color: '#ffffff', // Active link text color
  }

  const logoutButtonStyles = {
    backgroundColor: '#000026', // Info button background color
    border: '1px solid #ddd',
    color: '#ffffff', // Info button text color
  }

  const logoutButtonHoverStyles = {
    backgroundColor: '#138496', // Info button hover color
  }

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      style={sidebarStyles}
    >
      <CSidebarBrand className="d-md-none">
        <img src={logo} className="logo1" alt="Before Logo" style={{ height: '45px' }} />
        <h4 style={brandTextStyles}>Thetavega Tech</h4>
      </CSidebarBrand>
      <CSidebarBrand className="d-none d-md-flex">
        <img
          src={logo}
          className="logo1"
          alt="Before Logo"
          style={{ marginRight: '20px', height: '45px', marginLeft: '-10%' }}
        />
        <h4 style={brandTextStyles}>Thetavega Tech</h4>
      </CSidebarBrand>
      <CSidebarNav style={sidebarNavStyles}>
        {(() => {
          if (userrole === 'admin') {
            return (
              <>
                <CNavItem
                  component={NavLink}
                  to="/dashboard"
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                >
                  <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                  Dashboard
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/assetTable"
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                >
                  <CIcon customClassName="nav-icon" icon={cilCalculator} />
                  AssetTable
                </CNavItem>

                <CNavItem
                  component={NavLink}
                  to="/cbm"
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                >
                  <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                  CBM
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/tbm"
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                >
                  <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                  TBM
                </CNavItem>
                <CNavItem component={NavLink} style={navItemStyles} to="/adminproduction">
                  <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                  Production
                </CNavItem>
                <CNavItem component={NavLink} style={navItemStyles} to="/adminbreakdown">
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  Breakdown
                </CNavItem>
                <CNavItem component={NavLink} style={navItemStyles} to="/adminbdhistory">
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  Breakdown History
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/pmSchedule"
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                >
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  PM Schedule
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                  to="/users"
                >
                  <CIcon customClassName="nav-icon" icon={cilNotes} />
                  Users
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                  to="/registeruser"
                >
                  <CIcon customClassName="nav-icon" icon={cilNotes} />
                  Registered Users
                </CNavItem>
              </>
            )
          } else if (userrole === 'production') {
            return (
              <>
                <CNavItem
                  component={NavLink}
                  to="/production"
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                >
                  <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                  Production
                </CNavItem>
              </>
            )
          } else if (userrole === 'maintenance') {
            return (
              <>
                <CNavItem
                  component={NavLink}
                  to="/breakdown"
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                >
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  Breakdown
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/breakdownHistory"
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                >
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  Breakdown History
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/taskTable"
                  style={navItemStyles}
                  activeStyle={activeNavItemStyles}
                >
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  PM Schedule
                </CNavItem>
              </>
            )
          } else {
            return null
          }
        })()}
      </CSidebarNav>
      <button
        type="button"
        className="btn btn-info"
        onClick={logoutHandler}
        style={logoutButtonStyles}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#138496')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#17a2b8')}
      >
        Logout
      </button>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
