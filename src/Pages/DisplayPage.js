import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import "./DisplayPage.css";

const DisplayPage = () => {
  /* To Do 

1. on message -> "photo" -> open webcam 
2. after 4 photos -> publish "done" 
3. on message -> send + phone number -> text api

*/
  const [images, setImages] = useState([]);
  const [counter, setCounter] = useState(0);
  const [active, setActive] = useState("done");
  const [success, setSuccess] = useState(null);

  const webcamRef = useRef(null);

  // const capture = useCallback(() => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setImages(i => [...i, imageSrc]);
  // }, [webcamRef]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (active === "webcam") {
        if (counter < 4) {
          const imageSrc = webcamRef.current.getScreenshot();
          setImages((i) => [...i, imageSrc]);
          setCounter((prevCounter) => prevCounter + 1);
        } else {
          setSuccess(true);
          setActive("review");
          clearInterval(interval);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [counter, active]);
  return (
    <div className="default-view">
      {active === "webcam" && (
        <div className="webcam-view">
          <span>{4 - counter} remaining</span>
          <Webcam
            audio={false}
            height={720}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
          />{" "}
        </div>
      )}
      {active === "home" && (
        <div className="default-view">
          <div className="info">
            <span className="heading">Welcome to the confessional</span>
            <span className="heading3">How It Works</span>
            <div className="steps">
              <span>Select Get Started</span>
              <span>Smile for 4 Photos</span>
              <span>
                Enter your phone number to get your pictures via text.
              </span>
            </div>
          </div>
          <div className="box">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      {active === "done" && (
        <div className="default-view">
          <div className="info">
          <span className="heading">Thank you for using The Confessional.</span>
            <span className="heading3">Enter your phone number</span>
            </div>
          <div className="box">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      {/* {images.map((i) => {
        return <img src={i} alt='captured-photo' />
      })} */}
      {/* {image && <img src={image} alt={'captured-img'}/>} */}
      {/* <button onClick={() => setActiveCamera(true)}>Capture photo</button> */}
    </div>
  );
};

export default DisplayPage;
