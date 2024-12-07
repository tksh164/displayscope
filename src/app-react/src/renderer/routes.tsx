import { createBrowserRouter } from "react-router";
import App from "./features/App/components/App";
import DisplayList from "./features/DisplayList/components/DisplayList";
import InteractiveView from "./features/InteractiveView/components/InteractiveView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DisplayList /> },
      { path: "interactive-view", element: <InteractiveView /> }
    ]
  }
]);
