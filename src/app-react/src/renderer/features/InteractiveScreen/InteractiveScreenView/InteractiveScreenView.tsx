import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { OutletContext } from "src/renderer/types/outletContext";
import InteractiveScreenHeader from "../InteractiveScreenHeader/InteractiveScreenHeader";
import ScreenVideo from "../ScreenVideo/ScreenVideo";
import { getScreenMediaStream, updateVideoElementBounds, moveMouseCursorIntoScreen } from "./InteractiveScreen";
import "./InteractiveScreenView.css";

export default function InteractiveScreenView() {
  const { currentScreenSpec } = useOutletContext<OutletContext>();
  const [screenStream, setScreenStream] = useState<MediaStream>(null);

  //
  // Add and remove event listeners.
  //

  const addEventListeners = () => {
    window.addEventListener("resize", updateVideoElementBounds);
    console.log("Set resize event listener");
  };
  const removeEventListeners = () => {
    window.removeEventListener("resize", updateVideoElementBounds);
    console.log("Remove resize event listener");
  };
  useEffect(() => {
    addEventListeners();
    return removeEventListeners;
  }, []);

  //
  // Refresh screen media stream.
  //

  const refreshScreenMediaStream = async (sourceId: string) => {
    const stream = await getScreenMediaStream(sourceId);
    setScreenStream(stream);
  };
  useEffect(() => {
    refreshScreenMediaStream(currentScreenSpec.id);
    console.log("Refresh screen media stream");
  }, [currentScreenSpec]);

  //
  // Events for the video element.
  //

  const onCanPlayThrough = (event: React.SyntheticEvent) => {
    // Update the video element's bounds when the video can play through because video stream's width & height are need to calculate the video element's bounds.
    updateVideoElementBounds();
  };

  const onClick = (event: React.MouseEvent) => {
    moveMouseCursorIntoScreen(event, currentScreenSpec);
  }

  return (
    <div id="screen-view-wrapper" className="screen-view-wrapper">
      <ScreenVideo id="screen-video" className="screen-video" srcObject={screenStream} autoPlay={true} controls={false} onCanPlayThrough={onCanPlayThrough} onClick={onClick} />
      <InteractiveScreenHeader />
      </div>
  );
}
