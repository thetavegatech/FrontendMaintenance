import React, { useEffect, useState } from 'react'
import { MdDashboard } from 'react-icons/md'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from 'classnames'
import '../form.css'
// import '../tasks/Taskform.css'

export default function EditForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [AssetName, setAssetName] = useState('')
  const [TaskName, setTaskName] = useState('')
  const [TaskDescription, setTaskDescription] = useState('')
  const [AssetCategory, setAssetCategory] = useState('') // Default to false
  const [Location, setLocation] = useState('') // Default to false
  const [ManufacturersName, setManufacturersName] = useState('')
  const [ManufacturersAddress, setManufacturersAddress] = useState('')
  const [ManufacturersContactNo, setManufacturersContactNo] = useState('')
  const [SupplierVendorInformation, setSupplierVendorInformation] = useState('')
  const [CurrentOwner, setCurrentOwner] = useState('')
  const [DepartmentResponsible, setDepartmentResponsible] = useState('')
  const [LocationDepartment, setLocationDepartment] = useState('')
  const [PhysicalLocation, setPhysicalLocation] = useState('')
  const [CurrentStatus, setCurrentStatus] = useState('')
  const [ExpectedUsefulLife, setExpectedUsefulLife] = useState('')
  const [DateofLastMaintenance, setDateofLastMaintenance] = useState('')
  const [DetailsofMaintenanceActivities, setDetailsofMaintenanceActivities] = useState('')
  const [ScheduledMaintenanceDatesandIntervals, setScheduledMaintenanceDatesandIntervals] =
    useState('')
  const [ManufacturersEmail, setManufacturersEmail] = useState('')
  const [status, setstatus] = useState('')
  const [ModelNumber, setModelNumber] = useState('')
  const [SerialNumber, setSerialNumber] = useState('')
  const [PurchaseCost, setPurchaseCost] = useState('')
  const [PurchaseDate, setPurchaseDate] = useState('')
  const [WarrantyStartDate, setWarrantyStartDate] = useState('')
  const [WarrantyEndDate, seWarrantyEndDate] = useState('')
  const [AcquisitionMethod, setAcquisitionMethod] = useState('')
  const [WarrantyProviderManufacturerContact, setWarrantyProviderManufacturerContact] = useState('')
  const [WarrantyTermsandConditions, setWarrantyTermsandConditions] = useState('')
  const [PMDetails, setPMDetails] = useState('')
  const [Image, setImage] = useState('')
  const [startDate, setstartDate] = useState('')
  const [nextDate, setnextDate] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  useEffect(() => {
    fetchData()
  }, [])

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

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/pm/${id}`)
      console.log(response)
      setAssetName(response.data.AssetName)
      setTaskName(response.data.TaskName)
      setTaskDescription(response.data.TaskDescription)
      setAssetCategory(response.data.AssetCategory)
      setLocation(response.data.Location)
      setCurrentStatus(response.data.CurrentStatus)
      setPMDetails(response.data.PMDetails)
      setImage(response.data.Image)
      setstartDate(formatDate(response.data.startDate))
      setnextDate(formatDate(response.data.nextDate))
      setstatus(response.data.status)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const Update = (e) => {
    e.preventDefault()
    axios
      .put(`http://localhost:4000/api/pm/${id}`, {
        AssetName,
        TaskName,
        TaskDescription,
        AssetCategory,
        Location,
        ModelNumber,
        DetailsofMaintenanceActivities,
        ScheduledMaintenanceDatesandIntervals,
        PMDetails,
        status,
        Image,
        startDate,
        nextDate,
      })
      .then((result) => {
        console.log(result)
        setAssetName('')
        setTaskName('')
        setTaskDescription('')
        setAssetCategory('')
        setLocation('')
        setstartDate('')
        setScheduledMaintenanceDatesandIntervals('')
        setnextDate('')
        setstatus('')
        setImage('')
        setnextDate('')

        // Assuming you have a navigate function or useHistory from react-router-dom
        // Navigate back to the previous page
        navigate(-1)
      })
      .catch((err) => console.log(err))
  }
  // Create a function to format the date
  const formatDate = (dateString) => {
    const parsedDate = new Date(dateString)
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="card shadow-sm mx-auto">
      <Link to="/temperature" style={{ position: 'absolute', top: '15px', right: '10px' }}></Link>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          className={classNames('box', 'd-flex', 'justify-content-center', 'align-items-center')}
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
        <h5 style={{ marginLeft: '25px' }}>PM Edit</h5>
      </div>

      <div>
        <form onSubmit={Update} style={{ marginBottom: '5rem', marginTop: '0px' }}>
          <div className="form-row1" style={{ marginLeft: '30px' }}>
            <div
              className="form-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'px',
                marginBottom: '20px',
              }}
            >
              <div className="form-group" style={{ width: '25%' }}>
                <label htmlFor="taskName">Task Name:</label>
                <input
                  disabled
                  type="text"
                  className="form-control"
                  name="taskName"
                  id="taskName"
                  // style={{ width: '100%' }}
                  value={TaskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="assetDescription">Description:</label>
                <textarea
                  className="form-control"
                  disabled
                  // style={{ width: '80%' }}
                  id="taskDescription"
                  defaultValue={''}
                  name="TaskDescription"
                  value={TaskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Start From :</label>
                <input
                  type="text" // Change input type to text
                  className="form-control"
                  id="startDate"
                  // style={{ width: '80%' }}
                  name="startDate"
                  value={startDate}
                  disabled // to make it non-editable
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="startDate">Next Date :</label>
                <input
                  type="text" // Change input type to text
                  className="form-control"
                  id="nextDate"
                  // style={{ width: '80%' }}
                  name="nextDate"
                  value={nextDate}
                  onChange={(e) => setnextDate(e.target.value)}
                />
              </div> */}
            </div>
            <div
              className="form-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'px',
                marginBottom: '20px',
              }}
            >
              <div className="form-group">
                <label htmlFor="scheduledMaintenance">
                  Scheduled Maintenance Dates and Intervals:
                </label>
                <select
                  disabled
                  className="form-control"
                  // style={{ width: '80%' }}
                  id="scheduledMaintenance"
                  name="ScheduledMaintenanceDatesandIntervals"
                  value={ScheduledMaintenanceDatesandIntervals}
                  onChange={(e) => setScheduledMaintenanceDatesandIntervals(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="fifteen days">Fifteen Days</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half year">Half Year</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Next Date :</label>
                <input
                  type="text" // Change input type to text
                  className="form-control"
                  id="nextDate"
                  // style={{ width: '80%' }}
                  name="nextDate"
                  value={nextDate}
                  onChange={(e) => setnextDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  className="form-control"
                  // style={{ width: '80%' }}
                  required
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setstatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  {/* <option value="open">Open</option> */}
                </select>
              </div>
            </div>
            {/* <div className="col-md-6">
              <label htmlFor="attachment">Attachment:</label>
              <input
                type="file"
                className="form-control col-sm-6"
                onChange={convertToBse64}
              ></input>
            </div> */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                float: 'left',
                backgroundColor: '#1237F7',
                marginTop: '10px',
                alignItems: 'end',
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
