"use client"
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { IoIosAddCircle } from 'react-icons/io';
import axios from 'axios';
import { useGlobalContext } from '@/context/StateContext';
import { ADD_STORY_ROUTE, FETCH_ALL_STORIES_ROUTE } from '@/utils/ApiRoutes';
import { Avatar } from '../common';
import StoryModal from './StoryModal';
import StoryDetail from './StoryDetail';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Story = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newStoryText, setNewStoryText] = useState('');
  const [stories, setStories] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { state, dispatch } = useGlobalContext();

  const {
    state: { userInfo },
  } = useGlobalContext();

  const fetchStories = async () => {
    try {
      const response = await axios.get(FETCH_ALL_STORIES_ROUTE);

      const userStoriesMap = new Map();

      response.data.forEach((user) => {
        const userId = user.id;

        const userStories = user.stories;

        if (userStories.length > 0) {
          const latestStory = userStories.reduce((latest, current) => {
            return current.createdAt > latest.createdAt ? current : latest;
          });

          userStoriesMap.set(userId, {
            ...user,
            latestStory,
          });
        }
      });

      const usersWithLatestStories = Array.from(userStoriesMap.values());
      setStories(usersWithLatestStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleAddStory = async () => {
    try {
      const response = await axios.post(ADD_STORY_ROUTE, {
        story: {
          senderId: userInfo?.id,
          message: newStoryText,
          type: 'string',
        },
      });

      setStories([response.data, ...stories]);

      dispatch({
        type: 'SET_LATEST_STORY',
        payload: response.data,
      });

      setModalOpen(false);
      setNewStoryText('');

      console.log('Story added successfully:', response.data);
    } catch (error) {
      console.error('Error adding story:', error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleStoryClick = (user) => {
    setSelectedUser(user);
  };

  const closeStoryDetail = () => {
    setSelectedUser(null);
  };

  const settings = {
    infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  initialSlide: 0,

  };

  return (
    <div className="my-4  ml-2">
      <Slider {...settings}>
        {/* "Create story" card */}
        <div
          key="create-story"
          className="p-4 rounded-2xl cursor-pointer shadow-md mb-4 flex justify-around align-middle flex-col !w-[141px] h-[110px]"
          onClick={() => setModalOpen(true)}
        >
          <IoIosAddCircle className="text-4xl mx-auto my-2 cursor-pointer text-chatpurple" />
          <p className="flex justify-center text-sm text-blueshade font-bold">Create story</p>
        </div>

        {/* Mapped story cards */}
        {stories.map((userWithLatestStory) => (
          <div
            key={userWithLatestStory.id}
            className="flex cursor-pointer flex-row"
            onClick={() => handleStoryClick(userWithLatestStory)}
          >
            <div
              id="story-container"
              className="p-4 rounded-2xl shadow-md mb-4 flex justify-center align-middle flex-col w-[141px] h-[110px]"
            > 
          
              <div className="flex gap-4 justify-between">
                <h1 className="text-md pt-4 font-semibold text-accent w-[43px]">
                  {userWithLatestStory.name?.split(' ')[0]}
                </h1>
                <div className="relative bottom-5 left-5 m-auto rounded-full bg-blueshade p-0.5">
                  <Avatar
                    className="border-blueshade"
                    image={userWithLatestStory.profilePicture}
                    type="lg"
                  />
                </div>
              </div>
              {userWithLatestStory.latestStory && (
                <div className="description text-sm mb-5">
                  {userWithLatestStory.latestStory.message.slice(0, 15)}
                  {userWithLatestStory.latestStory.message.length > 35 ? '...' : ''}
                </div>
              )}
            </div>


            
          </div>
        ))}
      </Slider>
      <StoryModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        newStoryText={newStoryText}
        setNewStoryText={setNewStoryText}
        handleAddStory={handleAddStory}
      />
      <StoryDetail isOpen={selectedUser !== null} onClose={closeStoryDetail} user={selectedUser} />
    </div>
  );
};

export default Story;
