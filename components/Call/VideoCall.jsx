import React, { useEffect } from "react";
import Container from "@/components/Call/Container";
import { useGlobalContext } from "@/context/StateContext";

function VideoCall() {
  const {
    state: { userInfo, socket, videoCall,currentChatUser },
  } = useGlobalContext();

  useEffect(() => {
    // console.log("VideoCall",videoCall)
    if (videoCall.callType === "video" && videoCall.type!=="in-coming") {
      socket.current.emit("outgoing-video-call", {
        to: currentChatUser.id,
        from: {
          name: userInfo.name,
          image: userInfo.image,
          id: userInfo.id,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, []);
  return (
    <div>
      <Container data={videoCall} />
    </div>
  );
}

export default VideoCall;
