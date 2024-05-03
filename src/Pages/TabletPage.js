import React, { useEffect } from "react";
import mqtt from "mqtt";
import './TabletPage.css'

const TabletPage = () => {

  // const takePhoto = async () => {
  //   return await fetch("http://localhost:8080/takePhoto", {
  //     mode: "no-cors",
  //   });
  // };

  // const recordBoomerang = async () => {
  //   return await fetch("http://localhost:8080/takeBoomerang", {
  //     mode: "no-cors",
  //   });
  // };
  useEffect(() => {
      const client = mqtt.connect('ws://192.168.0.170:8080')
        // Subscribe to a topic
        client.on('connect', () => {
          console.log('Connected to MQTT broker');
          client.subscribe('confessional');
        });
    
        // Handle incoming messages
        client.on('message', (topic, payload) => {
          console.log('Received message:', payload.toString());
          // Update React state or trigger actions based on the received message
         console.log(payload.toString());
        });
  })
  
  return (
      <div className="tablet-container">
      <div className="btn-group">
              <button>Take a pic</button>
              <button>Record a video</button>
      </div>
    </div>
  );
};

export default TabletPage;
