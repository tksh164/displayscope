import { useNavigate, useOutletContext } from "react-router";
import { Button } from "@fluentui/react-components";
import DisplayListHeader from "./DisplayListHeader";
import DisplayListItem from "./DisplayListItem";
import { ScreenSpec } from "../../../../main/types/screenSpec";

export default function DisplayList() {
  const screenSpecs = useOutletContext<ScreenSpec[]>();
  const navigate = useNavigate();
  return (
    <div style={{border: "solid 5px #00ff00"}}>
      <h2>DisplayList</h2>
      <Button appearance="primary" onClick={() => navigate("/interactive-view")}>InteractiveView</Button>
      <DisplayListHeader />
      {
        screenSpecs.map((screenSpec, i) => <DisplayListItem key={screenSpec.id} screenSpec={screenSpec} />)
      }
    </div>
  );
}
