import { VideoHTMLAttributes, useEffect, useRef } from "react"

type ScreenVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream
};

export default function ScreenVideo({ srcObject, ...props }: ScreenVideoProps) {
  const refVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = srcObject;
  }, [srcObject]);

  return <video ref={refVideo} {...props} />
}
