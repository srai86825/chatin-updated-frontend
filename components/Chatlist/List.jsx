import { useGlobalContext } from "@/context/StateContext";
import reducer from "@/context/StateReducers";
import { reducerCases } from "@/context/constants";
import { GET_INTIAL_USERS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import { ChatLIstItem } from ".";

function List() {
  const {
    state: { userInfo, contactUsers,filteredContactUsers },
    dispatch,
  } = useGlobalContext();
  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const {
          data: { users, onlineUsers },
        } = await axios.get(`${GET_INTIAL_USERS_ROUTE}${userInfo.id}`);
        await dispatch({
          type: reducerCases.SET_CONTACT_USERS,
          contactUsers: users,
        });
        await dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      } catch (error) {
        console.log(error);
      }
    };
    if (userInfo) {
      fetchInitialUsers();
    }
  }, [userInfo]);

  return (
    <div className=" flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContactUsers.map((contact,i) => {
        contact.data["image"]=contact.data["profilePicture"];
        return (
          <ChatLIstItem isContactPage data={contact.data} key={`${contact.id}-contact-list-${i}`} />
        );
      })}
    </div>
  );
}

export default List;
