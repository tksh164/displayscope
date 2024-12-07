import { Outlet } from "react-router";

export default function App() {
    return (
        <div style={{border: "solid 5px #ff0000"}}>
            <Outlet />
        </div>
    );
}
