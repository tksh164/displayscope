import { Link } from "react-router";
import DisplayListHeader from "./DisplayListHeader";
import DisplayListItem from "./DisplayListItem";

export default function DisplayList() {
    return (
        <div style={{border: "solid 5px #00ff00"}}>
            <h2>DisplayList</h2>
            <Link to="/interactive-view">InteractiveView</Link>
            <DisplayListHeader />
            <DisplayListItem />
            <DisplayListItem />
            <DisplayListItem />
        </div>
    );
}
