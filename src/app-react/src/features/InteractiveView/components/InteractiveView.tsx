import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Button } from "@fluentui/react-components";
import InteractiveViewHeader from "./InteractiveViewHeader";

export default function InteractiveView() {
    const navigate = useNavigate();
    return (
        <div style={{border: "solid 5px #0000ff"}}>
            <h2>InteractiveView</h2>
            <Button appearance="primary" onClick={() => navigate("/")}>DisplayList</Button>
            <InteractiveViewHeader />
        </div>
    );
}
