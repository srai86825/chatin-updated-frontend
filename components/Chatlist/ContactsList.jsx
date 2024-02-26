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
    <div className="h-full flex flex-col min-w-[440px] border-t-2 m-auto pb-4">
      <div className="h-16 flex bg-blueshade items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => dispatch({ type: reducerCases.SET_ALL_CONTACTS })}
          />
          <span>New Chat</span>
        </div>
      </div>

      <div className=" bg-white h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          {/* <div className=" flex items-center rounded-md gap-5 px-3 py-1 mx-4 flex-grow"> */}
            {/* <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
            </div> */}
            <div className="container">
              <div className="search-container">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search Contacts"
                  className="bg-transparent text-sm focus:outline-none text-white w-full"
                />
                <svg viewBox="0 0 24 24" class="search__icon">
                  <g>
                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                  </g>
                </svg>
              </div>
            </div>
          {/* </div> */}
        </div>
        {userInfo && (
          <div className="pb-12">
            {Object.entries(filteredContactUsers)?.map(
              ([initial, users], i) => {
                return (
                  <div key={`${initial}-group-${i}`}>
                    <div className="text-blueshade bg- pl-10 pt-5">
                      {initial}
                    </div>
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
