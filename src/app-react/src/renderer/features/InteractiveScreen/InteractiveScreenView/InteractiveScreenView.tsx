import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { OutletContext } from "src/renderer/types/outletContext";
import InteractiveScreenHeader from "../InteractiveScreenHeader/InteractiveScreenHeader";
import ScreenVideo from "../ScreenVideo/ScreenVideo";
import { getScreenMediaStream } from "./InteractiveScreen";
import "./InteractiveScreenView.css";

export default function InteractiveScreenView() {
  const { currentScreenId } = useOutletContext<OutletContext>();
  const [screenStream, setScreenStream] = useState<MediaStream>(null);

  // Add and remove event listeners.
  // const addEventListeners = () => {
  //   window.addEventListener("resize", setVideoElementBounds);
  //   console.log("Set resize event listener");
  // };
  // const removeEventListeners = () => {
  //   window.removeEventListener("resize", setVideoElementBounds);
  //   console.log("Remove resize event listener");
  // };
  // useEffect(() => {
  //   addEventListeners();
  //   return removeEventListeners;
  // }, []);

  // Refresh screen media stream.
  const refreshScreenMediaStream = async (sourceId: string) => {
    const stream = await getScreenMediaStream(sourceId);
    setScreenStream(stream);
  };
  useEffect(() => {
    refreshScreenMediaStream(currentScreenId);
    console.log("Refresh screen media stream");
  }, [currentScreenId]);

  // Paly screen media stream.
  const oncCanPlayThrough = () => {
    // const videoElement = document.getElementById("screen") as HTMLVideoElement;
    // videoElement.play();
    // console.log("Play stream");
  };

  return (
    <div className="screen-view-wrapper">
      <ScreenVideo id="screen" className="screen-video" srcObject={screenStream} autoPlay={true} controls={false} onCanPlayThrough={oncCanPlayThrough} />
      <InteractiveScreenHeader />
      </div>
  );
}
