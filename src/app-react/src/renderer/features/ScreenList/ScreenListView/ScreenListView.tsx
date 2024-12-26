import { useEffect } from "react";
import { useOutletContext } from "react-router";
import { OutletContext } from "src/renderer/types/outletContext";
import ScreenListHeader from "../ScreenListHeader/ScreenListHeader";
import ScreenListItem from "../ScreenListItem/ScreenListItem";
import "./ScreenListView.css";

export default function ScreenListView() {
  const { screenSpecs, setScreenSpecs, setCurrentScreenSpec } = useOutletContext<OutletContext>();

  // Refresh screen specs.
  const refreshScreenSpecs = async () => {
    const allScreenSpecs = await window.exposedApi.getAllScreenSpecs(1000, 1000);
    setScreenSpecs(allScreenSpecs);
    console.log("ScreenSpecs refreshed.");
  };
  useEffect(() => {
    refreshScreenSpecs();
  }, []);

  return (
    <div className="screen-list-view-wrapper">
      <ScreenListHeader refreshScreenSpecs={refreshScreenSpecs} />
      <div className="screen-list">
        {
          screenSpecs.map((screenSpec, i) => <ScreenListItem key={screenSpec.id} screenSpec={screenSpec} setCurrentScreenSpec={setCurrentScreenSpec} />)
        }
      </div>
    </div>
  );
}
