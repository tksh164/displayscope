import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { ScreenSpec } from "../../../../main/types/screenSpec";

export default function App() {
  const [screenSpecs, setScreenSpecs] = useState([] as ScreenSpec[]);

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
