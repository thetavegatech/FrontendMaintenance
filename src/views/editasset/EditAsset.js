import React, { useEffect, useState } from 'react'
// import editForm from './css/editform.css';
// import { Form, FormGroup, Label, Input, Button, Container, Col } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

export default function EditForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [AssetName, setAssetName] = useState('')
  const [MachineNo, setMachineNo] = useState('')
  const [Location, setLocation] = useState('') // Default to false
  const [SrNo, setSrNo] = useState('')
  const [MachineType, setMachineType] = useState('')
  const [Make, setMake] = useState('')
  const [Controller, setController] = useState('')
  const [PowerRatting, setPowerRatting] = useState('')
  const [CapecitySpindle, setCapecitySpindle] = useState('')
  const [AxisTravels, setAxisTravels] = useState('')
  const [Ranking, setRanking] = useState('')
  const [InstallationDate, setInstallationDate] = useState('')
  const [ManufacturingYear, setManufacturingYear] = useState('')

  const [StartDateofMaintenance, setStartDateofMaintenance] = useState('') // assuming you need this
  // const [ScheduledMaintenanceDatesandIntervals, setScheduledMaintenanceDatesandIntervals] = useState('');
  const [nextScheduledDate, setNextScheduledDate] = useState('')
  const [Image, setImage] = useState('')

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

  const someFunction = () => {
    const startDate = this.state.StartDateofMaintenance
    const frequency = this.state.ScheduledMaintenanceDatesandIntervals
    const nextDate = this.getNextScheduleDate(startDate, frequency)
    this.setState({ nextScheduledDate: nextDate.toISOString().split('T')[0] })
    console.log(nextDate) // or any other logic you want with nextDate
  }

  function getNextScheduleDate(startDate, frequency) {
    let newDate = new Date(startDate)

    switch (frequency.toLowerCase()) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1)
        break
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7)
        break
      case 'fifteen days':
        newDate.setDate(newDate.getDate() + 15)
        break
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case 'quarterly':
        newDate.setMonth(newDate.getMonth() + 3)
        break
      case 'half year':
        newDate.setMonth(newDate.getMonth() + 6)
        break
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + 1)
        break
      default:
        throw new Error('Unsupported frequency')
    }

    console.log('New Scheduled Date:', newDate)
    return newDate
  }

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://backendmaintenx.onrender.com/api/assets/${id}`)
      console.log(response)
      setAssetName(response.data.AssetName)
      setMachineNo(response.data.MachineNo)
      setSrNo(response.data.SrNo)
      setLocation(response.data.Location)
      setMachineType(response.data.MachineType)
      setMake(response.data.Make)
      setController(response.data.Controller)
      setPowerRatting(response.data.PowerRatting)
      setCapecitySpindle(response.data.CapecitySpindle)
      setAxisTravels(response.data.AxisTravels)
      setRanking(response.data.Ranking)
      setInstallationDate(response.data.InstallationDate)
      setManufacturingYear(response.data.ManufacturingYear)
      setImage(response.data.Image)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const Update = (e) => {
    e.preventDefault()
    axios
      .put(`https://backendmaintenx.onrender.com/api/assets/${id}`, {
        AssetName,
        MachineNo,
        SrNo,
        MachineType,
        Make,
        Controller,
        PowerRatting,
        CapecitySpindle,
        AxisTravels,
        Ranking,
        Location,
        InstallationDate,
        ManufacturingYear,
        Image,
      })
      .then((result) => {
        console.log(result)
        setAssetName('')
        setImage('')

        // Assuming you have a navigate function or useHistory from react-router-dom
        // Navigate back to the previous page
        navigate(-1)
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <div
        className="tab-content1"
        style={{
          border: '2px solid #ccc',
          backgroundColor: '',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '2px 4px 8px rgba(0, 0, 0, 0.1)',
          width: '100%',
        }}
      >
        {/* Step 1: Asset Identification */}
        <div>
          <form onSubmit={Update}>
            <div className="row g-2">
              <div className="col-md-6">
                <label htmlFor="assetName" style={{ marginBottom: '10px' }}>
                  Asset Name:
                </label>
                <input
                  type="text"
                  required
                  className="form-control col-sm-6"
                  name="AssetName"
                  id="assetName"
                  style={{ marginBottom: '10px' }}
                  // style={{ width: '80%' }}
                  value={AssetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="MachineNo" style={{ marginBottom: '10px' }}>
                  MachineNo:
                </label>
                <input
                  type="text"
                  required
                  style={{ marginBottom: '10px' }}
                  className="form-control col-sm-5"
                  id="MachineNo"
                  name="MachineNo"
                  value={MachineNo}
                  onChange={(e) => setMachineNo(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>
        <form onSubmit={Update}>
          <div className="row g-2">
            <div className="col-md-6">
              <label htmlFor="SrNo" style={{ marginBottom: '10px' }}>
                SrNo:
              </label>
              <input
                className="form-control col-sm-4"
                required
                style={{ marginBottom: '10px' }}
                id="SrNo"
                name="SrNo"
                value={SrNo}
                onChange={(e) => setSrNo(e.target.value)}
              />
              {/* </input> */}
            </div>
            <div className="col-md-6">
              <label htmlFor="MachineType" style={{ marginBottom: '10px' }}>
                MachineType:
              </label>
              <input
                type="text"
                required
                style={{ marginBottom: '10px' }}
                className="form-control col-sm-4"
                id="MachineType"
                name="MachineType"
                value={MachineType}
                onChange={(e) => setMachineType(e.target.value)}
              />
            </div>
            {/* <div className="col-md-6">
              <label htmlFor="Make" style={{ marginBottom: '10px' }}>
                Make:
              </label>
              <input
                type="text"
                required
                style={{ marginBottom: '10px' }}
                className="form-control col-sm-4"
                id="Make"
                name="Make"
                value={Make}
                onChange={(e) => setMake(e.target.value)}
              />
            </div> */}
            <div className="col-md-6">
              <label htmlFor="assetLocation" className="form-label">
                Location:
              </label>
              <input
                className="form-control col-sm-6"
                required
                id="assetLocation"
                name="Location"
                value={Location}
                style={{ marginBottom: '10px' }}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            {/* <div className="col-md-5">
              <label htmlFor="maintenanceActivities">Details of Maintenance Activities:</label>
              <textarea
                className="form-control col-sm-4"
                id="maintenanceActivities"
                defaultValue={''}
                name="DetailsofMaintenanceActivities"
                value={DetailsofMaintenanceActivities}
                onChange={(e) => setDetailsofMaintenanceActivities(e.target.value)}
              />
            </div> */}
            <div className="col-md-6">
              <label htmlFor="Controller" style={{ marginBottom: '10px' }}>
                Controller:
              </label>
              <textarea
                className="form-control col-sm-4"
                required
                id="Controller"
                style={{ marginBottom: '10px' }}
                defaultValue={''}
                name="Controller"
                value={Controller}
                onChange={(e) => setController(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="PowerRatting" style={{ marginBottom: '10px' }}>
                PowerRatting:
              </label>
              <textarea
                className="form-control col-sm-4"
                required
                style={{ marginBottom: '10px' }}
                id="PowerRatting"
                defaultValue={''}
                name="PowerRatting"
                value={PowerRatting}
                onChange={(e) => setPowerRatting(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="CapecitySpindle" style={{ marginBottom: '10px' }}>
                CapecitySpindle:
              </label>
              <textarea
                className="form-control col-sm-4"
                required
                style={{ marginBottom: '10px' }}
                id="CapecitySpindle"
                defaultValue={''}
                name="CapecitySpindle"
                value={CapecitySpindle}
                onChange={(e) => setCapecitySpindle(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="AxisTravels" style={{ marginBottom: '10px' }}>
                AxisTravels:
              </label>
              <textarea
                className="form-control col-sm-4"
                required
                style={{ marginBottom: '10px' }}
                id="AxisTravels"
                defaultValue={''}
                name="AxisTravels"
                value={AxisTravels}
                onChange={(e) => setAxisTravels(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="Ranking" style={{ marginBottom: '10px' }}>
                Ranking:
              </label>
              <textarea
                className="form-control col-sm-4"
                required
                style={{ marginBottom: '10px' }}
                id="Ranking"
                defaultValue={''}
                name="Ranking"
                value={Ranking}
                onChange={(e) => setRanking(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="InstallationDate" style={{ marginBottom: '10px' }}>
                InstallationDate:
              </label>
              <input
                className="form-control col-sm-4"
                type="date"
                // required
                style={{ marginBottom: '10px' }}
                id="InstallationDate"
                defaultValue={''}
                name="InstallationDate"
                value={InstallationDate}
                onChange={(e) => setInstallationDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="manufacturingyear" style={{ marginBottom: '10px' }}>
                Manufacturing Year:
              </label>
              <input
                required
                type="year"
                className="form-control col-sm-4"
                id="ManufacturingYear"
                defaultValue={''}
                name="ManufacturingYear"
                value={ManufacturingYear}
                onChange={(e) => setManufacturingYear(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="attachment">Attachment:</label>
              <input
                type="file"
                className="form-control col-sm-4"
                onChange={convertToBse64}
              ></input>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ margin: '10px', width: '28%' }}
            type="submit"
          >
            Save
          </button>
          {/* </div> */}
        </form>
        {/* </div> */}
        {/* </div> */}
      </div>
      {/* </div> */}
    </>
  )
}
