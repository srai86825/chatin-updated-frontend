// StoryDetail.jsx
import React, { useState } from "react";
import { Avatar } from "../common";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { calculateTime } from "@/utils/CalculateTime";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const StoryDetail = ({ isOpen, onClose, user }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  if (!isOpen || !user) {
    return null;
  }

  const stories = user.stories || [];
  const currentStory = stories[currentStoryIndex];

  const handleNextStory = () => {
    setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const handlePrevStory = () => {
    setCurrentStoryIndex(
      (prevIndex) => (prevIndex - 1 + stories.length) % stories.length
    );
  };

  return (
    <div className="modal-overlay p-4 z-20 fixed inset-0 overflow-y-auto">
      <div className="group cursor-pointer bg-neutral-50 flex text-neutral-600 flex-col  gap-2 relative  shadow-md mx-auto h-[380px] w-[500px] overflowhidden my-10 max-w-[600px] p-10 rounded-2xl">
        {/* <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute blur opacity-60 fill-red-300 duration-500 group-hover:fill-purple-300 group-hover:scale-105"
        >
          <path
            transform="translate(100 100)"
            d="M39.5,-49.6C54.8,-43.2,73.2,-36.5,78.2,-24.6C83.2,-12.7,74.8,4.4,69,22.5C63.3,40.6,60.2,59.6,49.1,64.8C38.1,70,19,61.5,0.6,60.7C-17.9,59.9,-35.9,67,-47.2,61.9C-58.6,56.7,-63.4,39.5,-70,22.1C-76.6,4.7,-84.9,-12.8,-81.9,-28.1C-79,-43.3,-64.6,-56.3,-49.1,-62.5C-33.6,-68.8,-16.8,-68.3,-2.3,-65.1C12.1,-61.9,24.2,-55.9,39.5,-49.6Z"
          ></path>
        </svg> */}

        <div className="flex gap-10 glow justify-between align-middle">
          <div className=" rounded-full bg-blueshade p-0.5">
            <Avatar
              className="border-blueshade"
              image={user.profilePicture}
              type="lg"
            />
          </div>
          <div className="flex justify-center flex-col align-middle text-center my-auto  ">
            {" "}
            <div className="flex justify-between">
              <p className="text-blueshade font-bold text-2xl">
                {user.name}'s Stories
              </p>
            </div>
            <div className="flex  justify-between">
              <p className="text-gray-600 text-xs">
                Created {calculateTime(currentStory?.createdAt)}
              </p>
              <p className=" text-xs text-chatpurple ">
                ({currentStoryIndex + 1}/{stories.length})
              </p>
            </div>
          </div>
          <div className="flex my-auto">
            <IoIosCloseCircleOutline
              className="flex justify-end text-lg text-end text-blueshade font-semibold "
              onClick={onClose}
            />
          </div>
        </div>

        <div className="py-4 mt-4 min-h-48 custom-scrollbar flex justify-center align-middle overflow-y-scroll text-lg font-[400] text-black border-chatpurple scroll-m-1 rounded-xl ">
          {currentStory?.message}
        </div>
        <div className="flex justify-between my-4">
          {stories.length > 1 && (
            <>
              <FaArrowAltCircleLeft
                className="text-blueshade hover:text-chatpurple focus:outline-none text-xl "
                onClick={handlePrevStory}
              />

              <FaArrowAltCircleRight
                className="text-blueshade hover:text-chatpurple focus:outline-none text-xl "
                onClick={handleNextStory}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
