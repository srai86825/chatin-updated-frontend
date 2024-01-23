import { useGlobalContext } from "@/context/StateContext";
import { HOST_SERVER } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Avatar, MessageStatus } from "../common";
import { FaPlay, FaStop } from "react-icons/fa";
import formatTime from "@/utils/formatTime";
import { calculateTime } from "@/utils/CalculateTime";

function VoiceMessage({ msg }) {
  const {
    state: { currentChatUser, userInfo },
    dispatch,
  } = useGlobalContext();
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const waveFormRef = useRef(null);
  const waveform = useRef(null);

  //represents unique id, cuz there can be multiple waveforms in a chat
  const uid="waveformDiv"+Date.now().toString();

  useEffect(() => {
    if (!waveform.current) {
      waveform.current = WaveSurfer.create({
        // container: waveFormRef.current,
        container: document.getElementById(uid),
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true,
      });
      waveform.current.on("finish", () => {
        console.log("waveform finished");
        setIsPlaying(false);
      });
    }
    return () => {
      waveform.current.destroy();
    };
  }, []);

  useEffect(() => {
    const audioUrl = HOST_SERVER + "/" + msg.message;
    const audio = new Audio(audioUrl);
    setAudioMessage(audio);
    waveform.current.load(audioUrl);

    waveform.current.on("ready", () => {
      // console.log("waveform ready", audioUrl);
      setTotalDuration(waveform.current.getDuration());
    });
  }, [msg.message]);

  useEffect(() => {
    if (audioMessage) {
      const updatedPlayBackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatedPlayBackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatedPlayBackTime);
      };
    }
  }, [audioMessage]);

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.current.stop();
      audioMessage.pause();
      waveform.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };
  const handlePauseAudio = () => {
    waveform.current.pause();
    audioMessage.pause();
    setIsPlaying(false);
  };
  return (
    <div
      className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md ${
        msg.senderId === userInfo.id
          ? "bg-outgoing-background"
          : "bg-incoming-background"
      }`}
    >
      <div>
        <Avatar
          type="lg"
          image={
            msg.senderId === userInfo?.id
              ? userInfo.image
              : currentChatUser?.image
          }
        />
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaStop onClick={handlePauseAudio} />
        )}
      </div>
      <div className="flex relative">
        <div id={uid} className="w-60" ref={waveFormRef} />
        <div className="text-bubble-meta flex text-[11px] pt-1 justify-between absolute bottom-[-22px] w-full">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div className="gap-1 flex">
            <span>{calculateTime(msg.createdAt)}</span>
            {msg.senderId === userInfo.id && (
              <MessageStatus messageStatus={msg.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
