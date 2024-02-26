import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

function CapturePhoto({ setImage, cameraVisibility }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    const startCam = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      videoRef.current.srcObject = stream;
      //mirroring cam feed along x-axis
      videoRef.current.style.transform='scaleX(-1)'
    };
    startCam();
    return () => {
      stream?.getTracks()?.forEach((track) => track.stop());
    };
  }, []);
  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 300, 150);
    setImage(canvas.toDataURL("image/jpeg"));
    cameraVisibility(false);
  };

  return (
    <div className="absolute h-4/6 w-2/6 top-1/3 left-1/3 bg-gray-900 gap-3 rounded-lg pt-2 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-full">
        <div
          className="pt-2 pr-2 h-full w-full rounded-lg gap-6 p-4 text-white cursor-pointer flex justify-end items-end"
          onClick={() => cameraVisibility(false)}
        >
          <IoClose />
        </div>
        <div className="flex justify-center">
          <video id="video" width="400"  autoPlay ref={videoRef}></video>
        </div>
        <button
          onClick={capturePhoto}
          className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-10"
        ></button>
      </div>
    </div>
  );
}

export default CapturePhoto;
