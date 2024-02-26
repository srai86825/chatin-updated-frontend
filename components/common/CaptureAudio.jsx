import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import formatTime from "@/utils/formatTime";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPlay,
  FaStop,
  FaStopCircle,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({ setShowVoiceRecorder }) {
  const {
    state: { userInfo, currentChatUser, socket },
    dispatch,
  } = useGlobalContext();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    // console.log("wavesurfer.container when recording,:", wavesurfer.container);
    setWaveForm(wavesurfer);
    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });
    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveForm) {
      handleStartRecording();
      setIsRecording(true);
    }
  }, [waveForm]);

  useEffect(() => {
    if (recordedAudio) {
      const updatedPlayBackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatedPlayBackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatedPlayBackTime);
      };
    }
  }, [recordedAudio]);

  const handleStartRecording = () => {
    console.log("recording started");
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);

    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordedAudio(audio);
          waveForm.load(audioUrl);
        };
        mediaRecorder.start();
        // console.log("mediaRecorderRef at start", mediaRecorderRef);
      });
    } catch (error) {
      console.log("error accessing microphone", error);
    }
  };
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // console.log("stop recording");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", (event) => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    } else {
      console.log("cant stop recording", mediaRecorderRef, isRecording);
    }
  };

  const handlePlayRecording = () => {
    if (recordedAudio) {
      // waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };
  const handlePauseRecording = () => {
    waveForm.pause();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const sendRecording = async () => {
    // console.log("audio send request");
    const formData = new FormData();
    formData.append("audio", renderedAudio);
    const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        from: userInfo.id,
        to: currentChatUser.id,
      },
    });
    console.log(response);
    if (response.status === 201) {
      socket.current.emit("send-msg", {
        to: currentChatUser.id,
        from: userInfo.id,
        message: response.data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...response.data.message,
          fromSelf: true,
        },
      });
    }

    setShowVoiceRecorder(false);
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash
          className="cursor-pointer text-red-500"
          onClick={() => setShowVoiceRecorder(false)}
        />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background drop-shadow-lg rounded-full">
        {isRecording ? (
          <div className="text-red-500 animate-pulse text-center">
            Recording {recordingDuration}s
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay
                    className="cursor-pointer"
                    onClick={handlePlayRecording}
                  />
                ) : (
                  <FaStop
                    className="cursor-pointer"
                    onClick={handlePauseRecording}
                  />
                )}
              </>
            )}
          </div>
        )}

        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="px-3">
        {!isRecording ? (
          <FaMicrophone
            className="text-red-500 cursor-pointer"
            onClick={handleStartRecording}
          />
        ) : (
          <FaStopCircle
            className="text-red-500 cursor-pointer "
            onClick={handleStopRecording}
          />
        )}
      </div>
      <div>
        <MdSend
          onClick={sendRecording}
          className="text-panel-header-icon cursor-pointer mr-4"
          title="send"
        />
      </div>
    </div>
  );
}

export default CaptureAudio;
