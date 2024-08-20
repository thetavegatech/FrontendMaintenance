import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
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
import { CiMenuKebab } from 'react-icons/ci'
import { MdOutlinePendingActions } from 'react-icons/md'
import { BsFillCassetteFill } from 'react-icons/bs'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { MdDashboard } from 'react-icons/md'

const WidgetsDropdown = () => {
  const navigate = useNavigate()
  const [breakdownType, setbreakdownType] = useState([])
  const [formattedChartData, setFormattedChartData] = useState([])
  const [assets, setAssets] = useState([])
  const [totalTasks, setTotalTasks] = useState(0)
  const [breakdowns, setBreakdown] = useState([])
  const [totalBreakdown, setTotalBreakdown] = useState(0)
  const [pendingTaskCount, setPendingTaskCount] = useState(0)
  const [completdTasksCount, setCompletedTasksCount] = useState(0)
  const [todaysTaskCount, setTodaysTaskCount] = useState(0)
  // const [completedTasksCount, setCompletedTasksCount] = useState(0)
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
    fetch('http://localhost:4000/api/breakdown')
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
      const dataReq = await fetch('http://localhost:4000/api/breakdown')
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
    fetch('http://localhost:4000/api/breakdown')
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
        const response = await fetch('http://localhost:4000/api/pm')
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
    // Formulate a simple message
    // const message = encodeURIComponent(
    //   'Breakdown For ' +
    //     pendingTaskCount +
    //     ' please visit concerned department Details are ' +
    //     pendingTaskCount +
    //     ' - Aurangabad Auto Ancillary',
    // )
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
    fetch(`http://localhost:4000/api/pm?nextDate=${formattedToday}`)
      .then((response) => response.json())
      .then((fetchedTasks) => {
        setTodaysTaskCount(fetchedTasks.length)
      })
      .catch((error) => console.error("Error fetching today's tasks: ", error))
    console.log(todaysTaskCount, todaysScheduledAssets, todaysScheduledAssetsnok.length)
  }, [])

  useEffect(() => {
    fetch('http://localhost:4000/api/assets')
      .then((response) => response.json())
      .then((fetchedTasks) => {
        setAssets(fetchedTasks)
        setTotalTasks(fetchedTasks.length)
      })
  }, [])

  return (
    <CRow>
      <div className="container-fluid w-100">
        <div className="row mx-auto flex-column flex-sm-row justify-content-center w-100 dashboard-row">
          {/* Total Breakdown */}
          <div
            className="card shadow-sm mx-auto dashboard-card"
            style={{
              backgroundColor: '#16aaf6',
              borderTopLeftRadius: '20px',
              borderBottomRightRadius: '20px',
              borderTopRightRadius: '0px',
              borderBottomLeftRadius: '0px',
            }}
          >
            <Link to="/temperature" className="card-link"></Link>
            <div className="card-content" style={{ marginTop: '5px', width: '14rem' }}>
              <div className="icon-container" style={{ backgroundColor: '#ffffff' }}>
                <MdDashboard
                  className="icon"
                  style={{
                    width: '30px',
                    height: '30px',
                    fill: '#16aaf6',
                    marginTop: '1px',
                    marginLeft: '3px',
                  }}
                />
              </div>
              <div className="text-container">
                <div className="label">
                  <span>TotalBreakdown</span>
                </div>
                <h3 className="count">{totalBreakdown}</h3>
              </div>
            </div>
            {/* <hr className="divider" /> */}
            <div className="button-container">
              <button className="more-button" style={{ Color: 'white' }}>
                <NavLink to="/adminbreakdown" className="nav-link">
                  View more
                </NavLink>
              </button>
            </div>
          </div>

          {/* All Assets */}
          <div
            className="card shadow-sm mx-auto dashboard-card"
            style={{
              backgroundColor: '#ab1dfd',
              borderTopLeftRadius: '20px',
              borderBottomRightRadius: '20px',
              borderTopRightRadius: '0px',
              borderBottomLeftRadius: '0px',
            }}
          >
            <Link to="/temperature" className="card-link"></Link>
            <div className="card-content" style={{ marginTop: '5px', width: '15rem' }}>
              <div className="icon-container" style={{ backgroundColor: '#ffffff' }}>
                <BsFillCassetteFill
                  className="icon"
                  style={{
                    width: '30px',
                    height: '35px',
                    fill: '#ab1dfd',
                    marginTop: '1px',
                    marginLeft: '3px',
                  }}
                />
              </div>
              <div className="text-container">
                <div className="label">
                  <span>All Assets</span>
                </div>
                <h3 className="count">{totalTasks}</h3>
              </div>
            </div>
            {/* <hr className="divider" /> */}
            <div className="button-container">
              <button className="more-button" style={{ Color: 'white' }}>
                <NavLink to="/assetTable" className="nav-link">
                  View more
                </NavLink>
              </button>
            </div>
          </div>

          {/* Pending Task */}
          <div
            className="card shadow-sm mx-auto dashboard-card"
            style={{
              backgroundColor: '#fd6608',
              borderTopLeftRadius: '20px',
              borderBottomRightRadius: '20px',
              borderTopRightRadius: '0px',
              borderBottomLeftRadius: '0px',
            }}
          >
            <Link to="/currentvfd" className="card-link"></Link>
            <div className="card-content" style={{ marginTop: '5px', width: '15rem' }}>
              <div className="icon-container" style={{ backgroundColor: '#ffffff' }}>
                <MdOutlinePendingActions
                  className="icon"
                  style={{
                    width: '30px',
                    height: '30px',
                    fill: '#fd6608',
                    marginTop: '1px',
                    marginLeft: '3px',
                  }}
                />
              </div>
              <div className="text-container">
                <div className="label">
                  <span>Pending Task</span>
                </div>
                <h3 className="count">{pendingTaskCount}</h3>
              </div>
            </div>
            {/* <hr className="divider" /> */}
            <div className="button-container">
              <button className="more-button">
                <NavLink to="/pmSchedule" className="nav-link">
                  View more
                </NavLink>
              </button>
            </div>
          </div>

          {/* Completed Task */}
          <div
            className="card shadow-sm mx-auto dashboard-card"
            style={{
              borderTopLeftRadius: '20px',
              borderBottomRightRadius: '20px',
              borderTopRightRadius: '0px',
              borderBottomLeftRadius: '0px',
              backgroundColor: 'rgb(8, 185, 99)',
            }}
          >
            <Link to="/voltagevfd" className="card-link"></Link>
            <div className="card-content" style={{ marginTop: '5px', width: '15rem' }}>
              <div
                className="icon-container"
                style={{ backgroundColor: '#ffffff', marginTop: '2px' }}
              >
                <BsFillCheckCircleFill
                  className="icon"
                  style={{
                    width: '30px',
                    height: '30px',
                    fill: 'rgb(8, 185, 99)',
                    marginTop: '1px',
                    marginLeft: '3px',
                  }}
                />
              </div>
              <div className="text-container">
                <div className="label">
                  <span>Completed Task</span>
                </div>
                <h3 className="count">{completdTasksCount}</h3>
              </div>
            </div>
            {/* <hr className="divider" /> */}
            <div className="button-container">
              <button className="more-button" style={{ color: 'white' }}>
                <NavLink to="/pmSchedule" className="nav-link">
                  View more
                </NavLink>
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .dashboard-row {
          margin-top: 2rem;
          position: relative;
        }
        .dashboard-card {
          border-radius: 8px;
          padding: 10px;
          width: 250px;
          background-color: #16aaf6;
          margin: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 7rem;
          position: relative;
        }
        .card-link {
          position: absolute;
          top: 5px;
          right: 10px;
        }
        .card-content {
          display: flex;
          align-items: center;
          height: 50%;
          padding: 10px;
          top: 10px;
        }
        .icon-container {
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          width: 40%;
          border-radius: 7px;
          height: 5rem;
          margin-bottom: 40px;
          margin-left: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .text-container {
          text-align: left;
          margin-left: 10px;
          width: 70%;
          margin-top: 25px;
        }
        .label {
          text-align: left;
          margin-left: 8px;
          width: 90%;
          margin-top: 30px;
          display: flex;
        }
        .label span {
          color: white;
          margin-top: 2rem;
          margin-left: 2px;
          font-size: 0.9rem;
        }
        .count {
          color: #ffffff;
          margin-top: 0;
          margin-bottom: 5.5rem;
          margin-left: 80px;
        }
        .divider {
          width: 100%;
          border: 0.2px solid gray;
          margin: 0px 0;
        }
        .button-container {
          text-align: start;
        }
        .more-button {
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 0;
          margin: 0;
        }

        @media (max-width: 576px) {
          .dashboard-row {
            flex-direction: column !important;
          }
          .dashboard-card {
            width: 90% !important;
            height: 135px !important;
          }
        }
        @media (min-width: 576px) and (max-width: 768px) {
          .dashboard-card {
            width: 45% !important;
          }
        }
        @media (min-width: 768px) and (max-width: 992px) {
          .dashboard-card {
            width: 30% !important;
          }
        }
      `}</style>
    </CRow>
  )
}

export default WidgetsDropdown
