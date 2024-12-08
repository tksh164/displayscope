import { createBrowserRouter } from "react-router";
import App from "./features/App/App";
import ScreenListView from "./features/ScreenList/ScreenListView/ScreenListView";
import InteractiveScreenView from "./features/InteractiveScreen/InteractiveScreenView/InteractiveScreenView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ScreenListView /> },
      { path: "interactive-screen", element: <InteractiveScreenView /> }
    ]
  }
]);
