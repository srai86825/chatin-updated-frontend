"use client"

import React, { useState } from "react";
import { Avatar } from "../common";
import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function ProfileCard({ user }) {
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
    <div className="w-auto">
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img
          className="object-cover object-top w-full"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Mountain"
        />
      </div>
      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-chatpurple rounded-full overflow-hidden">
        <img
          className="object-cover object-center h-32"
          src={user.image}
          alt={user.name}
        />
      </div>
      <div className="text-center flex flex-col  mt-2 gap-2">
        <h2 className="font-bold text-2xl text-blueshade">{user.name}</h2>
        <p className="text-gray-500">{user.about}</p>
      </div>
      <div className="my-10 mt-8 border-t pt-8 flex items-center gap-2 justify-evenly">
        <div onClick={handleVoiceCall} className="flex flex-col cursor-pointer gap-2 items-center min-w-[58px] justify-between group">
          <img
            className="w-[35px] transform transition-all duration-300 ease-in-out group-hover:-translate-y-1 fill-current text-blue-900"
            src="./call.png"
            alt="Call"
          />
          <div className="text-sm font-semibold text-blueshade">Call</div>
        </div>
        <div className="flex gap-2 flex-col cursor-pointer items-center justify-around group">
          <img
            className="w-[35px] transform transition-all duration-300 ease-in-out group-hover:-translate-y-1 fill-current text-blue-900"
            src="./chat.png"
            alt="Message"
          />
          <div className="text-sm font-semibold text-blueshade">Message</div>
        </div>

        <div onClick={handleVideoCall} className="flex gap-2 flex-col cursor-pointer items-center justify-around group">
          <img
            className="w-8 fill-current text-blue-900 transform transition-all duration-300 ease-in-out group-hover:-translate-y-1"
            src="./vc.png"
            alt="Video Call"
          />
          <div className="text-sm font-semibold text-blueshade">
            Video Call
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
