import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { QrReader } from '@blackbox-vision/react-qr-reader' // Adjust the import path

const QRScanner = ({ onScan, onError, onClose }) => {
  const [delay, setDelay] = useState(500)

  const handleScan = (data) => {
    if (data) {
      onScan(data)
    }
  }

  const handleError = (err) => {
    onError(err)
  }

  return (
    <div className="qr-scanner">
      <QrReader delay={delay} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
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
