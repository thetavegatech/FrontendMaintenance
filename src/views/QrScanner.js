import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { QrReader } from '@blackbox-vision/react-qr-reader' // Adjust the import path

const QRScanner = ({ onScan, onError, onClose }) => {
  const [delay, setDelay] = useState(500)
  const [scannedData, setScannedData] = useState()

  const handleScan = (data) => {
    if (data) {
      setScannedData(data)
      alert(`Scanned Data: ${data}`)
      window.open(data, '_blank') // Open the scanned URL in a new tab
      onClose() // Close the scanner after a successful scan
    }
  }

  const handleError = (err) => {
    onError(err)
  }

  return (
    <div className="qr-scanner">
      <QrReader
        delay={delay}
        onError={handleError}
        onScan={handleScan}
        onResult={(result) => {
          if (result?.text) {
            handleScan(result.text)
          }
        }}
        style={{ width: '100%' }}
        constraints={{ facingMode: 'environment' }} // Use the rear camera
      />
      <button onClick={onClose}>Close Scanner</button>
    </div>
  )
}

QRScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default QRScanner
