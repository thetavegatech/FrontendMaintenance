import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { NavLink } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import './assetTable/asset.css'
import { FaPlusCircle, FaChevronUp, FaChevronDown } from 'react-icons/fa'

const TodaysTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [filteredAssets, setFilteredAssets] = useState([])

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
        setLoading(false)
      } catch (error) {
        console.error("Error fetching today's tasks:", error)
        setLoading(false)
      }
    }

    fetchTodaysTasks()
  }, [])

  const [expandedItems, setExpandedItems] = useState([])

  const toggleExpand = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index))
    } else {
      setExpandedItems([...expandedItems, index])
    }
  }

  return (
    <div className="container">
      <h2>Todays Tasks</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <Table className="custom-table">
            <Thead>
              <Tr>
                <Th style={{ textAlign: 'center', height: '40px' }}>Asset Name</Th>
                <Th style={{ textAlign: 'center' }}>Location</Th>
                <Th style={{ textAlign: 'center' }}>Task Name</Th>
                <Th style={{ textAlign: 'center' }}>Task Description</Th>
                <Th style={{ textAlign: 'center' }}>Scheduled Maintenance</Th>
                <Th style={{ textAlign: 'center' }}>Start Date</Th>
                <Th style={{ textAlign: 'center' }}>Next Date</Th>
                <Th style={{ textAlign: 'center' }}>Status</Th>
                <Th style={{ textAlign: 'center' }}>Edit</Th>
                <Th style={{ textAlign: 'center' }}>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => (
                <Tr key={task._id}>
                  <Td style={{ textAlign: 'center' }}>{task.AssetName}</Td>
                  <Td style={{ textAlign: 'center' }}>{task.Location}</Td>
                  <Td style={{ textAlign: 'center' }}>{task.TaskName}</Td>
                  <Td style={{ textAlign: 'center' }}>{task.TaskDescription}</Td>
                  <Td style={{ textAlign: 'center' }}>
                    {task.ScheduledMaintenanceDatesandIntervals}
                  </Td>
                  <Td style={{ textAlign: 'center' }}>
                    {new Date(task.startDate).toISOString().split('T')[0]}
                  </Td>
                  <Td style={{ textAlign: 'center' }}>
                    {new Date(task.nextDate).toISOString().split('T')[0]}
                  </Td>
                  <Td style={{ textAlign: 'center' }}>{task.status}</Td>
                  <Td style={{ textAlign: 'center' }}>
                    <NavLink to={`/editPM/${task._id}`} style={{ color: '#000080' }}>
                      <FaEdit />
                    </NavLink>
                  </Td>
                  <Td style={{ textAlign: 'center' }}>
                    <button
                      className="btn"
                      onClick={() => this.deleteData(task._id)}
                      style={{ color: 'red' }}
                    >
                      <MdDelete />
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <div className="list-view">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {message && (
                  <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'red' }}>
                    {message}
                  </p>
                )}
                {tasks.map((tasks, index) => (
                  <div
                    key={tasks._id}
                    className={`list-item ${expandedItems.includes(index) ? 'expanded' : ''}`}
                  >
                    <div className="expand">
                      {expandedItems.includes(index) ? (
                        <FaChevronUp onClick={() => toggleExpand(index)} />
                      ) : (
                        <FaChevronDown onClick={() => toggleExpand(index)} />
                      )}
                    </div>
                    <div>
                      <span>{tasks.AssetName}</span> - <span>{tasks.Location}</span>
                    </div>
                    <div
                      className={`expanded-content ${
                        expandedItems.includes(index) ? 'visible' : 'hidden'
                      }`}
                    >
                      <div className="table-like">
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>TaskName:</strong>
                          </div>
                          <div className="table-cell">{tasks.TaskName}</div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>startDate:</strong>
                          </div>
                          <div className="table-cell">
                            {new Date(tasks.startDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>nextDate:</strong>
                          </div>
                          <div className="table-cell">
                            {new Date(tasks.nextDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>TaskDescription:</strong>
                          </div>
                          <div className="table-cell">{tasks.TaskDescription}</div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>Schedule:</strong>
                          </div>
                          <div className="table-cell">
                            {tasks.ScheduledMaintenanceDatesandIntervals}
                          </div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell">
                            <strong>Status:</strong>
                          </div>
                          <div className="table-cell">{tasks.Status}</div>
                        </div>
                      </div>
                    </div>
                    <div className="actions">
                      <NavLink to={`/editPM/${tasks._id}`} style={{ color: '#000080' }}>
                        <FaEdit />
                      </NavLink>
                      <button
                        className="btn"
                        // onClick={() => deleteData(asset._id)}
                        style={{ color: 'red' }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TodaysTasks
