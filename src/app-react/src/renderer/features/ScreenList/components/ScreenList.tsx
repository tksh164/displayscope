import { useNavigate, useOutletContext } from "react-router";
import { Button } from "@fluentui/react-components";
import ScreenListHeader from "./ScreenListHeader";
import ScreenListItem from "./ScreenListItem";
import { ScreenSpec } from "src/main/types/screenSpec";
import "../styles/ScreenList.css";

export default function ScreenList() {
  const screenSpecs = useOutletContext<ScreenSpec[]>();
  const navigate = useNavigate();
  return (
    <div style={{border: "solid 5px #00ff00"}}>
      <h2>ScreenList</h2>
      <Button appearance="primary" onClick={() => navigate("/interactive-view")}>InteractiveView</Button>
      <ScreenListHeader />
      <div className="screen-list">
        {
          screenSpecs.map((screenSpec, i) => <ScreenListItem key={screenSpec.id} screenSpec={screenSpec} />)
        }
      </div>
    </div>
  );
}
