import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import formatTime from "@/utils/formatTime";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BsMic, BsMicMute } from "react-icons/bs";
import { MdCallEnd } from "react-icons/md";

function Container({ data }) {
  const {
    state: { socket, userInfo },
    dispatch,
  } = useGlobalContext();
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localstream, setLocalstream] = useState(undefined);
  const [publishstream, setPublishstream] = useState(undefined);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (data && data.type === "out-going") {
      socket.current.on("accepted-call", () => {
        setCallAccepted(true);
        console.log("The reciver accepted the call....");
      });
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
    // if (data) {
    //   console.log("data is: ", data);
    // }
  }, [data]);

  useEffect(() => {
    let interval;
    if (callAccepted) {
      const getToken = async () => {
        try {
          const {
            data: { token: returnedToken },
          } = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
          setToken(returnedToken);
        } catch (error) {
          console.log("error generating token: ", error);
        }
        interval = setInterval(() => {
          setCallDuration((p) => p + 1);
        }, 1000);
      };
      getToken();

      return () => {
        clearInterval(interval);
      };
    }
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          try {
            const zg = new ZegoExpressEngine(
              parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
              process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
            );
            setZgVar(zg);

            zg.on(
              "roomStreamUpdate",
              async (roomId, updateType, streamList, extendedData) => {
                if (updateType === "ADD") {
                  const rmVideo = document.getElementById("remote-video");
                  const vd = document.createElement(
                    data.callType === "video" ? "video" : "audio"
                  );
                  vd.id = streamList[0].streamID;
                  vd.autoplay = true;
                  vd.playsInline = true;
                  vd.muted = false;

                  if (rmVideo) {
                    rmVideo.appendChild(vd);
                  }
                  // console.log("REACHING HEREEEEEE");
                  zg.startPlayingStream(streamList[0].streamID, {
                    audio: true,
                    video: true,
                  })
                    .then((stream) => {
                      vd.srcObject = stream;
                      // console.log(
                      //   " HEREEEE video playing and stream: ",
                      //   stream
                      // );
                    })
                    .catch((err) => {
                      console.log(
                        "couldnt get video stream from startplayingStream: ",
                        err
                      );
                    });
                } else if (
                  updateType === "DELETE" &&
                  zg &&
                  localstream &&
                  streamList[0].streamID
                ) {
                  zg.destroyStream(localstream);
                  zg.stopPublishingStream(streamList[0].streamID);
                  zg.logoutRoom(data.roomId.toString());
                  dispatch({ type: reducerCases.SET_END_CALL });
                }
              }
            );

            await zg.loginRoom(
              data.roomId.toString(),
              token,
              { userID: userInfo.id, userName: userInfo.name },
              { userUpdate: true }
            );

            const localstream = await zg.createStream({
              camera: {
                audio: true,
                video: data.callType === "video" ? true : false,
              },
            });

            const localVideo = document.getElementById("local-audio");
            const videoElement = document.createElement(
              data.callType === "video" ? "video" : "audio"
            );
            videoElement.id = "video-local-zego";
            videoElement.class = "h-24 w-32";
            videoElement.style.width = "120px";
            videoElement.style.height = "80px";
            videoElement.autoplay = true;
            videoElement.muted = false;

            videoElement.playsInline = true;
            localVideo.appendChild(videoElement);

            const td = document.getElementById("video-local-zego");
            td.srcObject = localstream;
            const streamID = "123" + Date.now();
            setPublishstream(streamID);
            setLocalstream(localstream);
            zg.startPublishingStream(streamID, localstream);

            // console.log("setting LocalStream in startcall: ", localstream);
          } catch (e) {
            console.log("Error: ", e);
            console.error("Error: ", e);
          }
        }
      );
    };

    if (token) {
      try {
        startCall();
      } catch (error) {
        console.log("error starting call: " + error);
      }
    }
  }, [token]);

  useEffect(() => {
    const muteUnmute = async () => {
      if (isMuted && callAccepted) {
        // console.log("The localstream is: ",localstream)
        // await localstream.setAudioDevice("none");
      } else if (callAccepted && publishstream) {
        // zgVar.startPublishingStream(publishstream, localstream);
      } else {
        console.log(
          "Unable to mute/unmute: localstream",
          localstream,
          "publishstream",
          publishstream
        );
      }
    };
    muteUnmute();
  }, [isMuted]);

  const handleEndCall = () => {
    if (zgVar && localstream && publishstream) {
      zgVar.destroyStream(localstream);
      zgVar.stopPublishingStream(publishstream);
      zgVar.logoutRoom(data.roomId.toString());
    }

    // console.log(data)
    if (data.callType === "video") {
      socket.current.emit("reject-video-call", {
        from: data.id,
      });
    } else {
      socket.current.emit("reject-voice-call", {
        from: data.id,
      });
    }
    dispatch({ type: reducerCases.SET_END_CALL });
  };

  const handleMuteCall = () => {
    // setIsMuted((p) => !p);
    console.log("mute feature is not updated yet...");
  };

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.name}</span>
        <span id="outgoing-call-status" className="text-lg">
          {callAccepted ? "Ongoing call" : "Calling..."}
        </span>
        <span className="text-md text-white my-4">
          {formatTime(callDuration)}
        </span>
        {(!callAccepted || data.callType === "voice") && (
          <div className="my-24">
            <Image
              className="rounded-full"
              alt={`${data.name} avatar`}
              src={data.image}
              width={400}
              height={400}
            />
          </div>
        )}
        <div className="my-5 relative" id="remote-video">
          <div
            className={`absolute bottom-5 right-5 ${
              callAccepted && data.callType === "video" ? "w-32 h-24" : ""
            }`}
            id="local-audio"
          ></div>
        </div>
        <div className="flex flex-row gap-12">
          <div
            className="h-16 w-16 rounded-full bg-white flex flex-col justify-center items-center"
            onClick={handleMuteCall}
          >
            {isMuted ? (
              <BsMicMute
                className="text-4xl text-black cursor-pointer"
                title="mute"
                aria-disabled
              />
            ) : (
              <BsMic
                className="text-4xl text-black cursor-pointer"
                title="unmute"
                aria-disabled
              />
            )}
          </div>
          <div
            className="h-16 w-16 rounded-full bg-red-600 flex flex-col justify-center items-center"
            onClick={handleEndCall}
          >
            <MdCallEnd className="text-4xl cursor-pointer" title="end call" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container;
