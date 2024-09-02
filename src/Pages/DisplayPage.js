import React, { useState, useRef, useEffect, useCallback } from "react";
import photoboothImage from "../Resources/photobooth.jpg";
import confessionalLogo from "../Resources/confessional-logo.png";
import qrCode from "../Resources/qr.png";
import Webcam from "react-webcam";
import "./DisplayPage.css";
import mqtt from "mqtt";
import { useOutletContext } from "react-router-dom";

const DisplayPage = () => {
  /* To Do 

1. on message -> "photo" -> open webcam 
2. after 4 photos -> publish "done" 
3. on message -> send + phone number -> text api

*/
  const webcamRef = useRef(null);
  const { active, setActive, image, setImage, setUrl, url, sendText } =
    useOutletContext();
  const [counter, setCounter] = useState(0);
  const [success, setSuccess] = useState(null);

  const client = mqtt.connect("ws://192.168.0.170:8080");
  useEffect(() => {
    // Subscribe to a topic
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("confessional");
    });

    client.on("error", (err) => {
      console.error("Connection error: ", err);
      client.end();
    });

    // Handle incoming messages
    client.on("message", (topic, payload) => {
      console.log("Received message:", payload.toString());
      // Update React state or trigger actions based on the received message
      setActive(payload.toString());
    });
  }, []);

  // const capture = useCallback(() => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setImages(i => [...i, imageSrc]);
  // }, [webcamRef]);

  const videoConstraints = {
    width: 1280,
    height: "100%",
    facingMode: "user",
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 1920,
      height: 1080,
    });
    setImage(imageSrc);
    // const downloadUrl = `data:text/plain;base64,${imageSrc}`;
    // console.log(downloadUrl)
    // console.log(imageSrc);
    // setUrl(imageSrc);
    client.publish("confessional", imageSrc, () => {
      console.log("Message published");
    });
    setActive("done");
    // sendText(imageSrc)
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (active === "photo") {
  //       if (counter < 5) {
  //         setCounter((prevCounter) => prevCounter + 1);
  //       } else {
  //         client.publish("confessional", "done", () => {
  //           console.log("Message published");
  //           setActive("done");
  //         });
  //         capture();
  //       }
  //     }
  //     clearInterval(interval);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [counter, active]);
  return (
    <div className="default-view">
      {active === "photo" && (
        <div className="view">
          <div className="left-pane">
            <div className="left-pane-img">
              <Webcam
                ref={webcamRef}
                audio={false}
                height={720}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
                style={{
                  // objectFit: 'cover', // Optional: to cover the div without distortion
                  width: "100%",
                  height: "100%",
                }}
              />
              <button onClick={capture}>Take Photo</button>
            </div>
          </div>
          <div className="right-pane">
            <div className="right-pane-content">
              <div className="info">
                <span className="h1">Smile</span>
                <span className="h3">{`${5 - counter} seconds remaining`}</span>
              </div>
            </div>
          </div>
        </div>
        // <div className="webcam-view">
        //   <span>{4 - counter} remaining</span>
        //   <Webcam
        //     audio={false}
        //     height={720}
        //     ref={webcamRef}
        //     screenshotFormat="image/jpeg"
        //     width={1280}
        //     videoConstraints={videoConstraints}
        //   />
        // </div>
      )}
      {active === "home" && (
        <div className="default-view">
          <div className="view">
            <div className="left-pane">
              <div className="left-pane-img">
                <img src={photoboothImage} alt="booth" />
              </div>
            </div>
            <div className="right-pane">
              <div className="right-pane-content">
                <div>
                  <img src={confessionalLogo} alt="confessional-logo" />
                </div>
                {/* <div className="book-now">
                  <span>Reserve <b>The Confessional</b> for your next event at <a href="https://mixingmos.com">mixingmos.com</a></span>
                  <div className="qr-div">
                    <img src={qrCode} alt='qr' />
                  </div>
                </div> */}
              </div>
              {/* <div className="box">
                <span />
                <span />
                <span />
              </div> */}
            </div>
          </div>
          {/* <div className="info">
            <span className="heading">Welcome to The Confessional</span>
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
          </div> */}
        </div>
      )}
      {active === "done" && (
        <div className="default-view">
          <div className="view">
            <div className="left-pane">
              {image && (
                <div className="left-pane-img">
                  <img src={image} alt="take-photo" />
                </div>
              )}
            </div>
            <div className="right-pane">
              <div className="right-pane-content">
                <div className="info">
                  <span className="h1">Text Your Photos</span>
                  <span>
                    By providing your phone number, you agree to receive SMS
                    messages from us regarding updates, promotions, and other
                    information. Standard message and data rates may apply. You
                    can opt out at any time.
                  </span>
                  <a href={url} download="confessional-img.png">
                    {" "}
                    here is the link
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="info"> */}
          {/* <span className="heading">
              Thank you for using The Confessional.
            </span> */}
          {/* <div>
              <img src={confessionalLogo} alt="confessional-logo" />
            </div>
            <span className="heading3">Enter your phone number</span>
          </div>
          <div className="box">
            <span />
            <span />
            <span />
          </div> */}
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
