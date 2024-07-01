import React, { useState, useEffect } from 'react'
// import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
// import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
// import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
// import { BubbleChart, Bubble } from '@recharts-js'

import {
  BarChart,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import BreakDown from './../production/ProductionBD'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const Dashboard = () => {
  const location = useLocation()
  const { username, userRoll } = location.state || {}
  const [user, setUser] = useState({ username: '', userRoll: '' })
  const [breakdownType, setbreakdownType] = useState([])

  const [formattedChartData, setFormattedChartData] = useState([])

  const [lineChartData, setLineChartData] = useState([])
  const [lineChartLabels, setLineChartLabels] = useState([])

  const [assets, setAssets] = useState([])
  const [totalTasks, setTotalTasks] = useState(0)

  const [breakdowns, setBreakdown] = useState([])
  const [totalBreakdown, setTotalBreakdown] = useState(0)

  const [todaysTaskCount, setTodaysTaskCount] = useState(0)
  const today = new Date()
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(today.getDate()).padStart(2, '0')}`
  const todaysScheduledAssets = assets.filter((asset) => asset.nextDate === formattedToday)
  const todaysScheduledAssetsok = assets.filter(
    (asset) => asset.nextDate === formattedToday && asset.status === 'Completed',
  )
  const todaysScheduledAssetsnok = assets.filter(
    (asset) => asset.nextDate === formattedToday && asset.status === 'Pending',
  )

  const aggregateDataByLineName = (data) => {
    return data.reduce((acc, curr) => {
      if (!acc[curr.LineName]) {
        acc[curr.LineName] = 1
      } else {
        acc[curr.LineName]++
      }
      return acc
    }, {})
  }

  const convertToLineChartData = (aggregatedData) => {
    return Object.entries(aggregatedData).map(([key, value]) => ({
      lineName: key,
      value: value,
    }))
  }

  const convertToLineChartLabels = (aggregatedData) => {
    return Object.keys(aggregatedData)
  }

  // useEffect(() => {
  //   // Make an API request to fetch user information
  //   axios
  //     .get('https://mms-backend-n2zv.onrender.com/getAlluser') // Replace with your API endpoint
  //     .then((response) => {
  //       const userData = response.data
  //       setUser({
  //         username: userData.username,
  //         userRoll: userData.userRoll,
  //       })
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching user info:', error)
  //     })
  // }, [])

  useEffect(() => {
    fetch('https://backendmaintenx.onrender.com/api/breakdown')
      .then((response) => response.json())
      .then((fetchedBreakdowns) => {
        const aggregatedByLineName = aggregateDataByLineName(fetchedBreakdowns)
        const lineChartData = convertToLineChartData(aggregatedByLineName)
        const lineChartLabels = convertToLineChartLabels(aggregatedByLineName)
        setLineChartData(lineChartData)
        setLineChartLabels(lineChartLabels)
      })
      .catch((error) => console.error('Error fetching breakdowns: ', error))
  }, [])

  const aggregateData = (data) => {
    return data.reduce((acc, curr) => {
      if (!acc[curr.BreakdownType]) {
        acc[curr.BreakdownType] = 1
      } else {
        acc[curr.BreakdownType]++
      }
      return acc
    }, {})
  }

  const convertToChartData = (aggregatedData) => {
    return Object.entries(aggregatedData).map(([key, value]) => ({
      breakdownType: key,
      value: value,
    }))
  }

  const scatterChartData = [
    { x: 10, y: 30, z: 200 },
    { x: 20, y: 20, z: 300 },
    { x: 30, y: 40, z: 250 },
    { x: 40, y: 50, z: 400 },
  ]

  const bubbleChartData = [
    { name: 'A', x: 30, y: 20, z: 200 },
    { name: 'B', x: 50, y: 30, z: 300 },
    { name: 'C', x: 70, y: 40, z: 400 },
    { name: 'D', x: 90, y: 50, z: 500 },
  ]

  useEffect(() => {
    fetch('https://backendmaintenx.onrender.com/api/breakdown')
      .then((response) => response.json())
      .then((fetchedBreakdowns) => {
        const aggregated = aggregateData(fetchedBreakdowns)
        const chartData = convertToChartData(aggregated)
        setFormattedChartData(chartData)
      })
      .catch((error) => console.error('Error fetching breakdowns: ', error))
  }, [])

  useEffect(() => {
    fetch('https://backendmaintenx.onrender.com/api/breakdown')
      .then((response) => response.json())
      .then((fetchedBreakdowns) => {
        setBreakdown(fetchedBreakdowns, breakdowns)
        setTotalBreakdown(fetchedBreakdowns.length) // Compute total number of tasks
      })
      .catch((error) => console.error('Error fetching tasks: ', error))
  }, [])

  useEffect(() => {
    fetch('https://backendmaintenx.onrender.com/api/pm')
      .then((response) => response.json())

      .then((fetchedTasks) => {
        setAssets(fetchedTasks)
        setTotalTasks(fetchedTasks.length) // Compute total number of tasks
      })
      .catch((error) => console.error('Error fetching tasks: ', error))
  }, [])

  useEffect(() => {
    fetch(`https://backendmaintenx.onrender.com/api/pm?nextDate=${formattedToday}`)
      .then((response) => response.json())
      .then((fetchedTasks) => {
        setTodaysTaskCount(fetchedTasks.length)
      })
      .catch((error) => console.error("Error fetching today's tasks: ", error))
    console.log(todaysTaskCount, todaysScheduledAssets)
  }, [])
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  return (
    <>
      <div style={{ marginLeft: '70%' }}></div>
      <WidgetsDropdown />
      <CCard className="mb-4"></CCard>
      <CRow>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>BreakDown Type Wise Chart</CCardHeader>
            <CCardBody>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart width={window.innerWidth >= 992 ? 500 : 300} height={300}>
                  <CartesianGrid />
                  <XAxis dataKey="breakdownType" />
                  <YAxis dataKey="value" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter
                    name="Breakdown Typewise"
                    data={formattedChartData}
                    fill="#000026"
                    backgroundColor="rgba(255,255,255,.2)"
                    borderColor="rgba(255,255,255,.55)"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>Area Chart</CCardHeader>
            <CCardBody>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="lineName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="#E0E0E4" fill="#66667C" />
                </AreaChart>
              </ResponsiveContainer>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>Polar Area Chart</CCardHeader>
            <CCardBody>
              <CChartPolarArea
                data={{
                  labels: formattedChartData.map((item) => item.breakdownType),
                  datasets: [
                    {
                      data: formattedChartData.map((item) => item.value),
                      backgroundColor: ['#ff7d98', '#4cacee', '#ffff00'],
                      hoverBackgroundColor: ['#ff315b', '#137bc1', '#fff04d'],
                      label: 'My dataset', // for legend
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>BreakDown Doughnut Chart</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: lineChartData.map((item) => item.lineName),
                  datasets: [
                    {
                      backgroundColor: ['#ff7d98', '#4cacee', '#ffff00'],
                      hoverBackgroundColor: ['#ff315b', '#137bc1', '#FFCE56'],
                      data: formattedChartData.map((item) => item.value),
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
