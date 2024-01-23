import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_USERS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { ChatLIstItem } from ".";

function ContactsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContactUsers, setFilteredContactUsers] = useState([]);
  const {
    state: { userInfo },
    dispatch,
  } = useGlobalContext();

  useEffect(() => {
    // console.log("search query", searchQuery);
    const tempData = {};
    Object.keys(allContacts).map((key) => {
      tempData[key] = allContacts[key].filter(
        (usr) =>
          usr.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) &&
          usr.id !== userInfo.id
      );
      if (!tempData[key].length) delete tempData[key];
    });
    // console.log("filteredContactUsers", tempData);
    setFilteredContactUsers(tempData);
  }, [searchQuery]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { status, users },
        } = await axios.get(GET_ALL_USERS);

        // console.log(users, status);
        if (status) {
          setAllContacts(users);
          setFilteredContactUsers(users);
        } else console.log(users, status);
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, []);
  return (
    <div className="h-full flex flex-col border-t-2 border-teal-light pb-4">
      <div className="h-16 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => dispatch({ type: reducerCases.SET_ALL_CONTACTS })}
          />
          <span>New Chat</span>
        </div>
      </div>

      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center rounded-md gap-5 px-3 py-1 mx-4 flex-grow">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
            </div>
            <div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
              />
            </div>
          </div>
        </div>
        {userInfo && (
          <div className="pb-12">
            {Object.entries(filteredContactUsers)?.map(
              ([initial, users], i) => {
                return (
                  <div key={`${initial}-group-${i}`}>
                    <div className="text-teal-light pl-10 pt-5">{initial}</div>
                    {users?.map((user) => {
                      user.image = user.profilePicture;
                      return <ChatLIstItem key={user.id} data={user} />;
                    })}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactsList;
