import React, { useState } from 'react'
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

import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../slices/authSlice'
import { useLogoutMutation } from 'src/slices/usersApiSlice'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.custom.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.custom.sidebarShow)
  const userrole = useSelector((state) => state.auth.userInfo?.role)

  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()

  const [activeNavItem, setActiveNavItem] = useState(null)

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

  const sidebarStyles = {
    backgroundColor: '#000026',
    color: '#ffffff',
  }

  const sidebarNavStyles = {
    backgroundColor: '#000026',
  }

  const brandTextStyles = {
    fontSize: '25px',
    color: 'orange',
  }

  const navItemStyles = {
    color: '#ffffff',
  }

  const activeNavItemStyles = {
    backgroundColor: '#1e90ff',
    color: '#ffffff',
  }

  const logoutButtonStyles = {
    backgroundColor: '#000026',
    border: '1px solid #ddd',
    color: '#ffffff',
  }

  const handleNavItemClick = (index) => {
    setActiveNavItem(index)
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
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 0 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(0)}
                >
                  <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                  Dashboard
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/assetTable"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 1 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(1)}
                >
                  <CIcon customClassName="nav-icon" icon={cilCalculator} />
                  AssetTable
                </CNavItem>

                <CNavItem
                  component={NavLink}
                  to="/cbm"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 2 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(2)}
                >
                  <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                  CBM
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/tbm"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 3 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(3)}
                >
                  <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                  TBM
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/adminproduction"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 4 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(4)}
                >
                  <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                  Production
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/adminbreakdown"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 5 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(5)}
                >
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  Breakdown
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/adminbdhistory"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 6 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(6)}
                >
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  Breakdown History
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/pmSchedule"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 7 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(7)}
                >
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  PM Schedule
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/registeruser"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 8 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(8)}
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
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 0 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(0)}
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
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 0 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(0)}
                >
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  Breakdown
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/breakdownHistory"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 1 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(1)}
                >
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  Breakdown History
                </CNavItem>
                <CNavItem
                  component={NavLink}
                  to="/taskTable"
                  style={{
                    ...navItemStyles,
                    ...(activeNavItem === 2 ? activeNavItemStyles : {}),
                  }}
                  onClick={() => handleNavItemClick(2)}
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
