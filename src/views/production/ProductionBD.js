import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
// import './Breakdown.css'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { CButton } from '@coreui/react'
import { cilPlus } from '@coreui/icons'

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
  const [whyWhyAnalysisList, setWhyWhyAnalysisList] = useState([])
  const [formData, setFormData] = useState({})
  //   let status = 'pending'
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://backendmaintenx.onrender.com/api/breakdown/${id}`)
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
    const fieldData = whyWhyAnalysisList.join(',')
    setFormData({ WhyWhyAnalysis: fieldData })

    // Append other data to the FormData object
    formData.append('MachineName', MachineName)
    formData.append('BreakdownStartDate', BreakdownStartDate)
    formData.append('attachment', attachment)
    // ... (append other data)
    axios
      .put(`https://backendmaintenx.onrender.com/api/breakdown/${id}`, {
        MachineName,
        BreakdownStartDate,
        BreakdownEndDate,
        BreakdownStartTime,
        BreakdownEndTime,
        Shift,
        LineName,
        Operations,
        BreakdownPhenomenons,
        BreakdownType,
        DetectOCC,
        // BreakdownTime,
        ActionTaken,
        // WhyWhyAnalysis,
        // WhyWhyAnalysis,
        WhyWhyAnalysis: fieldData,
        whyWhyAnalysisList: fieldData,
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
        setWhyWhyAnalysis([])
        setWhyWhyAnalysisList([])
        // setWhyWhyAnalysisList()
        console.log('Form submitted!')
        console.log('whyWhyAnalysisList:', whyWhyAnalysisList)
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
  console.log(whyWhyAnalysisList)

  return (
    <>
      <div>
        <div
          className="container"
          style={{
            border: '2px solid #ccc',
            backgroundColor: '',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '95%',
          }}
        >
          {successMessage && (
            <div className="alert alert-success" role="alert" style={{ marginTop: '10px' }}>
              {successMessage}
            </div>
          )}
          <form method="post" onSubmit={Update}>
            {/* Add Breakdown Detail Fields */}
            {/* <h3>Add Breakdown Detail</h3> */}
            <div className="row g-2">
              <div className="col-md-6">
                <label htmlFor="machineName">Machine Name:</label>
                <input
                  type="text"
                  className="form-control col-sm-6"
                  name="MachineName"
                  value={MachineName}
                  disabled // This makes the input read-only
                  onChange={(e) => setMachineName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="breakdownStartDate">Breakdown Start Date:</label>
                <input
                  type="date"
                  className="form-control col-sm-6"
                  name="BreakdownDate"
                  value={BreakdownStartDate}
                  disabled
                  onChange={(e) => setBreakdownStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  className="form-control col-sm-6"
                  name="Location"
                  value={Location}
                  disabled
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="shift">Shift:</label>
                <input
                  type="text"
                  className="form-control col-sm-6"
                  name="Shift"
                  value={Shift}
                  disabled
                  onChange={(e) => setShift(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lineName">Line Name:</label>
                <input
                  type="text"
                  name="LineName"
                  className="form-control col-sm-6"
                  value={LineName}
                  disabled
                  onChange={(e) => setLineName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="operations">Operations:</label>
                <input
                  type="text"
                  className="form-control col-sm-6"
                  name="Operations"
                  value={Operations}
                  disabled
                  onChange={(e) => setOperations(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="breakdownPhenomen">Breakdown Phenomenon:</label>
                <input
                  type="text"
                  name="BreakdownPhenomenons"
                  className="form-control col-sm-6"
                  value={BreakdownPhenomenons}
                  disabled
                  onChange={(e) => setBreakdownPhenomenons(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="breakdownStartTime">Breakdown Start Time:</label>
                <input
                  type="text"
                  disabled
                  className="form-control col-sm-6"
                  name="BreakdownTime"
                  value={BreakdownStartTime}
                  onChange={(e) => setBreakdownStartTime(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="breakdownType">Breakdown Type:</label>

                <select
                  className="form-control col-sm-6"
                  required
                  id="BreakdownType"
                  name="BreakdownType"
                  value={BreakdownType}
                  onChange={(e) => setBreakdownType(e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Hydrolic">Hydrolic</option>
                  <option value="Neumatic">Neumatic</option>
                  <option value="Production Setting">Production Setting</option>
                </select>
              </div>
              {/* <div className="col-md-6">
                <label htmlFor="spareparts">Spare Parts:</label>
                <input
                  type="text"
                  required
                  name="SpareParts"
                  className="form-control col-sm-6"
                  value={SpareParts}
                  onChange={(e) => setSpareParts(e.target.value)}
                />
              </div> */}
              {/* <div className="col-md-5">
                <label htmlFor="whyWhy">Why-Why Analysis:</label>
                <input
                  type="text"
                  // required
                  className="form-control col-sm-5"
                  name="WhyWhyAnalysis"
                  // value={WhyWhyAnalysis}
                  value={WhyWhyAnalysis}
                  onChange={handleInputChange}
                  // onChange={(e) => setWhyWhyAnalysis(e.target.value)}
                />
                <button type="button" onClick={handleButtonClick}>
                  Add Input
                </button>
              </div>
              <div>
                <h6>Content:</h6>
                <ul>
                  {whyWhyAnalysisList &&
                    whyWhyAnalysisList.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div> */}
              {/* <button type="button" onClick={handleButtonClick}>
                Add Input
              </button> */}

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="col-md-5" style={{ marginRight: '10px' }}>
                  <label htmlFor="whyWhy">Why-Why Analysis:</label>
                  <textarea
                    style={{ display: '' }}
                    type="text"
                    className="form-control col-sm-5"
                    name="WhyWhyAnalysis"
                    value={WhyWhyAnalysis}
                    onChange={handleInputChange}
                  />
                </div>
                <div
                  style={{
                    display: '',
                    marginRight: '15px',
                    // alignItems: 'center',
                    marginTop: '10px',
                  }}
                >
                  <CButton>
                    <CIcon icon={cilPlus} className="ml-2" onClick={handleButtonClick} />
                  </CButton>
                </div>
                {/* </div> */}
                <div style={{ display: '' }}>
                  <h6>Add:</h6>
                  <ul>
                    {whyWhyAnalysisList.map((item, index) => (
                      <li key={index}>{`WhyWhy${index + 1}: ${item}`}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* <div className="col-md-6">
                <label htmlFor="cost">Cost:</label>
                <input
                  type="number"
                  required
                  name="Cost"
                  className="form-control col-sm-6"
                  value={Cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div> */}
              <div className="col-md-6">
                <label htmlFor="rootCause">Root Cause:</label>
                <input
                  type="text"
                  required
                  className="form-control col-sm-6"
                  name="RootCause"
                  value={RootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                />
              </div>
              {/* <div className="col-md-6">
                <label htmlFor="PreventiveAction">Preventive Action:</label>
                <input
                  type="text"
                  required
                  className="form-control col-sm-6"
                  name="PreventiveAction"
                  value={PreventiveAction}
                  onChange={(e) => setPreventiveAction(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="correctiveAction">Corrective Action:</label>
                <input
                  type="text"
                  required
                  className="form-control col-sm-6"
                  name="CorrectiveAction"
                  value={CorrectiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                />
              </div> */}
              <div className="col-md-6">
                <label htmlFor="targetDate">Target Date:</label>
                <input
                  type="date"
                  required
                  className="form-control col-sm-6"
                  name="TargetDate"
                  value={TargetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="responsibility">Responsibility:</label>
                <input
                  type="text"
                  required
                  className="form-control col-sm-6"
                  name="Responsibility"
                  value={Responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="hd">HD:</label>
                <input
                  type="text"
                  required
                  name="HD"
                  className="form-control col-sm-6"
                  value={HD}
                  onChange={(e) => setHD(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="remark">Remark:</label>
                <input
                  type="text"
                  required
                  className="form-control col-sm-6"
                  name="Remark"
                  value={Remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="BreakdownEndDate">BreakdownEndDate:</label>
                <input
                  type="date"
                  required
                  className="form-control col-sm-6"
                  name="BreakdownEndDate"
                  value={BreakdownEndDate}
                  onChange={(e) => setBreakdownEndDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="BreakdownEndTime">BreakdownEndTime:</label>
                <input
                  type="time"
                  required
                  className="form-control col-sm-6"
                  name="BreakdownEndTime"
                  value={BreakdownEndTime}
                  onChange={(e) => setBreakdownEndTime(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="attachment">Attachment:</label>
                <input
                  type="file"
                  className="form-control col-sm-6"
                  onChange={convertToBse64}
                ></input>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '20%', marginBottom: '10px' }}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
