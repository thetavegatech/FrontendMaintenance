import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import dlt from '../assetTable/delete.png'
import { CTable, CButton, CTableHead } from '@coreui/react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

class AssetTable extends React.Component {
  state = {
    assets: [],
    filteredAssets: [],
    searchQuery: '',
    formData: {},
    // isHovered: false,
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true })
  }

  handleMouseLeave = () => {
    this.setState({ isHovered: false })
  }

  async componentDidMount() {
    this.fetchData()
    await this.getAssetLocations()
    // Start the periodic update of the "Next Date"
    // this.updateNextDate()
    this.updateNextDate = this.updateNextDate.bind(this)

    // Set the time for 12:00 AM (midnight)
    const twelveAM = new Date()
    twelveAM.setHours(12, 44, 0, 0)

    // Calculate the delay until 12:00 AM
    const delay = twelveAM - new Date()

    // Set up a timeout to run updateNextDate at 12:00 AM every day
    setTimeout(() => {
      this.updateNextDate() // Run the function immediately
      this.updateInterval = setInterval(this.updateNextDate, 24 * 60 * 60 * 1000) // Repeat every 24 hours
    }, delay)

    axios
      .get('https://mms-backend-n2zv.onrender.com/getAllData')
      .then((response) => {
        let fetchedAssets = Array.isArray(response.data) ? response.data : [response.data]

        // Set status to "Pending" for new tasks
        fetchedAssets = fetchedAssets.map((asset) => {
          if (!asset.status) {
            asset.status = 'Pending'
          }
          return asset
        })

        // Check and update status for completed tasks based on next date
        const today = new Date()
        fetchedAssets = fetchedAssets.map((asset) => {
          const nextDate = new Date(asset.nextDate)
          if (today >= nextDate && asset.status === 'Completed') {
            // asset.status = 'Pending'
          }
          return asset
        })

        this.setState({ assets: fetchedAssets })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
      })
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval)
  }

  fetchData() {
    axios
      .get('https://mms-backend-n2zv.onrender.com/UserInfo')
      .then((response) => {
        this.setState(response.data)
        console.log(response)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
      })
  }

  deleteData(id) {
    const isConfirmed = window.confirm('Are you sure you want to delete this data?')
    if (isConfirmed) {
      axios
        .delete(`http://localhost:5000/deleteRecord/${id}`)
        .then((response) => {
          console.log('Data deleted:', response.data)

          // Delete from frontend
          const index = this.state.assets.findIndex((asset) => asset._id === id)
          if (index !== -1) {
            const newAssets = [...this.state.assets]
            newAssets.splice(index, 1)
            this.setState({
              assets: newAssets,
              message: 'Data successfully deleted!',
            })
          }
        })
        .catch((error) => {
          console.error('Error deleting data:', error)
          this.setState({
            message: 'Error deleting data. Please try again.',
          })

          // Set timeout to clear the error message after 3 seconds (adjust as needed)
          setTimeout(() => {
            this.setState({
              message: '',
            })
          }, 2000)
        })
    }
  }

  handleClick = () => {
    this.setState((prevState) => ({
      isClicked: !prevState.isClicked,
    }))
  }

  getAssetLocations = async () => {
    try {
      const response = await fetch('http://localhost:5000/locations')
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }
      const Location = await response.json()

      if (Location.length === 0) {
        console.log('No locations found.')
      } else {
        console.log('Asset Locations:', Location)
        this.setState({ this: Location })
      }
    } catch (error) {
      console.error('Error fetching asset locations:', error.message)
    }
  }

  numbers = '7020804148' // Replace with the phone numbers

  sendSMS = async (userInfo, phoneNumbers, nextDate, scheduledMaintenance) => {
    const sender = 'AAABRD'
    const apiKey = 'NDE1MDY2NGM2Mzc3NTI0ZjQzNmE1YTM5NDY0YzZlNzU='
    const Data1 = 'PM SChedule'
    const Data2 = 'Check PM Schedule for more.'
    // Loop through each user and send SMS
    for (const user of userInfo) {
      // const { nextDate, ScheduledMaintenanceDatesandIntervals } = this.state.formData
      // const nextDate = this.state.formData.nextDate
      // const scheduledMaintenance = this.state.formData.ScheduledMaintenanceDatesandIntervals
      // Formulate a simple message
      // const message = encodeURIComponent(
      //   'Breakdown For ' +
      //     nextDate +
      //     ' please visit concerned department Details are ' +
      //     scheduledMaintenance +
      //     ' - Aurangabad Auto Ancillary',
      // )

      const message = encodeURIComponent(
        `Breakdown For ${Data1} please visit concerned department Details are ${Data2} - Aurangabad Auto Ancillary`,
      )

      // Create the API URL with the current user's phone number
      const url = `https://api.textlocal.in/send/?apikey=${apiKey}&sender=${sender}&numbers=${user.phoneNumber}&message=${message}`

      // Use fetch to send the SMS
      try {
        const response = await fetch(url)
        const data = await response.json()

        console.log(`SMS sent successfully to ${user.name} (${user.phoneNumber}):`, data)
      } catch (error) {
        console.error(`Error sending SMS to ${user.name} (${user.phoneNumber}):`, error)
      }
    }
  }

  updateNextDate = async () => {
    const today = new Date()
    const { assets } = this.state || {}
    const updatedIds = [] // Array to store the IDs of updated assets
    const updatedLocations = []

    if (!assets) {
      return
    }

    const updatedAssets = await Promise.all(
      assets.map(async (asset) => {
        const nextDate = new Date(asset.nextDate)

        if (today >= nextDate) {
          let frequency = asset.ScheduledMaintenanceDatesandIntervals
            ? asset.ScheduledMaintenanceDatesandIntervals.toLowerCase()
            : 'daily' // Default to "daily" if frequency is undefined

          let daysToAdd = 1 // Default to adding 1 day

          // Determine the number of days to add based on the frequency
          switch (frequency) {
            case 'daily':
              daysToAdd = 1
              break
            case 'weekly':
              daysToAdd = 8
              break
            case 'fifteen days':
              daysToAdd = 17
              break
            case 'monthly':
              // Assuming a month has 30 days, adjust as needed
              daysToAdd = 34
              break
            case 'quarterly':
              // Assuming a quarter has 90 days, adjust as needed
              daysToAdd = 104
              break
            case 'half year':
              // Assuming half a year has 180 days, adjust as needed
              daysToAdd = 208
              break
            case 'yearly':
              // Assuming a year has 365 days, adjust as needed
              daysToAdd = 417
              break
            default:
              console.error(`Unsupported frequency for task: ${asset.TaskName}`)
              // Handle unsupported frequency by defaulting to "daily"
              frequency = 'daily'
              daysToAdd = ''
          }

          // Set the "Next Date" to today's date if the calculated date is today or later
          nextDate.setDate(nextDate.getDate() + daysToAdd)

          // If the calculated next date is a Sunday, skip it
          while (nextDate.getDay() === 0) {
            nextDate.setDate(nextDate.getDate() + 1)
          }

          // Check if the next date has changed
          if (asset.nextDate !== nextDate.toISOString().split('T')[0]) {
            updatedIds.push(asset._id, asset.Location) // Store the ID of the updated asset
            updatedLocations.push(asset.Location)
          }

          asset.nextDate = nextDate.toISOString().split('T')[0]

          // Update status to "Pending"
          asset.status = 'Pending'

          // If the task is completed and the next date is beyond today, set status to "Pending"
          if (asset.status === 'Completed' && today < nextDate) {
            asset.status = 'Pending'
          }
        }

        return asset
      }),
    )

    // Make a separate API request to get details of updated assets by ID
    try {
      if (updatedIds.length > 0) {
        const idDetailsResponse = await axios.get('http://localhost:5000/getAllData', {
          params: { ids: updatedIds },
        })

        console.log('Updated Assets Details:', idDetailsResponse.data)
      } else {
        console.log('No assets were updated.')
      }
    } catch (error) {
      console.error('Error fetching updated assets details:', error)
    }

    const updatedAssetsArray = await Promise.all(updatedAssets)

    // Update the state and get the updated IDs
    this.setState({ assets: updatedAssetsArray }, async () => {
      try {
        const response = await axios.put('http://localhost:5000/updateRecords', {
          assets: updatedAssetsArray,
        })

        console.log('Next Date updated in the database:', response.data)

        // Access the updated IDs and Locations here
        console.log('Updated IDs:', updatedIds)
        console.log('Updated Locations:', updatedLocations)

        // Fetch user information for each updated location
        for (const location of updatedLocations) {
          try {
            const userInfoResponse = await axios.get(
              `http://localhost:5000/UserInfoByLocation/${location}`,
            )

            const userInfo = userInfoResponse.data

            // Now userInfo contains user information for the specified location
            // You can loop through userInfo and send SMS to each user

            const phoneNumbers = userInfo.map((user) => user.phoneNumber)

            userInfo.forEach((user) => {
              console.log('Sending SMS to user:', user.name, user.phoneNumber)
              // this.sendSMS(userInfo, phoneNumbers)

              const nextDate = this.state.formData.nextDate
              const scheduledMaintenance = this.state.formData.ScheduledMaintenanceDatesandIntervals
              // Call sendSMS function
              this.sendSMS(userInfo, phoneNumbers, nextDate, scheduledMaintenance)
              // Send SMS logic here using user.phoneNumber
            })
          } catch (error) {
            console.error('Error fetching user info by location:', error)
          }
        }

        // Now, you can use the updatedIds array as needed
      } catch (error) {
        console.error('Error updating Next Date in the database:', error)
      }

      // await this.sendSMS(updatedAssetsArray, phoneNumbers)
    })
  }

  handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase()

    // Filter assets based on the search query
    const filteredAssets = this.state.assets.filter((asset) => {
      const taskNameLower = (asset.TaskName || '').toLowerCase()
      // const taskDescriptionLower = (asset.TaskDescription || '').toLowerCase()
      // const statusLower = (asset.status || '').toLowerCase()

      return taskNameLower.includes(query)
      // taskDescriptionLower.includes(query) ||
      // scheduledMaintenanceLower.includes(query) ||
      // statusLower.includes(query)
    })

    this.setState({
      filteredAssets,
      searchQuery: query,
    })
  }

  render() {
    const { assets, filteredAssets, message, searchQuery } = this.state

    // Apply filter for non-empty "Task Name" to both assets and filteredAssets
    const filteredDefaultAssets = assets.filter(
      (asset) => asset.TaskName && asset.TaskName.trim() !== '',
    )

    const { isClicked } = this.state

    return (
      <div className="container" style={{ marginTop: '0px' }}>
        <NavLink to="/taskForm">
          <CButton color="info" className="mb-2" style={{ marginTop: '5px' }}>
            Add New
          </CButton>
        </NavLink>

        {/* <div> */}
        <label htmlFor="searchTask" style={{ marginLeft: '70%' }}>
          <span role="img" aria-label="search-icon"></span>
        </label>
        <input
          type="text"
          id="searchTask"
          placeholder="Search Task"
          style={{
            marginBottom: '10px',
            padding: '8px',
            border: '1px solid ',
            borderRadius: '4px',
            transition: 'border-color 0.3s ease-in-out, background-color 0.3s ease-in-out',
            backgroundColor: isClicked ? '#ccc' : 'transparent',
          }}
          onClick={this.handleClick}
          value={this.searchQuery}
          onChange={this.handleSearchChange}
        />
        {/* </div> */}

        <CTable bordered striped hover responsive>
          <CTableHead color="dark">
            <tr>
              <th style={{ textAlign: 'center' }}>Asset Name</th>
              <th style={{ textAlign: 'center' }}>Location</th>
              <th style={{ textAlign: 'center' }}>Task Name</th>
              <th style={{ textAlign: 'center' }}>Task Description</th>
              <th style={{ textAlign: 'center' }}>Scheduled Maintenance</th>
              <th style={{ textAlign: 'center' }}>Start Date</th>
              <th style={{ textAlign: 'center' }}>Next Date</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'center' }}>Edit </th>
              <th style={{ textAlign: 'center' }}>Delete</th>
              <th>Image</th>
            </tr>
          </CTableHead>
          <tbody>
            {message && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', fontStyle: 'italic', color: 'red' }}>
                  {message}
                </td>
              </tr>
            )}
            {(searchQuery ? filteredAssets : filteredDefaultAssets).map((asset) => (
              <tr key={asset._id}>
                <td style={{ textAlign: 'center' }}>{asset.AssetName}</td>
                <td style={{ textAlign: 'center' }}>{asset.Location}</td>
                <td style={{ textAlign: 'center' }}>{asset.TaskName}</td>
                <td style={{ textAlign: 'center' }}>{asset.TaskDescription}</td>
                <td style={{ textAlign: 'center' }}>
                  {asset.ScheduledMaintenanceDatesandIntervals}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {new Date(asset.startDate).toISOString().split('T')[0]}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {new Date(asset.nextDate).toISOString().split('T')[0]}
                </td>
                <td style={{ textAlign: 'center' }}>{asset.status}</td>
                <td style={{ textAlign: 'center' }}>
                  <NavLink to={`/editTask/${asset._id}`} style={{ color: '#000080' }}>
                    <FaEdit />
                  </NavLink>
                </td>

                <td style={{ textAlign: 'center' }}>
                  <button
                    className="btn"
                    onClick={() => this.deleteData(asset._id)}
                    style={{ color: 'red' }}
                  >
                    {/* <img src={dlt} alt="" width={30} height={30} /> */}
                    <MdDelete />
                  </button>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <NavLink to={`/taskRecord/${asset._id}`}>
                    <img src={asset.Image} height={50} width={50} />
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </CTable>
      </div>
    )
  }
}

export default AssetTable
