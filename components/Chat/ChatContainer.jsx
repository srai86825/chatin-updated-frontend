import { useGlobalContext } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useRef } from "react";
import { MessageStatus } from "../common";
import countEmojis from "@/utils/countEmojis";
import { ImageMessage, VoiceMessage } from ".";

function ChatContainer() {
  const {
    state: { messages, currentChatUser, userInfo, unreadMessages },
    dispatch,
  } = useGlobalContext();

  useEffect(() => {
    const scrollBottom = () => {
      const container = document.getElementById("chat-container");
      container.classList.add("scroll-smooth");
      container.scrollTop =
        document.getElementById("messages-container").offsetHeight;
      container.classList.remove("scroll-smooth");
    };
    scrollBottom();
    // setTimeout(scrollBottom,600)
  }, [currentChatUser, messages]);

  return (
    <div
      id="chat-container"
      className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar  "
    >
      
      <div className="mx-10 my-6 relative bottom-0 left-0">
        <div className="flex w-full">
          <div
            id="messages-container"
            className="flex flex-col justify-end w-full gap-1 overflow-y-auto"
          >
            {messages?.map((msg, i) => {
              const totalEmojis = countEmojis(msg.message);

              return (
                <div
                  style={{ transition: "background-color 2s ease-in-out" }}
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === currentChatUser.id
                      ? "justify-start "
                      : "justify-end"
                  } bg-opacity-90 w-auto`}
                  id={msg.id}
                >
                  {msg.type === "text" && (
                    <div
                      className={`px-3 cursor-text recievedtext py-[7px] ${
                        msg.message.length <= 6 &&
                        totalEmojis * 2 == msg.message.length
                          ? "text-4xl"
                          : "text-sm"
                      }  flex gap-2 items-end max-w-[65%] ${
                        msg.senderId === currentChatUser.id
                          ? " bg-white text-chatpurple  rounded-t-3xl rounded-br-3xl"
                          : "bg-chatpurple text-white rounded-t-3xl rounded-bl-3xl"
                      }`}
                    >
                      <span className="break-all">{msg.message}</span>
                      <div className="flex gap-1 items-end">
                        <span className=" text-[10px] pt-1 min-w-fit text-gray-200">
                          {calculateTime(msg.createdAt)}
                        </span>
                        <span>
                          {msg.senderId === userInfo.id && (
                            <MessageStatus messageStatus={msg.messageStatus} />
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {msg.type === "image" && <ImageMessage msg={msg} />}
                  {msg.type === "audio" && <VoiceMessage msg={msg} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
