import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { QrReader } from '@blackbox-vision/react-qr-reader'
import { useNavigate } from 'react-router-dom'

const QRScanner = ({ onScan, onError }) => {
  const [delay, setDelay] = useState(500)
  const [scannedData, setScannedData] = useState()
  const navigate = useNavigate()

  const handleScan = (data) => {
    if (data) {
      setScannedData(data)
      alert(`Scanned Data: ${data}`)
      window.open(data, '_blank') // Open the scanned URL in a new tab
      navigate(-1) // Navigate back to the previous page after a successful scan
    }
  }

  const handleError = (err) => {
    onError(err)
  }

  return (
    <div className="qr-scanner" style={{ width: '100vw', height: '100vh' }}>
      <QrReader
        delay={delay}
        onError={handleError}
        onScan={handleScan}
        onResult={(result) => {
          if (result?.text) {
            handleScan(result.text)
          }
        }}
        style={{ width: '100%', height: '100%' }}
        constraints={{ facingMode: 'environment' }} // Use the rear camera
      />
      <button onClick={() => navigate(-1)}>Close Scanner</button>
    </div>
  )
}

QRScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
}

export default QRScanner
