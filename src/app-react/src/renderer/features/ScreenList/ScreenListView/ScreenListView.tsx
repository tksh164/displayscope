import { useOutletContext } from "react-router";
import { ScreenSpec } from "src/main/types/screenSpec";
import "./ScreenListView.css";
import ScreenListHeader from "../ScreenListHeader/ScreenListHeader";
import ScreenListItem from "../ScreenListItem/ScreenListItem";

export default function ScreenListView() {
  const screenSpecs = useOutletContext<ScreenSpec[]>();
  return (
    <div style={{border: "solid 5px #00ff00"}}>
      <h2>ScreenList</h2>
      <ScreenListHeader />
      <div className="screen-list">
        {
          screenSpecs.map((screenSpec, i) => <ScreenListItem key={screenSpec.id} screenSpec={screenSpec} />)
        }
      </div>
    </div>
  );
}
