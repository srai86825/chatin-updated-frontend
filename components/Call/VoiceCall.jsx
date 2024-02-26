import React, { useEffect } from "react";
import { Container } from "@/components/Call";
import { useGlobalContext } from "@/context/StateContext";

function VoiceCall() {
  const {
    state: { userInfo,currentChatUser, socket, voiceCall },
  } = useGlobalContext();

  useEffect(() => {
    if (voiceCall.callType==="voice" && voiceCall.type!=="in-coming") {
      socket.current.emit("outgoing-voice-call", {
        to:currentChatUser.id,
        from:{
          name:userInfo.name,
          image:userInfo.image,
          id:userInfo.id,
        },
        callType:voiceCall.callType,
        roomId:voiceCall.roomId
      })
    }
  }, []);

  return (
    <div>
      <Container data={voiceCall} />
    </div>
  );
}

export default VoiceCall;
