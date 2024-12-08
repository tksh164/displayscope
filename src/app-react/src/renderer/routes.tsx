import { createBrowserRouter } from "react-router";
import App from "./features/App/components/App";
import ScreenList from "./features/ScreenList/components/ScreenList";
import InteractiveView from "./features/InteractiveView/components/InteractiveView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ScreenList /> },
      { path: "interactive-view", element: <InteractiveView /> }
    ]
  }
]);
