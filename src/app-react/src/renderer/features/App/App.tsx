import { useState } from "react";
import { Outlet } from "react-router";
import { ScreenSpec } from "src/main/types/screenSpec";

export default function App() {
  const [screenSpecs, setScreenSpecs] = useState<ScreenSpec[]>([]);
  const [currentScreenId, setCurrentScreenId] = useState<string>(null);

  return (
    <div style={{border: "solid 5px #ff0000"}}>
      <Outlet context={{ screenSpecs, setScreenSpecs, setCurrentScreenId }} />
    </div>
  );
}
