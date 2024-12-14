import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { OutletContext } from "src/renderer/types/outletContext";
import InteractiveScreenHeader from "../InteractiveScreenHeader/InteractiveScreenHeader";
import ScreenVideo from "../ScreenVideo/ScreenVideo";
import { getScreenMediaStream } from "./InteractiveScreen";

export default function InteractiveScreenView() {
  const { currentScreenId } = useOutletContext<OutletContext>();
  const [screenStream, setScreenStream] = useState<MediaStream>(null);

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
    <div style={{border: "solid 5px #0000ff"}}>
      <h2>InteractiveView</h2>
      <InteractiveScreenHeader />
      <ScreenVideo id="screen" srcObject={screenStream} autoPlay={true} controls={false} onCanPlayThrough={oncCanPlayThrough} />
    </div>
  );
}
