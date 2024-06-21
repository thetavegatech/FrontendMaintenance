// import React, { useState } from 'react'
// import { QrReader } from 'react-qr-reader' // Import QrReader as a named import
// import PropTypes from 'prop-types'
// import './QrScanner.css'

// const QrScanner = ({ onClose }) => {
//   const [scannedData, setScannedData] = useState(null)

//   const handleScan = (data) => {
//     if (data) {
//       setScannedData(data)
//       alert(`Scanned Data: ${data}`)
//       onClose() // Close the scanner after a successful scan
//     }
//   }

//   const handleError = (err) => {
//     console.error(err)
//   }

//   return (
//     <div
//       className="qr-scanner-modal"
//       style={{
//         position: 'fixed',
//         top: '0',
//         left: '0',
//         width: '100%',
//         height: '100%',
//         background: 'rgba(0, 0, 0, 0.5)',
//         // width: '100%',
//         // height: '100%',
//         display: 'flex',
//         justifyContent: 'center',
//       }}
//     >
//       <div
//         className="qr-scanner-content"
//         style={{ background: 'white', padding: '20px', borderRadius: '20px' }}
//       >
//         <QrReader
//           delay={300}
//           onError={handleError}
//           onResult={(result) => {
//             if (!!result) {
//               handleScan(result.text)
//             }
//           }}
//           style={{ width: '100%' }}
//         />
//         <button onClick={onClose}>Close</button>
//       </div>
//     </div>
//   )
// }

// QrScanner.propTypes = {
//   onClose: PropTypes.func.isRequired,
// }

// export default QrScanner
import React, { useState, useEffect } from 'react'
import { QrReader } from 'react-qr-reader'
import PropTypes from 'prop-types'
import './QrScanner.css'
import { NavLink, useNavigate } from 'react-router-dom'

const QrScanner = ({ onClose }) => {
  const [scannedData, setScannedData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkCameraAccess = async () => {
      try {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          console.log('Camera access granted')
          alert('Camera access granted')
          stream.getTracks().forEach((track) => track.stop())
        })
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

  // const handleScan = (data) => {
  //   if (data) {
  //     setScannedData(data)
  //     alert(`Scanned Data: ${data}`)
  //     navigate(`${data}`)
  //     onClose() // Close the scanner after a successful scan
  //   }
  // }

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
          constraints={{ facingMode: 'environment' }}
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
