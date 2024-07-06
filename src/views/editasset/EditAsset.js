import React, { useEffect, useState } from 'react'
// import editForm from './css/editform.css';
// import { Form, FormGroup, Label, Input, Button, Container, Col } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../form.css'
// import { NavLink } from 'react-router-dom'
import { MdDashboard } from 'react-icons/md'
// import { IoIosAddCircleOutline } from 'react-icons/io'

// import { Link } from 'react-router-dom'
import classNames from 'classnames'

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
    <div className="container-fluid card shadow-sm mx-auto" style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          // className="d-flex justify-content-center align-items-center"
          className={classNames(
            'box',
            'd-flex',
            'justify-content-center',
            'align-items-center',
            'd-flex justify-content-center align-items-center',
          )}
        >
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
        {/* <NavLink to="/assetForm">
          <IoIosAddCircleOutline
            className="mb-2"
            style={{
              marginBottom: '1.5rem',
              backgroundColor: 'white',
              marginLeft: '2rem',
              borderRadius: '2rem',
              width: '2rem',
              height: '2rem',
              color: 'black',
              alignContent: 'end',
              position: '',
            }}
          ></IoIosAddCircleOutline>
        </NavLink> */}
      </div>

      <div className="table-container">
        <form onSubmit={Update} style={{ marginBottom: '5rem', marginTop: '0px' }}>
          <div className="form-row1" style={{ marginLeft: '30px' }}>
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
                <label htmlFor="assetName">Asset Name:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  name="AssetName"
                  id="assetName"
                  value={AssetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="MachineNo">Machine No:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="MachineNo"
                  name="MachineNo"
                  value={MachineNo}
                  onChange={(e) => setMachineNo(e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="SrNo">Sr No:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="SrNo"
                  name="SrNo"
                  value={SrNo}
                  onChange={(e) => setSrNo(e.target.value)}
                  style={{ height: '40px' }}
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
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="MachineType">Machine Type:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="MachineType"
                  name="MachineType"
                  value={MachineType}
                  onChange={(e) => setMachineType(e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Controller">Controller:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="Controller"
                  name="Controller"
                  value={Controller}
                  onChange={(e) => setController(e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="PowerRatting">Power Rating:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="PowerRatting"
                  name="PowerRatting"
                  value={PowerRatting}
                  onChange={(e) => setPowerRatting(e.target.value)}
                  style={{ height: '40px' }}
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
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="CapecitySpindle">Capacity Spindle:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="CapecitySpindle"
                  name="CapecitySpindle"
                  value={CapecitySpindle}
                  onChange={(e) => setCapecitySpindle(e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="AxisTravels">Axis Travels:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="AxisTravels"
                  name="AxisTravels"
                  value={AxisTravels}
                  onChange={(e) => setAxisTravels(e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="Ranking">Ranking:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="Ranking"
                  name="Ranking"
                  value={Ranking}
                  onChange={(e) => setRanking(e.target.value)}
                  style={{ height: '40px' }}
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
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="assetLocation">Location:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="assetLocation"
                  name="Location"
                  value={Location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="InstallationDate">Installation Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="InstallationDate"
                  name="InstallationDate"
                  value={InstallationDate}
                  onChange={(e) => setInstallationDate(e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="ManufacturingYear">Manufacturing Year:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="ManufacturingYear"
                  name="ManufacturingYear"
                  value={ManufacturingYear}
                  onChange={(e) => setManufacturingYear(e.target.value)}
                  style={{ height: '40px' }}
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
              <div className="form-group" style={{ width: '30%' }}>
                <label htmlFor="attachment">Attachment:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={convertToBse64}
                  style={{ height: '40px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                float: 'left',
                backgroundColor: '#CA226B',
                marginTop: '10px',
                alignItems: 'end',
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
