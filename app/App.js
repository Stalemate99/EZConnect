import React, { useState, useEffect } from "react";

export default function App() {
  const [devices, updateDevices] = useState(["KQ"]);
  const [mac, setMac] = useState("");

  useEffect(() => {
    Electron.receive("paired-devices", (data) => {
      updateDevices(data);
      console.log("Updated Devices");
    });
  }, []);

  const renderDevices = () => {
    return devices.map((device) => {
      return <p>{device}</p>;
    });
  };

  const handleConnect = () => {
    Electron.send("connect");
  };

  const handleDisconnect = () => {
    Electron.send("disconnect");
  };

  const handleSearch = () => {
    Electron.send("search");
  };

  const handleFind = () => {
    Electron.send("find", document.getElementById("macinp").value);
  };

  return (
    <div>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect</button>
      <p>
        Connected Devices <button onClick={handleSearch}>Search</button>
      </p>
      {renderDevices()}
      <p>Connect to your device: </p>
      <input id="macinp" type="text" />
      <button onClick={handleFind}>Find</button>
    </div>
  );
}
