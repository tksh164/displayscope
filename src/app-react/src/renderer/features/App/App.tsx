import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { ScreenSpec } from "src/main/types/screenSpec";
import "./App.css";

export default function App() {
  const [screenSpecs, setScreenSpecs] = useState<ScreenSpec[]>([]);
  const [currentScreenSpec, setCurrentScreenSpec] = useState<ScreenSpec>(null);
  const navigate = useNavigate();

  //
  // Navigate to interactive screen view shortcut keys
  //

  // The event listener for navigate to interactive screen shortcut key pressed.
  const navigateToInteractiveScreenShortcutKeyPressed = (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => {
    // Update the current screen spec then navigate to the interactive screen view.
    setCurrentScreenSpec(screenSpec);
    navigate("/interactive-screen");
    //console.log("Navigated to the interactive screen directly by pressing the shortcut key.");
  };
  const addEventListeners = () => {
    window.exposedApi.addNavigateToInteractiveScreenShortcutKeyPressedEventListener(navigateToInteractiveScreenShortcutKeyPressed);
    //console.log("Added NavigateToInteractiveScreenShortcutKeyPressed event listener.");
  };
  const removeEventListeners = () => {
    window.exposedApi.removeNavigateToInteractiveScreenShortcutKeyPressedEventListener(navigateToInteractiveScreenShortcutKeyPressed);
    //console.log("Removed NavigateToInteractiveScreenShortcutKeyPressed event listener.");
  };
  useEffect(() => {
    addEventListeners();
    return removeEventListeners;
  }, []);

  // The shortcut keys for navigate to interactive screen.
  const registerShortcutKeys = () => {
    window.exposedApi.registerNavigateToInteractiveScreenShortcutKeys(screenSpecs);
  };
  const unregisterShortcutKeys = () => {
    window.exposedApi.unregisterNavigateToInteractiveScreenShortcutKeys();
  };
  useEffect(() => {
    registerShortcutKeys();
    return unregisterShortcutKeys;
  }, [screenSpecs]);

  return (
    <div className="app-wrapper">
      <Outlet context={{ screenSpecs, setScreenSpecs, currentScreenSpec, setCurrentScreenSpec }} />
    </div>
  );
}
