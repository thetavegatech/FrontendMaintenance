import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const BreakDownRecord = () => {
  const { id } = useParams()
  const [imageData, setImageData] = useState(null)

  useEffect(() => {
    // Extracting the breakdown ID from the route parameters

    // Fetching data based on the breakdown ID
    axios
      .get(`http://192.168.1.4:5000/getBreakdownDataId/${id}`)
      .then((response) => {
        // Assuming the API response has an 'Image' property
        setImageData(response.data.Image)
      })
      .catch((error) => {
        console.error('Error fetching image data:', error)
        alert('Error fetching image data')
      })
  }, [])

  return (
    <div>
      <img src={imageData} height="50%" width="100%" />
    </div>
  )
}

export default BreakDownRecord
