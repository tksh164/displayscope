import { useState } from "react";
import { Outlet } from "react-router";
import { ScreenSpec } from "src/main/types/screenSpec";
import "./App.css";

export default function App() {
  const [screenSpecs, setScreenSpecs] = useState<ScreenSpec[]>([]);
  const [currentScreenSpec, setCurrentScreenSpec] = useState<ScreenSpec>(null);

  return (
    <div className="app-wrapper">
      <Outlet context={{ screenSpecs, setScreenSpecs, currentScreenSpec, setCurrentScreenSpec }} />
    </div>
  );
}
