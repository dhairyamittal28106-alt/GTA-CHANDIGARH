import { useEffect, useState } from 'react'

interface PostcardModeProps {
  onClose: () => void
}

export function PostcardMode({ onClose }: PostcardModeProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const handleCapture = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
      setCapturedImage(dataUrl)
    }
  }

  useEffect(() => {
    handleCapture()
  }, [])

  const handleDownload = () => {
    if (!capturedImage) return
    const a = document.createElement('a')
    a.href = capturedImage
    a.download = `chandigarh-sector-17-postcard-${Date.now()}.jpg`
    a.click()
  }

  return (
    <div className="postcard-overlay">
      <div className="postcard-card">
        <div className="postcard-header">
          <span className="postcard-badge">CHANDIGARH POSTCARD · SOUVENIR</span>
          <button className="postcard-close" onClick={onClose}>✕</button>
        </div>

        <div className="postcard-content">
          {capturedImage ? (
            <div className="postcard-frame">
              <img src={capturedImage} alt="Sector 17 Snapshot" className="postcard-photo" />
              <div className="postcard-caption">
                <h3>GREETINGS FROM CHANDIGARH</h3>
                <p>SECTOR 17 CITY CENTRE · THE CITY BEAUTIFUL</p>
                <div className="postcard-stamp">
                  <span>POSTAGE</span>
                  <strong>SECTOR 17</strong>
                  <small>LE CORBUSIER</small>
                </div>
              </div>
            </div>
          ) : (
            <div className="postcard-prompt">
              <p>Ready to frame your moment in Sector 17 Plaza!</p>
              <button className="postcard-btn capture" onClick={handleCapture}>
                📸 Snap Postcard Photo
              </button>
            </div>
          )}
        </div>

        {capturedImage && (
          <div className="postcard-actions">
            <button className="postcard-btn retake" onClick={() => setCapturedImage(null)}>
              🔄 Retake
            </button>
            <button className="postcard-btn download" onClick={handleDownload}>
              💾 Save Souvenir
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
