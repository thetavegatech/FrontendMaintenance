// import React from 'react'
// import { Route } from 'react-router-dom'
// import PropTypes from 'prop-types'
// import { Navigate } from 'react-router-dom' // Import Navigate
// import { useSelector } from 'react-redux'

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const IsAuthenticated = () => {
//     const username = useSelector((state) => state.auth.userInfo?.name) // Retrieve the token from storage
//     return !!username
//   }

//   const name = IsAuthenticated()
//   // console.log(name)
//   // console.log('isAuthenticated:', isAuthenticated)

//   return <Route {...rest} element={name ? <Component /> : <Navigate to="/login" replace />} />
// }

// PrivateRoute.propTypes = {
//   component: PropTypes.elementType.isRequired,
// }

// export default PrivateRoute

// src/components/PrivateRoute.js

// import React from 'react'
// import { Route, NavLink } from 'react-router-dom'
// import PropTypes from 'prop-types'

// const PrivateRoute = ({ component: Component, IsAuthenticated, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) => (IsAuthenticated ? <Component {...props} /> : <NavLink to="/login" />)}
//   />
// )

// PrivateRoute.propTypes = {
//   component: PropTypes.elementType.isRequired,
//   IsAuthenticated: PropTypes.bool.isRequired,
// }

// export default PrivateRoute

// components/PrivateRoute.js

// PrivateRoute.js
// PrivateRoute.js
// PrivateRoute.js
import React from 'react'
import PropTypes from 'prop-types'
import { Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { userInfo } = useSelector((state) => state.auth)

  return (
    <Route
      {...rest}
      element={(props) => (userInfo ? <Element {...props} /> : <Navigate to="/login" replace />)}
    />
  )
}

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
}

export default PrivateRoute
