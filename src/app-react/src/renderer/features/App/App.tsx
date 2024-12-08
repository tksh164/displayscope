import { useState, useEffect } from "react";
import { Outlet } from "react-router";

export default function App() {
  const [screenSpecs, setScreenSpecs] = useState([]);

  useEffect(() => {
    const getAllScreenSpecs = async () => {
      const allScreenSpecs = await window.exposedApi.getAllScreenSpecs(1000, 1000);
      setScreenSpecs(allScreenSpecs);
    };
    getAllScreenSpecs();
  }, []);

  return (
    <div style={{border: "solid 5px #ff0000"}}>
      <Outlet context={screenSpecs} />
    </div>
  );
}
