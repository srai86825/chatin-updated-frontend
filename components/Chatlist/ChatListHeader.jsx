"use client";
import React, { useState } from "react";
import { Avatar, ContextMenu } from "../common";
import { useGlobalContext } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/navigation";

function ChatListHeader() {
  const {
    state: { userInfo },
    dispatch,
  } = useGlobalContext();

  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCord, setContextMenuCord] = useState({ x: 0, y: 0 });
  const router = useRouter();

  const handleAllContactsClick = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS });
  };
  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCord({ x: e.pageX, y: e.pageY });
  };

  const contextMenuOptions = [
    {
      name: "Log out",
      callback: () => {
        setIsContextMenuVisible(false);
        router.push("/logout");
        console.log("Take Photo initiated");
      },
    },
  ];

  return (
    <div className="h-46 px-4 my-6 flex flex-col  justify-between items-center">
      <div className="flex flex-col items-center justify-center">
        <div
          className="cursor-pointer m-auto p-1 bg-white rounded-full"
          onClick={showContextMenu}
        >
          {userInfo && <Avatar type="user" image={userInfo?.image} />}
          {!userInfo && <Avatar type="lg" image="/default_avatar.jpeg" />}
        </div>

        {userInfo && <p className="text-gray-100 font-bold">{userInfo.name}</p>}
        {userInfo && <p className="text-gray-400 text-sm">{userInfo.about}</p>}
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactsClick}
        />
        <>
          {/* <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
            onClick={showContextMenu}
            id="context-opener"
          /> */}

          {isContextMenuVisible && (
            <ContextMenu
              cord={contextMenuCord}
              options={contextMenuOptions}
              ContextMenu={isContextMenuVisible}
              setContextMenu={setIsContextMenuVisible}
            />
          )}
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;
