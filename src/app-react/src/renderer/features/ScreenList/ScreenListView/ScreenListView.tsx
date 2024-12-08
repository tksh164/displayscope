import { useNavigate, useOutletContext } from "react-router";
import { Button } from "@fluentui/react-components";
import { ScreenSpec } from "src/main/types/screenSpec";
import "./ScreenListView.css";
import ScreenListHeader from "../ScreenListHeader/ScreenListHeader";
import ScreenListItem from "../ScreenListItem/ScreenListItem";

export default function ScreenListView() {
  const screenSpecs = useOutletContext<ScreenSpec[]>();
  const navigate = useNavigate();
  return (
    <div style={{border: "solid 5px #00ff00"}}>
      <h2>ScreenList</h2>
      <Button appearance="primary" onClick={() => navigate("/interactive-screen")}>InteractiveScreen</Button>
      <ScreenListHeader />
      <div className="screen-list">
        {
          screenSpecs.map((screenSpec, i) => <ScreenListItem key={screenSpec.id} screenSpec={screenSpec} />)
        }
      </div>
    </div>
  );
}
