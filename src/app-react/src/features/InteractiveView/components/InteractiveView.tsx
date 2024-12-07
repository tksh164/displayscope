import { Link } from "react-router";
import InteractiveViewHeader from "./InteractiveViewHeader";

export default function InteractiveView() {
    return (
        <div style={{border: "solid 5px #0000ff"}}>
            <h2>InteractiveView</h2>
            <Link to="/">DisplayList</Link>
            <InteractiveViewHeader />
        </div>
    );
}
