import React, { useState, useEffect } from 'react'
import { QrReader } from 'react-qr-reader'
import PropTypes from 'prop-types'
import './QrScanner.css'
import { useNavigate } from 'react-router-dom'

const QrScanner = ({ onClose }) => {
  const [scannedData, setScannedData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        console.log('Camera access granted')
        alert('Camera access granted')
        stream.getTracks().forEach((track) => track.stop())
      } catch (err) {
        console.error('Camera access denied:', err)
        alert('Please allow camera access to scan QR codes.')
      }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('navigator.mediaDevices and getUserMedia are available')
      checkCameraAccess()
    } else {
      console.error(
        'navigator.mediaDevices or navigator.mediaDevices.getUserMedia is not available',
      )
      alert('Camera not supported on this device or browser.')
    }
  }, [])

  const handleScan = (data) => {
    if (data) {
      setScannedData(data)
      alert(`Scanned Data: ${data}`)
      window.open(data, '_blank') // Open the scanned URL in a new tab
      onClose() // Close the scanner after a successful scan
    }
  }

  const handleError = (err) => {
    console.error('QR Scanner Error:', err)
  }

  return (
    <div className="qr-scanner-modal">
      <div className="qr-scanner-content">
        <QrReader
          delay={300}
          onError={handleError}
          onResult={(result) => {
            if (result?.text) {
              handleScan(result.text)
            }
          }}
          constraints={{ facingMode: { exact: 'environment' } }}
          style={{ width: '100%' }}
        />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

QrScanner.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default QrScanner
