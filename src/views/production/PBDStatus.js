import React, { useEffect, useState } from 'react'
// import './Breakdown.css'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'

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
  const [DetectOCC, setDetectOCC] = useState('')
  const [BreakdownTime, setBreakdownTime] = useState('')
  const [ActionTaken, setActionTaken] = useState('')
  const [WhyWhyAnalysis, setWhyWhyAnalysis] = useState('')
  const [RootCause, setRootCause] = useState('')
  const [PreventiveAction, setPreventiveAction] = useState('')
  const [CorrectiveAction, setCorrectiveAction] = useState('')
  const [SpareParts, setSpareParts] = useState('')
  const [Cost, setCost] = useState('')
  const [TargetDate, setTargetDate] = useState('')
  const [Responsibility, setResponsibility] = useState('')
  const [HD, setHD] = useState('')
  const [Remark, setRemark] = useState('')
  const [Status, setStatus] = useState('')
  //   let status = 'pending'

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://backendmaintenx.onrender.com/api/breakdown/${id}`)
      console.log(response)
      setMachineName(response.data.MachineName)
      setBreakdownStartDate(response.data.BreakdownStartDate)
      setBreakdownEndDate(response.data.BreakdownEndDate)
      setBreakdownStartTime(response.data.BreakdownStartTime)
      setBreakdownEndTime(response.data.BreakdownEndTime)
      setShift(response.data.Shift)
      setLineName(response.data.LineName)
      setOperations(response.data.Operations)
      setBreakdownPhenomenons(response.data.BreakdownPhenomenons)
      setStatus(response.data.Status)
      setBreakdownType(response.data.BreakdownType)
      setDetectOCC(response.data.DetectOCC)
      setBreakdownTime(response.data.BreakdownTime)
      setActionTaken(response.data.ActionTaken)
      setWhyWhyAnalysis(response.data.WhyWhyAnalysis)
      setRootCause(response.data.RootCause)
      // setPermanentAction(response.data.PermanentAction)
      setTargetDate(response.data.TargetDate)
      setResponsibility(response.data.Responsibility)
      setPreventiveAction(response.data.PreventiveAction)
      setCorrectiveAction(response.data.CorrectiveAction)
      setHD(response.data.HD)
      setSpareParts(response.data.SpareParts)
      setCost(response.data.Cost)
      setRemark(response.data.Remark)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const Update = (e) => {
    e.preventDefault()
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
        BreakdownTime,
        ActionTaken,
        WhyWhyAnalysis,
        RootCause,
        PreventiveAction,
        CorrectiveAction,
        SpareParts,
        Cost,
        TargetDate,
        Responsibility,
        HD,
        Remark,
        Status,
      })
      .then((result) => {
        console.log(result)
        setMachineName('')
        setBreakdownStartDate('')
        setBreakdownEndDate('')
        setBreakdownStartTime('')
        setBreakdownEndTime('')
        setShift('')
        setLineName('')
        setOperations('')
        setBreakdownPhenomenons('')
        setStatus('')
        setPreventiveAction('')
        setCorrectiveAction('')
        setSpareParts('')
        setCost('')

        // Assuming you have a navigate function or useHistory from react-router-dom
        // Navigate back to the previous page
        navigate(-1)
      })
      .catch((err) => console.log(err))
  }

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
          <form action="" method="post" onSubmit={Update}>
            {/* Add Breakdown Detail Fields */}
            {/* <h3>Add Breakdown Detail</h3> */}
            <div className="row g-3">
              <div className="col-md-4">
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
              <div className="col-md-4">
                <label htmlFor="breakdownStartDate">Breakdown Start Date:</label>
                <input
                  type="date"
                  className="form-control col-sm-6"
                  name="BreakdownStartDate"
                  value={BreakdownStartDate}
                  disabled
                  onChange={(e) => setBreakdownStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
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
              <div className="col-md-4">
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
              <div className="col-md-4">
                <label htmlFor="stageName">Operations:</label>
                <input
                  type="text"
                  className="form-control col-sm-6"
                  name="StageName"
                  value={Operations}
                  disabled
                  onChange={(e) => setOperations(e.target.value)}
                />
              </div>
              <div className="col-md-4">
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
              <div className="col-md-4">
                <label htmlFor="breakdownType">Breakdown Type:</label>

                <select
                  className="form-control col-sm-6"
                  disabled
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
              {/* <div className="col-md-4">
                <label htmlFor="occ">Detect OCC:</label>
                <input
                  type="text"
                  disabled
                  className="form-control col-sm-6"
                  name="DetectOCC"
                  value={DetectOCC}
                  onChange={(e) => setDetectOCC(e.target.value)}
                />
              </div> */}
              <div className="col-md-4">
                <label htmlFor="breakdownStartTime">Breakdown Start Time:</label>
                <input
                  type="text"
                  disabled
                  className="form-control col-sm-6"
                  name="BreakdownStartTime"
                  value={BreakdownStartTime}
                  onChange={(e) => setBreakdownStartTime(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="breakdownEndTime">Breakdown End Time:</label>
                <input
                  type="text"
                  disabled
                  className="form-control col-sm-6"
                  name="BreakdownEndTime"
                  value={BreakdownEndTime}
                  onChange={(e) => setBreakdownEndTime(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="breakdownEndDate">Breakdown End Date:</label>
                <input
                  type="date"
                  disabled
                  className="form-control col-sm-6"
                  name="BreakdownEndDate"
                  value={BreakdownEndDate}
                  onChange={(e) => setBreakdownEndDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="whyWhy">Why-Why Analysis:</label>
                <input
                  type="textarea"
                  disabled
                  className="form-control col-sm-6"
                  name="WhyWhyAnalysis"
                  value={WhyWhyAnalysis}
                  onChange={(e) => setWhyWhyAnalysis(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="rootCause">Root Cause:</label>
                <input
                  type="text"
                  disabled
                  className="form-control col-sm-6"
                  name="RootCause"
                  value={RootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="targetDate">Target Date:</label>
                <input
                  type="date"
                  disabled
                  className="form-control col-sm-6"
                  name="TargetDate"
                  value={TargetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="responsibility">Responsibility:</label>
                <input
                  disabled
                  type="text"
                  className="form-control col-sm-6"
                  name="Responsibility"
                  value={Responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="hd">HD:</label>
                <input
                  type="text"
                  name="HD"
                  disabled
                  className="form-control col-sm-6"
                  value={HD}
                  onChange={(e) => setHD(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="remark">Remark:</label>
                <input
                  type="text"
                  disabled
                  className="form-control col-sm-6"
                  name="Remark"
                  value={Remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="assetCategory">Status</label>
                <select
                  className="form-control col-sm-6"
                  required
                  id="Status"
                  name="Status"
                  value={Status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option value="open">Open</option>
                  <option value="close">Close</option>
                </select>
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
