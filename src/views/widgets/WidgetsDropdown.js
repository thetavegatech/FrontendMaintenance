import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { useNavigate } from 'react-router-dom'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilOptions,
  cilGraph,
  cilBasket,
  cilClock,
  cilPending,
  cilStorage,
  cilUser,
  cilTask,
  cilCheckCircle,
} from '@coreui/icons'
import { CButton } from '@coreui/react'
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
import { Date } from 'core-js'
import './WidgetsDropdown.css'
import { Icons } from 'react-toastify'
import axios from 'axios'

const WidgetsDropdown = () => {
  const navigate = useNavigate()
  const [breakdownType, setbreakdownType] = useState([])
  const [formattedChartData, setFormattedChartData] = useState([])
  const [assets, setAssets] = useState([])
  const [totalTasks, setTotalTasks] = useState(0)
  const [breakdowns, setBreakdown] = useState([])
  const [totalBreakdown, setTotalBreakdown] = useState(0)
  const [pendingTaskCount, setPendingTaskCount] = useState(0)
  const [completdTasksCount, setcompletdTasksCount] = useState(0)
  const [completedTasksCount, setCompletedTasksCount] = useState(0)
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
    (asset) => asset.nextDate === formattedToday && asset.status === 'pending',
  )

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
    const breakdownType = []
    const getbreakdownRecord = async () => {
      const dataReq = await fetch('https://backendmaintenx.onrender.com/api/breakdown')
      const dataRes = await dataReq.json()
      console.log(dataRes)

      for (let i = 0; i < dataReq.length; i++) {
        breakdownType.push(dataRes[i].BreakdownType)
      }

      setbreakdownType(breakdownType)
    }
    getbreakdownRecord()
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
    const fetchData = async () => {
      try {
        const response = await fetch('https://backendmaintenx.onrender.com/api/pm')
        const fetchedTasks = await response.json()

        setAssets(fetchedTasks)
        setTotalTasks(fetchedTasks.length)

        const pendingTasks = fetchedTasks.filter((asset) => asset.status === 'Pending')
        setPendingTaskCount(pendingTasks.length)

        const completedTasks = fetchedTasks.filter((asset) => asset.status === 'Completed')
        setCompletedTasksCount(completedTasks.length)

        const currentDate = new Date()
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        const isEndOfMonth = currentDate.getDate() === lastDayOfMonth.getDate()

        if (isEndOfMonth && pendingTasks.length > 0) {
          const formData = {}
          sendSMS(formData, numbers)
        }
      } catch (error) {
        console.error('Error fetching tasks: ', error)
      }
    }

    fetchData()
  }, [])

  const [cbms, setCbms] = useState([])
  const [filteredCbms, setFilteredCbms] = useState([])
  const [loading, setLoading] = useState(true)
  const [cbmLength, setCbmLength] = useState(0)

  useEffect(() => {
    axios
      .get('https://backendmaintenx.onrender.com/api/cbm')
      .then((response) => {
        const cbmData = Array.isArray(response.data) ? response.data : [response.data]
        setCbms(cbmData)
        setFilteredCbms(cbmData)
        setCbmLength(cbmData.length) // Set the length of cbmData
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
        setLoading(false)
      })
  }, [])

  const [tbms, setTbms] = useState([])
  const [filteredTbms, setFilteredTbms] = useState([])
  const [tbmLength, setTbmLength] = useState(0) // New state variable for length

  useEffect(() => {
    axios
      .get('https://backendmaintenx.onrender.com/api/tbm')
      .then((response) => {
        const tbmData = Array.isArray(response.data) ? response.data : [response.data]
        setTbms(tbmData)
        setFilteredTbms(tbmData)
        setTbmLength(tbmData.length) // Set the length of tbmData
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
        setLoading(false)
      })
  }, [])

  const [tasks, setTasks] = useState([])
  const [todaysTaskCount, setTodaysTaskCount] = useState(0) // State variable for task count

  useEffect(() => {
    const fetchTodaysTasks = async () => {
      try {
        const response = await axios.get('https://backendmaintenx.onrender.com/api/pm')
        const fetchedTasks = response.data
        const today = new Date().toISOString().split('T')[0]

        const todaysTasks = fetchedTasks.filter(
          (task) => new Date(task.nextDate).toISOString().split('T')[0] === today,
        )

        setTasks(todaysTasks)
        setTodaysTaskCount(todaysTasks.length) // Set the count of today's tasks
        setLoading(false)
      } catch (error) {
        console.error("Error fetching today's tasks:", error)
        setLoading(false)
      }
    }

    fetchTodaysTasks()
  }, [])

  const [formData, setFormData] = useState({
    MachineName: '',
    BreakdownStartDate: '',
    BreakdownEndDate: '',
    BreakdownStartTime: '',
    BreakdownEndTime: '',
    Shift: '',
    LineName: '',
    Operations: '',
    BreakdownPhenomenons: '',
    BreakdownType: '',
    OCC: '',
    BreakdownTime: '',
    ActionTaken: '',
    WhyWhyAnalysis: '',
    RootCause: '',
    PermanentAction: '',
    TargetDate: '',
    Responsibility: '',
    HD: '',
    Remark: '',
    Status: 'open',
  })

  const apiKey = 'NDE1MDY2NGM2Mzc3NTI0ZjQzNmE1YTM5NDY0YzZlNzU='
  const numbers = '7020804148' // Replace with the phone numbers
  const sender = 'AAABRD'

  const sendSMS = (formData, selectedUsers) => {
    const { MachineName, BreakdownStartDate, Shift, LineName, Operations, BreakdownPhenomenons } =
      formData

    const message = encodeURIComponent(
      `Breakdown For ${pendingTaskCount} pending tasks. please visit concerned department Details are ${pendingTaskCount} - Aurangabad Auto Ancillary`,
    )

    // Create the API URL
    const url = `https://api.textlocal.in/send/?apikey=${apiKey}&sender=${sender}&numbers=${numbers}&message=${message}`

    // Use fetch to send the SMS
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log('SMS sent successfully:', data)
        console.log(numbers, message)
      })
      .catch((error) => {
        console.error('Error sending SMS:', error)
        // console.log(selected)
      })
  }

  const handleButtonClick = () => {
    // Call the SMS sending function
    sendSMS(formData, numbers)
  }

  useEffect(() => {
    fetch(`https://backendmaintenx.onrender.com/api/pm?nextDate=${formattedToday}`)
      .then((response) => response.json())
      .then((fetchedTasks) => {
        setTodaysTaskCount(fetchedTasks.length)
      })
      .catch((error) => console.error("Error fetching today's tasks: ", error))
    console.log(todaysTaskCount, todaysScheduledAssets, todaysScheduledAssetsnok.length)
  }, [])

  useEffect(() => {
    fetch('https://backendmaintenx.onrender.com/api/assets')
      .then((response) => response.json())
      .then((fetchedTasks) => {
        setAssets(fetchedTasks)
        setTotalTasks(fetchedTasks.length)
      })
  }, [])

  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <div className="custom-widget primary custom-card">
          <div className="icon">
            <CIcon icon={cilGraph} size="3xl" />
          </div>
          <div className="details">
            <div className="stat-number">{totalBreakdown}</div>
            <div className="stat-label">Total Breakdown</div>
          </div>
          <CDropdown alignment="end" className="options">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} color="black" className="text-high-emphasis-inverse" />
            </CDropdownToggle>
            <CDropdownMenu>
              <NavLink to="/production" className="nav-link">
                <CDropdownItem>View More</CDropdownItem>
              </NavLink>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CCol>
      <CCol sm={6} lg={3}>
        <div className="custom-widget info custom-card">
          <div className="icon">
            <CIcon icon={cilStorage} size="3xl" />
          </div>
          <div className="details">
            <div className="stat-number">{totalTasks}</div>
            <div className="stat-label">All Assets</div>
          </div>
          <CDropdown alignment="end" className="options">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
            </CDropdownToggle>
            <CDropdownMenu>
              <NavLink to="/assetTable" className="nav-link">
                <CDropdownItem>View More</CDropdownItem>
              </NavLink>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CCol>
      <CCol sm={6} lg={3}>
        <div className="custom-widget warning custom-card">
          <div className="icon">
            <CIcon icon={cilTask} size="3xl" />
          </div>
          <div className="details">
            <div className="stat-number">{todaysTaskCount}</div>
            <div className="stat-label">Pending Tasks</div>
          </div>
          <CDropdown alignment="end" className="options">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
            </CDropdownToggle>
            <CDropdownMenu>
              <NavLink to="/pmSchedule" className="nav-link">
                <CDropdownItem>View More</CDropdownItem>
              </NavLink>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CCol>
      <CCol sm={6} lg={3}>
        <div className="custom-widget danger custom-card">
          <div className="icon">
            <CIcon icon={cilCheckCircle} size="3xl" />
          </div>
          <div className="details">
            <div className="stat-number">{completedTasksCount}</div>
            <div className="stat-label">Completed Tasks</div>
          </div>
          <CDropdown alignment="end" className="options">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
            </CDropdownToggle>
            <CDropdownMenu>
              <NavLink to="/pmSchedule" className="nav-link">
                <CDropdownItem>View More</CDropdownItem>
              </NavLink>
            </CDropdownMenu>
          </CDropdown>
        </div>
      </CCol>
      <CCol sm={2} lg={3}>
        <div className="custom-widget1 custom-card">
          {/* <CButton
            color="transparent"
            // className="text-primary" // Adjust class as needed for styling
            // onClick={onClick}
          >
            Calculate MTBF/MTTR */}
          <NavLink to="/adminbdhistory">
            <button className="btn">Calculate MTBF/MTTR</button>
          </NavLink>
          {/* </CButton> */}
        </div>
      </CCol>
      <CCol sm={2} lg={3}>
        <div className="custom-widget2 custom-card">
          <NavLink to="/cbm">
            <button className="btn">CBM {cbmLength}</button>
          </NavLink>
        </div>
      </CCol>
      <CCol sm={2} lg={3}>
        <div className="custom-widget3 custom-card">
          <NavLink to="/tbm">
            <button className="btn">TBM {tbmLength}</button>
          </NavLink>
        </div>
      </CCol>
      <CCol sm={2} lg={3}>
        <div className="custom-widget4 custom-card">
          <NavLink to="/pm">
            <button className="btn">Todays Tasks {todaysTaskCount}</button>
          </NavLink>
        </div>
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
