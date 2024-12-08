import { useNavigate } from "react-router";
import { Button } from "@fluentui/react-components";
import InteractiveScreenHeader from "../InteractiveScreenHeader/InteractiveScreenHeader";

export default function InteractiveScreenView() {
    const navigate = useNavigate();
    return (
      <div style={{border: "solid 5px #0000ff"}}>
        <h2>InteractiveView</h2>
        <Button appearance="primary" onClick={() => navigate("/")}>ScreenList</Button>
        <InteractiveScreenHeader />
      </div>
    );
}
