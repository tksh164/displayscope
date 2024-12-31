import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { ScreenSpec } from "src/main/types/screenSpec";
import "./App.css";

export default function App() {
  const [screenSpecs, setScreenSpecs] = useState<ScreenSpec[]>([]);
  const [currentScreenSpec, setCurrentScreenSpec] = useState<ScreenSpec>(null);
  const [isInteractiveScreenNavigatedByShortcutKey, setIsInteractiveScreenNavigatedByShortcutKey] = useState<boolean>(false);
  const navigate = useNavigate();

  //
  // Navigate to interactive screen view shortcut keys
  //

  // The event listener for navigate to interactive screen shortcut key pressed.
  const navigateToInteractiveScreenShortcutKeyPressed = (event: Electron.IpcRendererEvent, screenSpec: ScreenSpec) => {
    // Update the current screen spec then navigate to the interactive screen view.
    setCurrentScreenSpec(screenSpec);

    // Set the flag to indicate that the interactive screen is navigated by the shortcut key.
    setIsInteractiveScreenNavigatedByShortcutKey(true);

    navigate("/interactive-screen");
    //console.log("Navigated to the interactive screen directly by pressing the shortcut key.");
  };
  const addEventListeners = () => {
    window.exposedApi.navigateToInteractiveScreenShortcutKey.addPressedEventListener(navigateToInteractiveScreenShortcutKeyPressed);
    //console.log("Added NavigateToInteractiveScreenShortcutKeyPressed event listener.");
  };
  const removeEventListeners = () => {
    window.exposedApi.navigateToInteractiveScreenShortcutKey.removePressedEventListener(navigateToInteractiveScreenShortcutKeyPressed);
    //console.log("Removed NavigateToInteractiveScreenShortcutKeyPressed event listener.");
  };
  useEffect(() => {
    addEventListeners();
    return removeEventListeners;
  }, []);

  // The shortcut keys for navigate to interactive screen.
  const registerShortcutKeys = () => {
    window.exposedApi.navigateToInteractiveScreenShortcutKey.registerShortcutKeys(screenSpecs);
  };
  const unregisterShortcutKeys = () => {
    window.exposedApi.navigateToInteractiveScreenShortcutKey.unregisterShortcutKeys();
  };
  useEffect(() => {
    registerShortcutKeys();
    return unregisterShortcutKeys;
  }, [screenSpecs]);

  return (
    <div className="app-wrapper">
      <Outlet context={{
        screenSpecs,
        setScreenSpecs,
        currentScreenSpec,
        setCurrentScreenSpec,
        isInteractiveScreenNavigatedByShortcutKey,
        setIsInteractiveScreenNavigatedByShortcutKey
      }} />
    </div>
  );
}
