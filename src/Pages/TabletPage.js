import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import "./TabletPage.css";

const TabletPage = () => {
  /* To Do 

1. on click -> sendMessage(photo)
2. on message -> done -> get number -> publish(number)

*/
  const sendText = async () => {
    return await fetch("https://mixingmos-api.vercel.app/textPhotosVideos", {
      method: 'POST',
      body: JSON.stringify({
        phone: '+18137149450'
      })
    }).then((res) => res.json())
  }
  //   return await fetch("https://mixingmos-api.vercel.app/textPhotosVideos", {
  //     method: "POST", // *GET, POST, PUT, DELETE, etc.
  //     mode: "no-cors", 
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: JSON.stringify({
  //       phone: '+18137149450'
  //     })
  //   }).then((res) => res.json())
  // }
  const [active, setActive] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length < 11) {
      setPhoneNumber(inputValue);
    }
   
    // Regular expression for validating phone numbers in the format (XXX) XXX-XXXX
    const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    setIsValid(phonePattern.test(inputValue));
  };

  useEffect(() => {
    const client = mqtt.connect("wss://192.168.0.170:8080");
    // Subscribe to a topic
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("confessional");
    });

    client.on('error', (err) => {
      console.error('Connection error: ', err);
      client.end();
    });

    // Handle incoming messages
    client.on("message", (topic, payload) => {
      console.log("Received message:", payload.toString());
      // Update React state or trigger actions based on the received message
      setActive(payload.toString());
    });
  });

  return (
    <div className="tablet-container">
    { active === "start" && <div className="btn-group">
        <button>Get Started</button>
      </div>}
      {active === "phone" && <div className="tablet-container">
        <span className="opt">By providing your phone number, you're opting in to receive text messages.</span>
        <input className="phone-input" type='tel' value={phoneNumber} onChange={handlePhoneNumberChange} />
        {isValid && <button className="primary" onClick={sendText}>Send Photos</button>}
      </div>}
    </div>
  );
};

export default TabletPage;
