import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Button } from "@fluentui/react-components";
import DisplayListHeader from "./DisplayListHeader";
import DisplayListItem from "./DisplayListItem";

export default function DisplayList() {
    const navigate = useNavigate();
    return (
        <div style={{border: "solid 5px #00ff00"}}>
            <h2>DisplayList</h2>
            <Button appearance="primary" onClick={() => navigate("/interactive-view")}>InteractiveView</Button>
            <DisplayListHeader />
            <DisplayListItem />
            <DisplayListItem />
            <DisplayListItem />
        </div>
    );
}
