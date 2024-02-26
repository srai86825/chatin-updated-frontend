"use client"
// ChatHeader.js
import React, { useState } from "react";
import { Avatar } from "../common";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ProfileOverlay from "../common/ProfileOverlay";

function ChatHeader() {
  const [showOverlay, setShowOverlay] = useState(false);

  const {
    state: { currentChatUser, onlineUsers },
    dispatch,
  } = useGlobalContext();

  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "voice",
        roomId: Date.now(),
      },
    });
  };

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };

  return (
    <>
      <div className="messagebar h-16 px-4 py-3 flex justify-between items-center w-full bg-white z-10 rounded-t-3xl">
        <div className="flex justify-center items-center gap-6">
          <div className="cursor-pointer" onClick={() => setShowOverlay(true)}>
          <Avatar 
            type="lg"
            image={currentChatUser?.image}
            
          />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-blueshade">
              {currentChatUser?.name || "Unknown User"}
            </span>
            <span className="text-secondary">
              {onlineUsers.includes(currentChatUser?.id) ? "online" : "offline"}
            </span>
          </div>
        </div>
        <div className="flex gap-6 ">
          <MdCall
            onClick={handleVoiceCall}
            className="text-blueshade cursor-pointer text-xl"
          />
          <IoVideocam
            onClick={handleVideoCall}
            className="text-blueshade cursor-pointer"
          />
          <BiSearchAlt2
            onClick={() =>
              dispatch({ type: reducerCases.MESSAGE_SEARCH_APPLIED })
            }
            className="text-blueshade cursor-pointer"
          />
          <BsThreeDotsVertical className="text-blueshade cursor-pointer" />
        </div>
      </div>
      <ProfileOverlay
        user={currentChatUser}
        showOverlay={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
    </>
  );
}

export default ChatHeader;
