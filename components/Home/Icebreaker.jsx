"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiClipboard } from "react-icons/fi";
import axios from 'axios';
import { FETCH_FEED_ROUTE } from "@/utils/ApiRoutes";
import { useGlobalContext } from '@/context/StateContext';
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";

const Icebreaker = () => {
  const { state, dispatch } = useGlobalContext();
  const [icebreakers, setIcebreakers] = useState([]);
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [currentIcebreakerIndex, setCurrentIcebreakerIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchIcebreakers = async () => {
      try {
        const { data } = await axios(`${FETCH_FEED_ROUTE}/${state.userInfo?.id}`);
        dispatch({
          type: "SET_FETCHED_FEED",
          fetchedFeed: data,
        });
        
        console.log("Icebreakers fetched: ", data.icebreakerQuestion
        );
        setIcebreakers(data.icebreakerQuestion
          .options);
      } catch (error) {
        console.error("Error fetching icebreakers:", error);
      }
    };

    const { fetchedFeed, attemptedFeed } = state;
    if (!fetchedFeed || (attemptedFeed.wouldYouRather && attemptedFeed.icebreakers)) {
      console.log("Fetching icebreakers...");
      fetchIcebreakers();
      dispatch({
        type: "SET_ATTEMPTED_FEED",
        attemptedFeed: {
          wouldYouRather: false,
          icebreakers: false,
        },
      });
    } else {
      console.log("Already fetched icebreakers: ", fetchedFeed.icebreakers);
      setIcebreakers(fetchedFeed.icebreakers.options);
    }
  }, []);

  const handleTryNowClick = () => {
    setShowIcebreaker(true);
  };

  const handleNextIcebreaker = () => {
    setCurrentIcebreakerIndex((prevIndex) =>
      prevIndex === icebreakers.length - 1 ? 0 : prevIndex + 1
    );
    setIsCopied(false); 
  };

  const handlePreviousIcebreaker = () => {
    setCurrentIcebreakerIndex((prevIndex) =>
      prevIndex === 0 ? icebreakers.length - 1 : prevIndex - 1
    );
    setIsCopied(false); 
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(icebreakers[currentIcebreakerIndex]);
    setIsCopied(true); 
  };


  return (
    <section className="m-2 rounded-3xl flex flex-col lightbg gap-4">
      <div className="flex  align-middle flex-row justify-center gap-6">
        <div className="animation w-[400px]">
          <Image
            src="/animation.svg"
            alt="animation"
            width={400}
            height={400}
          />
        </div>
        
        {showIcebreaker ? (
          <div className="icebreaker-card flex gap-2 flex-col justify-center max-w-[500px] pr-4 ">
            <div className="cookieCard">
            <h3 className="text-lg font-semibold mb-2">
              
            </h3>
           

            
  <h2 className="text-white text-2xl font-semibold">Today's Icebreakers</h2>
  <p className=" text-white text-lg ">{icebreakers[currentIcebreakerIndex]}</p>
  <div className="flex justify-between w-full items-center">
  <button
                  onClick={handlePreviousIcebreaker}
                  className= "text-white bg-blueshade m-auto rounded-full transition-colors hover:bg-transparent hover:text-white"
                >
                  <FaRegArrowAltCircleLeft  className="text-2xl"/>
                </button>

              {/* <button
                onClick={handleCopyToClipboard}
                className="flex items-center bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300"
              >
                <FiClipboard className="mr-2" />
                {isCopied ? "Copied!" : "Copy to Clipboard"}
              </button> */}


<div className="centralize ">
  <div>
    <button onClick={handleCopyToClipboard}  >
      <span >
      Copy Content 
      </span>
      <span>Copied</span>
    </button>
  </div>
</div>

              <div className="flex gap-2">
                
                <button
                  onClick={handleNextIcebreaker}
                  className="text-white bg-blueshade transition-colors m-auto rounded-full hover:bg-transparent hover:text-white"
                >
                  <FaRegArrowAltCircleRight className="text-2xl" />
                </button>
                
              </div>
            </div>
  
</div>

          </div>
        ) : (
          <div className="icebreakerintro flex gap-2 flex-col justify-center max-w-[500px] pr-4">
            <h2 className="font-extrabold text-blueshade">
              <span>Icebreakers for you</span>
            </h2>
            <p className="text-md text-white">
              Don't know how to start a conversation or can't find things to say
              but want the conversation keep going? We got you. Try these amazing
              icebreakers.
            </p>

            <button
              onClick={handleTryNowClick}
              className="overflow-hidden w-32 p-2 h-12 bg-blueshade text-white border-none rounded-md text-lg font-bold cursor-pointer relative z-10 group"
            >
              <div className="flex items-center justify-center px-1">
                <p className="mr-1 text-xl">Try Now</p>
                <FaArrowRightLong className="animate-pulse-right" />
              </div>

              <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
              <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10">
                <div className="flex"></div>
                Explore!
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Icebreaker;
