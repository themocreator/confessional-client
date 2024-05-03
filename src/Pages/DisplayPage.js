import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'

const DisplayPage = () => {
  const [image, setImage] = useState([])
  const webcamRef = useRef(null)
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImage(imageSrc)
  }, [webcamRef]);
  
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <div>
  <Webcam
      audio={false}
      height={720}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      width={1280}
    videoConstraints={videoConstraints}
    />
      {image && <img src={image} alt={'captured-img'}/>}
    <button onClick={capture}>Capture photo</button>
    </div>
  )
}

export default DisplayPage
