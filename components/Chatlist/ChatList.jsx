import React, { useEffect, useState } from "react";
import { ChatListHeader, ContactsList, List, SearchBar } from ".";
import { useGlobalContext } from "@/context/StateContext";

function ChatList() {
  const {
    state: { contactsPage },
  } = useGlobalContext();
  const [pageType, setPageType] = useState("default-page");

  useEffect(() => {
    if (!contactsPage) {
      setPageType("default-page");
    } else {
      setPageType("all-contacts");
    }
    // console.log(contactsPage,pageType);
  }, [contactsPage]);

  return (
    <section className="sticky min-w-[360px] right-0 top-0 z-20 flex w-fit flex-col justify-between  overflow-auto border-l border-l-dark-4   py-4   max-xl:hidden bg-blueshade s">
    
      <ChatListHeader />
      {pageType === "default-page" && (
        <>
          {/* <SearchBar isContactPage /> */}
          <List />
        </>
      )}
      {pageType === "all-contacts" && (
        <>
          <ContactsList />
        </>
      )}
   
    </section>
  );
}

export default ChatList;
