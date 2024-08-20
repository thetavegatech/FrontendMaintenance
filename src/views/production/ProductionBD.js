import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
// import './Breakdown.css'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { CButton } from '@coreui/react'
import { cilPlus } from '@coreui/icons'
import { MdDashboard } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export default function BreakDown() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [MachineName, setMachineName] = useState('')
  const [BreakdownStartDate, setBreakdownStartDate] = useState('')
  const [BreakdownEndDate, setBreakdownEndDate] = useState('')
  const [BreakdownStartTime, setBreakdownStartTime] = useState('')
  const [BreakdownEndTime, setBreakdownEndTime] = useState('')
  const [Shift, setShift] = useState('') // Default to false
  const [LineName, setLineName] = useState('') // Default to false
  const [Operations, setOperations] = useState('')
  const [BreakdownPhenomenons, setBreakdownPhenomenons] = useState('')
  const [BreakdownType, setBreakdownType] = useState('')
  const [DetectOCC, setOCC] = useState('')
  // const [BreakdownTime, setBreakdownTime] = useState('')
  const [ActionTaken, setActionTaken] = useState('')
  // const [WhyWhyAnalysis, setWhyWhyAnalysis] = useState('')
  const [RootCause, setRootCause] = useState('')
  const [PreventiveAction, setPreventiveAction] = useState('')
  const [CorrectiveAction, setCorrectiveAction] = useState('')
  const [TargetDate, setTargetDate] = useState('')
  const [Responsibility, setResponsibility] = useState('')
  const [HD, setHD] = useState('')
  const [Remark, setRemark] = useState('')
  const [Status, setStatus] = useState('')
  const [Location, setLocation] = useState('')
  const [SpareParts, setSpareParts] = useState('')
  const [Cost, setCost] = useState('')
  const [WhyWhyAnalysis, setWhyWhyAnalysis] = useState('')
  const [whyWhyAnalysisList, setWhyWhyAnalysisList] = useState('')
  const [formData, setFormData] = useState({})
  //   let status = 'pending'
  const [successMessage, setSuccessMessage] = useState('')
  const loggedInUsername = useSelector((state) => state.auth.userInfo?.name)
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/breakdown/${id}`)
      console.log(response)
      setMachineName(response.data.MachineName)
      setBreakdownStartDate(response.data.BreakdownStartDate)
      setBreakdownStartTime(response.data.BreakdownStartTime)
      setBreakdownEndDate(response.data.BreakdownEndDate)
      setBreakdownEndTime(response.data.BreakdownEndTime)
      setShift(response.data.Shift)
      setLineName(response.data.LineName)
      setOperations(response.data.Operations)
      setBreakdownPhenomenons(response.data.BreakdownPhenomenons)
      setStatus(response.data.Status)
      setLocation(response.data.Location)
      setSpareParts(response.data.SpareParts)
      setCost(response.data.Cost)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const [Image, setImage] = useState('')
  //   let status = 'pending'

  function convertToBse64(e) {
    console.log(e)
    let reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
      console.log(reader.result) // base64encoded string
      setImage(reader.result)
    }
    reader.onerror = (err) => {
      console.log(err)
    }
  }

  const [dataArray, setDataArray] = useState([])

  const handleInputChange = (e) => {
    setWhyWhyAnalysis(e.target.value)
  }

  const handleButtonClick = () => {
    setWhyWhyAnalysisList([...whyWhyAnalysisList, WhyWhyAnalysis])
    setWhyWhyAnalysis('') // Clear the input field after adding to the array
  }
  // const handleButtonClick = () => {
  //   if (WhyWhyAnalysis.trim() !== '') {
  //     setWhyWhyAnalysisList([...whyWhyAnalysisList, WhyWhyAnalysis])
  //     setWhyWhyAnalysis('') // Clear the input field after adding to the list
  //   }
  // }

  const Update = (e) => {
    e.preventDefault()

    // Create a FormData object to append the file data
    const formData = new FormData()
    formData.append('attachment', attachment)

    // Combine input values into a single field in the form data
    // const fieldData = whyWhyAnalysisList.join(',')
    // setFormData({ WhyWhyAnalysis: fieldData })

    // Append other data to the FormData object
    formData.append('MachineName', MachineName)
    formData.append('BreakdownStartDate', BreakdownStartDate)
    formData.append('attachment', attachment)
    // ... (append other data)
    axios
      .put(`http://localhost:4000/api/breakdown/${id}`, {
        MachineName,
        BreakdownStartDate,
        BreakdownEndDate: new Date().toISOString().split('T')[0],
        BreakdownStartTime,
        BreakdownEndTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        Shift,
        LineName,
        Operations,
        BreakdownPhenomenons,
        BreakdownType,
        DetectOCC,
        // BreakdownTime,
        ActionTaken,
        // WhyWhyAnalysis,
        WhyWhyAnalysis,
        // WhyWhyAnalysis: fieldData,
        // whyWhyAnalysisList: fieldData,
        RootCause,
        PreventiveAction,
        CorrectiveAction,
        TargetDate,
        Responsibility,
        HD,
        Remark,
        Status: 'pending',
        attachment,
        Location,
        Image,
        SpareParts,
        Cost,
        whyWhyAnalysisList,
        AttendedBy: loggedInUsername,
      })
      .then((result) => {
        setSuccessMessage('Form submitted successfully!')
        console.log(formData)
        setMachineName('')
        setBreakdownStartDate('')
        setBreakdownEndDate('')
        setBreakdownStartTime('')
        setBreakdownEndTime('')
        setShift('')
        setLineName('')
        setOperations('')
        setBreakdownPhenomenons('')
        setStatus('pending')
        setLocation('')
        setImage('')
        setPreventiveAction('')
        setCorrectiveAction('')
        setCost('')
        setSpareParts('')
        setWhyWhyAnalysis('')
        setWhyWhyAnalysisList('')
        // setWhyWhyAnalysisList()
        console.log('Form submitted!')
        console.log('WhyWhyAnalysis:', WhyWhyAnalysis)
        // setAttachment('')

        // Assuming you have a navigate function or useHistory from react-router-dom
        // Navigate back to the previous page
        setSuccessMessage('Form submitted successfully!')
        setTimeout(() => {
          setSuccessMessage('')
          // Assuming you have a navigate function or useHistory from react-router-dom
          // Navigate back to the previous page
          navigate(-1)
        }, 5000)
      })
      .catch((err) => console.log(err))
  }

  const [attachment, setAttachment] = useState(null)
  console.log(WhyWhyAnalysis)

  return (
    <div className="card shadow-sm mx-auto" style={{ marginTop: '0.5rem' }}>
      <Link
        to="/temperature"
        style={{ position: 'absolute', top: '10px', right: '10px', overflow: 'hidden' }}
      >
        {/* Content inside Link */}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div className="box d-flex justify-content-center align-items-center">
          <MdDashboard
            className="icon"
            style={{
              width: '30px',
              height: '30px',
              fill: 'white',
              marginTop: '1px',
              marginLeft: '3px',
            }}
          />
        </div>
      </div>

      <div className="table-container">
        <form onSubmit={Update} style={{ marginBottom: '5rem', marginTop: '0px' }}>
          <div className="form-row1" style={{ marginLeft: '25px' }}>
            {/* First Row */}
            <div
              className="form-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="MachineName">Machine Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="MachineName"
                  name="MachineName"
                  value={MachineName}
                  disabled // This makes the input read-only
                  onChange={(e) => setMachineName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownStartDate">Breakdown Start Date:</label>
                <input
                  // type="date"
                  className="form-control"
                  id="BreakdownStartDate"
                  name="BreakdownStartDate"
                  value={BreakdownStartDate}
                  disabled
                  onChange={(e) => setBreakdownStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Location">Location:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Location"
                  name="Location"
                  value={Location}
                  disabled
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                {/* <select
                  className="form-control"
                  required
                  // disabled
                  id="Location"
                  name="Location"
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option value="Plant 1">Plant 1</option>
                  <option value="Plant 2">Plant 2</option>
                  <option value="Plant 3">Plant 3</option>
                  <option value="Plant 4">Plant 4</option>
                </select> */}
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Shift">Shift:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Shift"
                  name="Shift"
                  value={Shift}
                  disabled
                  onChange={(e) => setShift(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="LineName">Line Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="LineName"
                  name="LineName"
                  value={LineName}
                  disabled
                  onChange={(e) => setLineName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Second Row */}
            <div
              className="form-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Operations">Operations:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Operations"
                  name="Operations"
                  value={Operations}
                  disabled
                  onChange={(e) => setOperations(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownStartTime">Breakdown Start Time:</label>
                <input
                  type="time"
                  disabled
                  className="form-control"
                  id="BreakdownStartTime"
                  name="BreakdownStartTime"
                  value={BreakdownStartTime}
                  onChange={(e) => setBreakdownStartTime(e.target.value)}
                  required
                />
              </div>
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownEndTime">Breakdown End Time:</label>
                <input
                  type="time"
                  disabled
                  className="form-control"
                  id="BreakdownEndTime"
                  name="BreakdownEndTime"
                  value={BreakdownEndTime}
                  onChange={(e) => setBreakdownEndTime(e.target.value)}
                  required
                />
              </div> */}
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownEndDate">Breakdown End Date:</label>
                <input
                  type="date"
                  disabled
                  className="form-control"
                  id="BreakdownEndDate"
                  name="BreakdownEndDate"
                  value={BreakdownEndDate}
                  onChange={(e) => setBreakdownEndDate(e.target.value)}
                  required
                />
              </div> */}
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownPhenomenons">Breakdown Phenomenon:</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  id="BreakdownPhenomenons"
                  name="BreakdownPhenomenons"
                  value={BreakdownPhenomenons}
                  onChange={(e) => setBreakdownPhenomenons(e.target.value)}
                  required
                />
              </div>
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownType">Breakdown Type:</label>
                <select
                  className="form-control"
                  id="BreakdownType"
                  name="BreakdownType"
                  value={BreakdownType}
                  onChange={(e) => setBreakdownType(e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Hydraulic">Hydraulic</option>
                  <option value="Pneumatic">Pneumatic</option>
                  <option value="Production Setting">Production Setting</option>
                </select>
              </div> */}
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="RootCause">Root Cause:</label>
                <input
                  type="text"
                  className="form-control"
                  id="RootCause"
                  name="RootCause"
                  value={RootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownType">Breakdown Type:</label>
                <select
                  className="form-control"
                  id="BreakdownType"
                  name="BreakdownType"
                  value={BreakdownType}
                  onChange={(e) => setBreakdownType(e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Hydraulic">Hydraulic</option>
                  <option value="Pneumatic">Pneumatic</option>
                  <option value="Production Setting">Production Setting</option>
                </select>
              </div>
            </div>

            {/* Fourth Row */}
            <div
              className="form-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="RootCause">Root Cause:</label>
                <input
                  type="textarea"
                  className="form-control"
                  id="RootCause"
                  name="RootCause"
                  value={RootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  required
                />
              </div> */}
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownType">Breakdown Type:</label>
                <select
                  className="form-control"
                  id="BreakdownType"
                  name="BreakdownType"
                  value={BreakdownType}
                  onChange={(e) => setBreakdownType(e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Hydraulic">Hydraulic</option>
                  <option value="Pneumatic">Pneumatic</option>
                  <option value="Production Setting">Production Setting</option>
                </select>
              </div> */}
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="BreakdownPhenomenons">Breakdown Phenomenon:</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  id="BreakdownPhenomenons"
                  name="BreakdownPhenomenons"
                  value={BreakdownPhenomenons}
                  onChange={(e) => setBreakdownPhenomenons(e.target.value)}
                  required
                />
              </div> */}
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="WhyWhyAnalysis">Why-Why Analysis:</label>
                <input
                  type="textarea"
                  className="form-control"
                  id="WhyWhyAnalysis"
                  name="WhyWhyAnalysis"
                  value={WhyWhyAnalysis}
                  onChange={(e) => setWhyWhyAnalysis(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="PreventiveAction">Preventive Action:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  name="PreventiveAction"
                  value={PreventiveAction}
                  onChange={(e) => setPreventiveAction(e.target.value)}
                />
              </div>
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="TargetDate">Target Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="TargetDate"
                  name="TargetDate"
                  value={formData.TargetDate}
                  onChange={handleChange}
                  required
                />
              </div> */}
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Responsibility">Responsibility:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Responsibility"
                  name="Responsibility"
                  value={Responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="correctiveAction">Corrective Action:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  name="CorrectiveAction"
                  value={CorrectiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                />
              </div>
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="HD">HD:</label>
                <input
                  type="text"
                  className="form-control"
                  id="HD"
                  name="HD"
                  value={formData.HD}
                  onChange={handleChange}
                  required
                />
              </div> */}
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Remark">Remark:</label>
                <input
                  type="textarea"
                  className="form-control"
                  id="Remark"
                  name="Remark"
                  value={Remark}
                  onChange={(e) => setRemark(e.target.value)}
                  required
                />
              </div>
            </div>
            <div
              className="form-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="PreventiveAction">Preventive Action:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  name="PreventiveAction"
                  value={PreventiveAction}
                  onChange={(e) => setPreventiveAction(e.target.value)}
                />
              </div> */}
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="spareparts">Spare Parts:</label>
                <input
                  type="text"
                  required
                  name="SpareParts"
                  className="form-control col-md-2"
                  value={SpareParts}
                  onChange={(e) => setSpareParts(e.target.value)}
                />
              </div>
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="correctiveAction">Corrective Action:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  name="CorrectiveAction"
                  value={CorrectiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                />
              </div> */}
              {/* <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="spareparts">Spare Parts:</label>
                <input
                  type="text"
                  required
                  name="SpareParts"
                  className="form-control"
                  value={SpareParts}
                  onChange={(e) => setSpareParts(e.target.value)}
                />
              </div> */}
            </div>
            {/* Sixth Row */}
            <div
              className="form-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  float: 'left',
                  backgroundColor: '#1237F7',
                  marginTop: '10px',
                  alignItems: 'start',
                  marginRight: '60rem',
                }}
              >
                Save
              </button>
            </div>

            {/* Submit Button */}
            {/* <div className="form-group d-flex justify-content-center" style={{ marginTop: '3rem' }}>

            </div> */}
          </div>
        </form>
        {/* <ToastContainer /> */}
      </div>
    </div>
  )
}
