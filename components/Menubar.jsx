"use client"
import { IoHomeOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { MdChecklist } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { PiGhost } from "react-icons/pi";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";


const iconMapping = [
  { icon: IoHomeOutline, label: "Home" },
  { icon: IoSearchOutline, label: "Search" },
  { icon: MdChecklist, label: "Plans" },
  { icon: PiGhost, label: "Ghost Mode" },
  { icon: IoSettingsOutline, label: "Settings" },
];

const Menubar = () => {
  const {state:{feedComponent},dispatch}=useGlobalContext();
  const router = useRouter();

  const handleItemClick = (label) => {
    console.log(`${label} clicked`);
    dispatch({type:reducerCases.SET_FEED_COMPONENT,feedComponent:label})
    dispatch({type:reducerCases.CHANGE_CURRENT_CHAT_USER,currentChatUser:undefined})
    

  };

  return (
    <div className="bg-chat-background h-[100%] bg-blueshade">
    <section className="custom-scrollbar min-w-[210px] flex  h-screen w-fit  flex-col justify-start gap-10 overflow-auto border-r border-r-dark-4 bg-blueshade bg-opacity-90 pb-5 pt-10 max-md:hidden">

      

      <div className="flex justify-center flex-col align-middle gap-3 ">
        <div className="flex gap-3 align-middle pb-5 px-6 mx-3 text-2xl font-semibold text-white ">
          ChatIn
        </div>

        {iconMapping.map(({ icon: IconComponent, label }) => (
          <div
            key={label}
            className={`cursor-pointer font-semibold transition-all duration-300 ease-out flex gap-3 rounded-xl align-middle text-white py-4 px-4 mx-3 ${feedComponent === label ? 'bg-white z-2  !text-blueshade !pl-2 ' : ''}`}
            onClick={() => handleItemClick(label)}
          >
            
            <div className="flex justify-center gap-1 align-middle">
            {feedComponent === label && <div className="h-full active w-2 bg-pinkshade"></div>}
              <IconComponent className="text-2xl font-extrabold" />
            </div>
            <p className="text-lg">{label}</p>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default Menubar;
