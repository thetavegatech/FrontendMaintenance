import React from 'react'
import UserForm from './views/User/userForm'
import EditUser from './views/User/editUser'

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Logout = React.lazy(() => import('./views/pages/Logout'))

// ./layout/DefaultLayout
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AssetForm = React.lazy(() => import('./views/assetForm/AssetForm'))
const AssetTable = React.lazy(() => import('./views/assetTable/AssetTable'))
const Breakdown = React.lazy(() => import('./views/breakdown/Breakdown'))
const breakdownForm = React.lazy(() => import('./views/breakdown/BreakdownForm'))
const BreakdownHistory = React.lazy(() => import('./views/breakdown/BreakdownHistory'))
// const editasset = React.lazy(() => import('./views/assetTable/EditAsset'))
const QrScanner = React.lazy(() => import('./views/QrScanner'))
const EditAsset = React.lazy(() => import('./views/editasset/EditAsset'))
const ProductionBD = React.lazy(() => import('./views/production/ProductionBD'))
const Production = React.lazy(() => import('./views/production/Production'))
const PBDStatus = React.lazy(() => import('./views/production/PBDStatus'))
const TaskTable = React.lazy(() => import('./views/tasks/TaskTable'))
const TaskForm = React.lazy(() => import('./views/tasks/TaskForm'))
const EditTask = React.lazy(() => import('./views/tasks/EditTask'))
const Users = React.lazy(() => import('./views/User/Users'))
// const BreakDownRecord = React.lazy(() => import('./views/breakdown/BreakDownRecord'))
const BreakDownRecord = React.lazy(() => import('./views/breakdown/BreakDownRecord.js'))
const AssetRecord = React.lazy(() => import('./views/assetTable/AssetRecord'))
const TaskRecord = React.lazy(() => import('./views/tasks/TaskRecord'))
const PMSchedule = React.lazy(() => import('./views/PM/PMSchedule'))
const EditPM = React.lazy(() => import('./views/PM/EditPM'))
const TBM = React.lazy(() => import('./views/TBM'))
const TBMEdit = React.lazy(() => import('./views/TBMEdit'))
const CBM = React.lazy(() => import('./views/CBM'))
const CBMEdit = React.lazy(() => import('./views/CBMEdit'))
const PM = React.lazy(() => import('./views/PM'))
const CBMForm = React.lazy(() => import('./views/CBMForm'))
const TBMForm = React.lazy(() => import('./views/TBMForm'))
const editregisteruser = React.lazy(() => import('./views/pages/register/editregisteruser'))
const registerUser = React.lazy(() => import('./views/pages/register/registerUser'))
const AdminProduction = React.lazy(() => import('./views/AdminVeiw/AdminProduction'))
const AdminBreakdown = React.lazy(() => import('./views/AdminVeiw/AdminBreakdown'))
const AdminBDHistory = React.lazy(() => import('./views/AdminVeiw/AdminBDHistory'))
// Base

//Forms

// Icons

// Notifications

const routes = [
  { path: '/login', exact: true, name: 'Login', element: Login },
  { path: '/logout', exact: true, name: 'Logout', element: Logout },

  { path: '/', exact: true, name: 'Home' },
  { path: '/assetRecord/:id', exact: true, name: 'assetRecord', element: AssetRecord },
  { path: '/qrscanner', name: 'QrScanner', element: QrScanner },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
    // element: <PrivateRoute component={<Dashboard />} IsAuthenticated={IsAuthenticated} />,
    // element: withAuthorization(Dashboard, ['admin', 'production', 'maintenance']),
  },
  { path: '/assetForm', name: 'AssetForm', element: AssetForm },
  { path: '/assetTable', name: 'AssetTable', element: AssetTable },
  {
    path: '/breakdown',
    name: 'Breakdown',
    element: Breakdown,
  },
  { path: '/breakdownForm', name: 'BreakdownForm', element: breakdownForm },
  { path: '/breakdownHistory', name: 'BreakdownHistory', element: BreakdownHistory },
  { path: '/editasset/:id', name: 'EditAsset', element: EditAsset },
  {
    path: '/productionBD/:id',
    name: 'ProductionDB',
    element: ProductionBD,
  },
  {
    path: '/production',
    name: 'Production',
    element: Production,
  },
  { path: '/pbdStatus/:id', name: 'PBDStatus', element: PBDStatus },
  { path: '/taskTable', name: 'TaskTable', element: TaskTable },

  {
    path: '/taskForm',
    name: 'TaskForm',
    element: TaskForm,
  },
  { path: '/editTask/:id', name: 'EditTask', element: EditTask },
  { path: '/users', name: 'Users', element: Users },
  { path: '/userForm', name: 'UserForm', element: UserForm },
  { path: '/editUser/:id', name: 'EditUser', element: EditUser },
  { path: '/breakDownRecord/:id', name: 'breakdownrecord', element: BreakDownRecord },
  { path: '/assetRecord/:id', name: 'assetRecord', element: AssetRecord },
  { path: '/taskRecord/:id', name: 'taskRecord', element: TaskRecord },
  { path: '/pmSchedule', name: 'pmSchedule', element: PMSchedule },
  { path: '/editPM/:id', name: 'editPM', element: EditPM },
  { path: '/tbm', name: 'tbm', element: TBM },
  { path: '/edittbm/:id', name: 'edittbm', element: TBMEdit },
  { path: '/pm', name: 'pm', element: PM },
  { path: '/cbm', name: 'cbm', element: CBM },
  { path: '/editcbm/:id', name: 'editcbm', element: CBMEdit },
  { path: '/cbmForm', name: 'CBMForm', element: CBMForm },
  { path: '/tbmForm', name: 'TBMForm', element: TBMForm },
  { path: '/registeruser', name: 'registerUser', element: registerUser },
  { path: '/editRegisterUser/:id', name: 'editregisteruser', element: editregisteruser },
  { path: '/adminproduction', name: 'AdminProduction', element: AdminProduction },
  { path: '/adminbreakdown', name: 'AdminBreakdown', element: AdminBreakdown },
  { path: '/adminbdhistory', name: 'AdminBDHistory', element: AdminBDHistory },
]

export default routes
