import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
  const {
    dispatch,
    state: { currentChatUser, messages },
  } = useGlobalContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [mappedMessages, setMappedMessages] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      setMappedMessages(
        messages.filter(
          (msg) =>
            msg.type === "text" &&
            msg.message.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        )
      );
      // console.log("Mapped messages",mappedMessages)
    } else {
      setMappedMessages([]);
    }
  }, [searchTerm]);

  const handleMsgClick = (id) => {
    const elm = document.getElementById(id);
    const container = document.getElementById("chat-container");
    if (elm && container) {
      container.scrollTop = elm.offsetTop;
      elm.classList.add("bg-panel-header-background");
      setTimeout(() => {
        elm.classList.remove("bg-panel-header-background");
      }, 1000);
    }
  };

  return (
    <div className="border-l-4 border-l-teal-200 z-10 max-h-screen border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col">
      <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
        <IoClose
          className="cursor-pointer text-icon-lighter text-2xl"
          onClick={() =>
            dispatch({ type: reducerCases.MESSAGE_SEARCH_APPLIED })
          }
        />
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex items-center flex-col w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
              </div>
              <div>
                <input
                  autoFocus
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Messages"
                  className="bg-transparent text-sm focus:outline-none text-white w-full"
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-secondary">
            {!searchTerm.length &&
              `Search Messages with ${currentChatUser.name}`}
          </span>
        </div>
        <div className="flex justify-center h-full flex-col">
          {searchTerm.length && !mappedMessages.length && (
            <span className="flex justify-center w-full text-secondary">{`No messages with term "${searchTerm}"`}</span>
          )}

          <div className="flex flex-col w-full h-full">
            {mappedMessages.map((msg) => {
              return (
                <div
                  onClick={() => handleMsgClick(msg.id)}
                  className="flex flex-col text-md cursor-pointer justify-center hover:bg-background-default-hover w-full p-5 border-b-[0.1px] border-secondary"
                >
                  <div className="text-sm text-secondary">
                    {calculateTime(msg.createdAt)}
                  </div>

                  <div className="text-icon-green">
                    {msg.message.length > 100
                      ? msg.message.substr(0, 100) + "..."
                      : msg.message}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMessages;
