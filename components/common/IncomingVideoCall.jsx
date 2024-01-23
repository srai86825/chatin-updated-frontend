import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Image from "next/image";
import React from "react";
import { IoVideocam } from "react-icons/io5";

function IncomingVideoCall() {
  const {
    state: { incomingVideoCall, socket },
    dispatch,
  } = useGlobalContext();

  const handleAcceptCall = async () => {
    // console.log("handle accept",incomingVideoCall.from)
    await dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...incomingVideoCall,
        type: "in-coming",
      },
    });
    socket.current.emit("accept-call", {
      id: incomingVideoCall.id,
    });
    // console.log("emitting socket id: ",incomingVideoCall.id)
    dispatch({
      type: reducerCases.SET_INCOMING_VIDEO_CALL,
      incomingVideoCall: undefined,
    });
  };

  const handleRejectCall = () => {
    socket.current.emit("reject-video-call", { from: incomingVideoCall.id });
    dispatch({ type: reducerCases.SET_END_CALL });
  };

  return (
    <div
      className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 
      bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14"
    >
      <div>
        <Image
          className="rounded-full"
          src={incomingVideoCall.image}
          alt={`${incomingVideoCall.name}'s avatar`}
          width={70}
          height={70}
        />
      </div>

      <div>
        <div>{incomingVideoCall.name}</div>
        <div className="text-sm">incoming Video call</div>
        <div className="flex mt-2 gap-2">
          <button
            onClick={handleRejectCall}
            className="bg-red-500 p-1 px-3 text-sm rounded-full"
          >
            Reject
          </button>
          <button
            onClick={handleAcceptCall}
            className="bg-green-500 flex flex-row justify-center items-center gap-1 p-1 px-3 text-sm rounded-full"
          >
            <IoVideocam className="" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingVideoCall;
