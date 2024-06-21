// BreakdownComponent.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

const BreakdownComponent = ({ _id }) => {
  const [breakdowns, setBreakdowns] = useState([])

  useEffect(() => {
    // Fetch breakdown data for the specified asset ID
    const fetchBreakdownData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/asset/${_id}`)
        setBreakdowns(response.data)
      } catch (error) {
        console.error('Error fetching breakdown data:', error)
      }
    }

    fetchBreakdownData()
  }, [_id])

  return (
    <div>
      <h2>Breakdowns</h2>
      <ul>
        {breakdowns.map((breakdown) => (
          <li key={breakdown.id}>{breakdown.description}</li>
        ))}
      </ul>
    </div>
  )
}

BreakdownComponent.propTypes = {
  _id: PropTypes.string.isRequired, // assetId is required and should be a string
}

export default BreakdownComponent
