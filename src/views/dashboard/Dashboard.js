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

import {
  BarChart,
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
      {/* <CRow>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>BreakDown Type Wise Chart</CCardHeader>
            <CCardBody>
              <BarChart
                width={window.innerWidth >= 992 ? 500 : 300}
                height={300}
                data={formattedChartData}
                margin={{
                  // top: 5,
                  right: 20,
                  // left: 5,
                }}
              >
                <XAxis dataKey="breakdownType" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  // name="My First dataset" // Add the label here
                  backgroundColor="rgba(255,255,255,.2)" // Add the background color here
                  borderColor="rgba(255,255,255,.55)" // Add the border color here
                />
              </BarChart>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>LineName Wise Chart</CCardHeader>
            <CCardBody>
              <LineChart
                width={window.innerWidth >= 992 ? 500 : 300}
                height={300}
                data={lineChartData}
                margin={{
                  // top: 5,
                  right: 20,
                  // left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="lineName" />
                <YAxis data={lineChartData} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
              </LineChart>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>BreakDown Doughnut Chart</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: formattedChartData.map((item) => item.breakdownType), // Assuming your API response has a 'label' field
                  datasets: [
                    {
                      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                      data: formattedChartData.map((item) => item.value), // Assuming your API response has a 'value' field
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4 p">
            <CCardHeader>Line wise Pie Chart</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: lineChartData.map((item) => item.lineName), // Assuming your API response has a 'LineName' field
                  datasets: [
                    {
                      data: lineChartData.map((item) => item.value), // Assuming your API response has a 'value' field
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Specify the colors
                      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Specify the hover colors
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
    </>
  )
}

export default Dashboard
