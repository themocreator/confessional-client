import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import "./TabletPage.css";
import { useOutletContext } from "react-router-dom";

const TabletPage = () => {
  /* To Do 

1. on click -> sendMessage(photo)
2. on message -> done -> get number -> publish(number)

*/
  const { image, url, sendText} = useOutletContext()
  // const sendText = async () => {
  //   client.publish("confessional", "home", () => {
  //     console.log("Published...");
  //   });
    // fetch('https://mixingmos-api.vercel.app/textPhotosVideos', {
    // fetch('http://localhost:8080/textPhotosVideos', {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: 'POST', 
    //   body: JSON.stringify({
    //     phone: '+18137149450'
    //   })
    // })
    // return await fetch("http://localhost:8080/textPhotosVideos", {
    //   method: "POST", // *GET, POST, PUT, DELETE, etc.
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     phone: '+18137149450'
    //   })
    // })
    //   .then((res) => res.json())
    //   .then((res) => console.log(res));
  // };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { active, setActive } = useOutletContext();
  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length < 11) {
      setPhoneNumber(inputValue);
    }

    // Regular expression for validating phone numbers in the format (XXX) XXX-XXXX
    const phonePattern =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    setIsValid(phonePattern.test(inputValue));
  };
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
      console.log("Received message:", payload.toString())
      setActive(payload.toString())
      if (payload.toString() !== "photo" && payload.toString() !== 'home') {
        console.log('sending')
        sendText(payload.toString())
      }
      // if (active !== "photo" && active !== 'home') {
      //   console.log('sending')
      //   sendText(payload.toString())
      // }
      // Update React state or trigger actions based on the received message
    });
  });

  return (
    <div className="tablet-container">
      {active === "home" && (
        <div className="btn-group">
          <button
            onClick={() => {
              setActive("photo");
              client.publish("confessional", "photo", () => {
                console.log(`Message published`);
              });
            }}
          >
            Get Started
          </button>
        </div>
      )}
      {active === "photo" && <div>recording</div>}
      {active !== "photo" &&  active !== 'home' && (
        <div className="tablet-container">

          {console.log(url)}
          <a href={active} download='confessional-img.png'> here is the link</a>
          <input
            className="phone-input"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          {/* {isValid && ( */}
            <button className="primary" onClick={sendText}>
              Send Photos
            </button>
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default TabletPage;
