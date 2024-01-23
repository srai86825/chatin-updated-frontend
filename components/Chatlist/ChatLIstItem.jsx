import React from "react";
import { Avatar, MessageStatus } from "../common";
import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import { BsImage } from "react-icons/bs";
import { BiSolidMicrophone } from "react-icons/bi";

function ChatLIstItem({ data, isContactPage = false }) {
  const {
    state: { userInfo, currentChatUser },
    dispatch,
  } = useGlobalContext();

  const handleInitiateChat = async () => {
    await dispatch({ type: reducerCases.CHANGE_CURRENT_CHAT_USER, user: data });
    if (!isContactPage) await dispatch({ type: reducerCases.SET_ALL_CONTACTS });
  };

  return (
    <div
      className={`flex  cursor-pointer border-b-2 border-gray-200  py-2 border-opacity-60 items-center hover:bg-background-default-hover`}
      onClick={handleInitiateChat}
    >
      <div className="min-w-fit px-5 pt-3 pb-1 ">
        <Avatar image={data.image} type="lg" />
      </div>
      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
        <div className="flex justify-between">
          <div>
            <span className="text-white text-xl font-semibold ">{data?.name || "Unknown User"}</span>
          </div>
          {isContactPage && <div>
            <span
              className={` text-sm ${
                data.totalUnreadMessages > 0
                  ? "text-icon-green"
                  : "text-gray-300"
              }`}
            >
              {calculateTime(data.createdAt)}
            </span>
          </div>}
        </div>
        <div className="flexx border-b border-conversation-border pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactPage ? (
                <span>
                  {data.type === "text" && (
                    <span className="flex text-white flex-row items-center">
                      {data.senderId === userInfo.id && (
                        <MessageStatus
                          className="mr-2"
                          messageStatus={data.messageStatus}
                        />
                      )}
                      {data.message.length > 30
                      ? data.message.substr(0, 30) + "..."
                      : data.message}
                    </span>
                  )}
                  {data.type === "image" && (
                    <span className="flex flex-row items-center">
                      {data.senderId === userInfo.id && (
                        <MessageStatus
                          className="mr-2"
                          messageStatus={data.messageStatus}
                        />
                      )}{" "}
                      <BsImage className="mr-5" /> Image
                    </span>
                  )}
                  {data.type === "audio" && (
                    <span className="flex flex-row items-center">
                      {data.senderId === userInfo.id && (
                        <MessageStatus
                          className="mr-2"
                          messageStatus={data.messageStatus}
                        />
                      )}{" "}
                      <BiSolidMicrophone className="mr-5" /> Voice
                    </span>
                  )}
                </span>
              ) : (
                data.about || "\u00A0"
              )}
            </span>
            {isContactPage && data.totalUnreadMessages > 0 && (
              <span className="px-2 bg-icon-green rounded-full">
                {data.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLIstItem;
