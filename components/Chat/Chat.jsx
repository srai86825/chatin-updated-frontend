import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";

function Chat() {
  return (
             
   
      <div className=" flex min-h-screen w-full flex-1 flex-col items-center bg-dark-1 py-2 max-md:pb-32 sm:px-6">
        <section className="lowerchat rounded-3xl h-auto w-full ">
      <ChatHeader />
      
      <ChatContainer />
      <MessageBar />
      </section>
      
      
    </div>
  
    
  );
}

export default Chat;
