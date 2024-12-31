import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { OutletContext } from "../../../types/outletContext.d";
import InteractiveScreenHeader from "../InteractiveScreenHeader/InteractiveScreenHeader";
import ScreenVideo from "../ScreenVideo/ScreenVideo";
import { getScreenMediaStream, updateVideoElementBounds, setMouseCursorPosition, setMouseCursorPositionWhenNavigateByShortcutKey } from "./InteractiveScreen";
import "./InteractiveScreenView.css";

export default function InteractiveScreenView() {
  const { currentScreenSpec, isInteractiveScreenNavigatedByShortcutKey, setIsInteractiveScreenNavigatedByShortcutKey } = useOutletContext<OutletContext>();
  const [screenStream, setScreenStream] = useState<MediaStream>(null);

  //
  // Add and remove event listeners.
  //

  const windowResizeEventListener = (event: UIEvent) => {
    //console.log("Window resize event listener called.");
    updateVideoElementBounds(window);
  };
  const addEventListeners = () => {
    window.addEventListener("resize", windowResizeEventListener);
    //console.log("Add resize event listener to Window.");
  };
  const removeEventListeners = () => {
    window.removeEventListener("resize", windowResizeEventListener);
    //console.log("Remove resize event listener from Window.");
  };
  useEffect(() => {
    addEventListeners();
    return removeEventListeners;
  }, []);

  //
  // Refresh screen media stream.
  //

  const refreshScreenMediaStream = async (sourceId: string) => {
    const stream = await getScreenMediaStream(window, sourceId);
    setScreenStream(stream);
  };
  useEffect(() => {
    refreshScreenMediaStream(currentScreenSpec.id);
    //console.log("Refresh screen media stream");
  }, [currentScreenSpec]);

  //
  // Events for the video element.
  //

  const onCanPlayThrough = (event: React.SyntheticEvent) => {
    // Update the video element's bounds when the video can play through because video stream's width & height are need to calculate the video element's bounds.
    updateVideoElementBounds(window);

    // Set the mouse cursor position into the screen when the interactive screen navigated by the shortcut key.
    if (isInteractiveScreenNavigatedByShortcutKey) {
      // Set the mouse cursor position into the screen.
      setMouseCursorPositionWhenNavigateByShortcutKey(window, event, currentScreenSpec);

      // Reset the flag to indicate that the interactive screen is navigated by the shortcut key.
      setIsInteractiveScreenNavigatedByShortcutKey(false);
    }
  };

  const onClick = (event: React.MouseEvent) => {
    setMouseCursorPosition(window, event, currentScreenSpec);
  };

  //
  // Events for the header element.
  //

  const onMouseMove = (event: React.MouseEvent) => {
    window.document.getElementById("interactive-screen-header").classList.remove("hide-header");
  };

  const onMouseLeave = (event: React.MouseEvent) => {
    window.document.getElementById("interactive-screen-header").classList.add("hide-header");
  };

  return (
    <div id="screen-view-wrapper" className="screen-view-wrapper" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <ScreenVideo id="screen-video" className="screen-video" srcObject={screenStream} autoPlay={true} controls={false} onCanPlayThrough={onCanPlayThrough} onClick={onClick} />
      <InteractiveScreenHeader id="interactive-screen-header" />
    </div>
  );
}
