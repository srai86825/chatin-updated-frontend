import { useGlobalContext } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React from "react";
import { MessageStatus } from "../common";

function ImageMessage({ msg }) {
  const {
    state: { currentChatUser, userInfo },
  } = useGlobalContext();

  return (
    <div
      className={`p-1 rounded-lg ${
        msg.senderId === userInfo.id
          ? "bg-outgoing-background"
          : "bg-incoming-background"
      }`}
    >
      <div className="relative">
        <Image
          src={process.env.NEXT_PUBLIC_HOST + "/" + msg.message}
          className="rounded-lg"
          alt={`${msg.message}`}
          height={300}
          width={300}
        />
        <div className="absolute bottom-0 right-0 min-w-full gap-1 bg-gray-500 bg-opacity-40 px-4">
          <div className="flex justify-end">
            <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
              {calculateTime(msg.createdAt)}
            </span>
            <span className="text-bubble-meta">
              {msg.senderId === userInfo.id && (
                <MessageStatus messageStatus={msg.messageStatus} />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageMessage;
