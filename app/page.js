"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import Empty from "@/components/Empty";
import { ChatList } from "@/components/Chatlist";
import { reducerCases } from "@/context/constants";
import {
  CHECK_USER_ROUTE,
  GET_MESSAGES_ROUTE,
  HOST_SERVER,
} from "@/utils/ApiRoutes";
import { fireBaseAuth } from "@/utils/FirebaseConfig";
import { useGlobalContext } from "@/context/StateContext";
import { Chat, SearchMessages } from "@/components/Chat";
import { io } from "socket.io-client";
import VideoCall from "@/components/Call/VideoCall";
import { VoiceCall } from "@/components/Call";
import { IncomingCall, IncomingVideoCall } from "@/components/common";
import Menubar from "@/components/Menubar";
import Home from "@/components/Home/Home";

const App = () => {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const {
    state: {
      userInfo,
      currentChatUser,
      messageSearchApplied,
      videoCall,
      incomingVideoCall,
      voiceCall,
      incomingVoiceCall,
      feedComponent
    },
    dispatch,
  } = useGlobalContext();
  const router = useRouter();
  const socket = useRef();
  const [socketEvent, setSocketEvent] = useState(false);

  useEffect(() => {
    if (redirectLogin) {
      router.push("/login");
    }
  }, [redirectLogin]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST_SERVER);
      socket.current.emit("add-user", userInfo.id);
      // console.log(socket.current);
      dispatch({ type: reducerCases.SET_SOCKET, socket });
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("rcv-msg", (data) => {
        // console.log(socket.current);
        // console.log("message received", data);
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });

      socket.current.on("rcv-voice-call", (data) => {
        console.log("recieving voice call");
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: {
            ...data.from,
            roomId: data.roomId,
            callType: data.callType,
          },
        });
      });

      socket.current.on("rcv-video-call", (data) => {
        console.log("recieving video call");
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: {
            ...data.from,
            roomId: data.roomId,
            callType: data.callType,
          },
        });
      });

      socket.current.on("rejected-voice-call", () => {
        dispatch({ type: reducerCases.SET_END_CALL });
      });

      socket.current.on("rejected-video-call", () => {
        dispatch({ type: reducerCases.SET_END_CALL });
      });

      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    const getMessages = async () => {
      if (currentChatUser && userInfo) {
        console.log("from:" + userInfo.id, "to:", currentChatUser.id);

        const {
          data: {
            status,
            messages: { allMessages, unreadMessages },
          },
        } = await axios.get(
          `${GET_MESSAGES_ROUTE}/${currentChatUser.id}/${userInfo.id}`
        );
        // console.log(data);
        if (status) {
          await dispatch({
            type: reducerCases.SET_MESSAGES,
            messages: allMessages,
          });
          await dispatch({
            type: reducerCases.SET_UNREAD_MESSAGES,
            unreadMessages: unreadMessages,
          });
        }
      } else {
        console.log("not enough data to fetch");
      }
    };
    getMessages();
  }, [currentChatUser]);

  onAuthStateChanged(fireBaseAuth, async (crrUser) => {
    if (!crrUser) {
      setRedirectLogin(true);
    }
    if (!userInfo && crrUser?.email) {
      const {
        data: { data, status },
      } = await axios.post(CHECK_USER_ROUTE, {
        email: crrUser.email,
      });

      if (!status) {
        router.push("/login");
      }
      await dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: {
          about: data.about,
          id: data.id,
          email: data.email,
          name: data.name,
          image: data.profilePicture,
        },
      });
    }
  });

  return (
    <>
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}

      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}

      {!voiceCall && !videoCall && (
        // <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <div className="flex flex-row">
          <Menubar/>
          {/* <ChatList /> */}
          {currentChatUser ? (
            <>
             <section className='main-container'>
            <div className={messageSearchApplied ? "grid grid-cols-2" : ""}>
              
              <Chat />
              {messageSearchApplied && <SearchMessages />}
            </div>
            </section>
            </>
          ) : (
            <>
            {/* <Empty /> */}
            <Home/>

            </>
          )}
          <ChatList/>
        </div>
      )}
    </>
  );
};

export default App;
