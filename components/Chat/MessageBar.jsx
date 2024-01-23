import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";

import { useGlobalContext } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import EmojiPicker from "emoji-picker-react";
import { PhotoPicker } from "../common";
import { CaptureAudio } from "../common";

function MessageBar() {
  const {
    state: { currentChatUser, userInfo, socket },
    dispatch,
  } = useGlobalContext();
  const emojiPickerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  useEffect(() => {
    if (showPhotoPicker) {
      const fileInput = document.getElementById("photo-picker");
      fileInput.click();
      //added showPhotoPicker =false in onChangePhotoPicker
      // setTimeout(() => setShowPhotoPicker(false), 1000); //if user opens the photo picker but then cancels the picker menu
    }
  }, [showPhotoPicker]);

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    // const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    // if(!allowedTypes.includes(file.type)) {
    //   alert("Only images are allowed")
    //   return;
    // }
    // console.log("Photo send request")
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        from: userInfo.id,
        to: currentChatUser.id,
      },
    });
    // console.log(response)
    if (response.status === 201) {
      socket.current.emit("send-msg", {
        to: currentChatUser.id,
        from: userInfo.id,
        message: response.data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...response.data.message,
          fromSelf: true,
        },
      });
    }
    setShowPhotoPicker(false);
  };

  //closing emojipicker after outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        e.target.id !== "emoji-open" &&
        !emojiPickerRef.current?.contains(e.target)
      ) {
        setEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleEmojiModal = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const sendMessage = async () => {
    if (message && userInfo && currentChatUser) {
      try {
        const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
          message,
          to: currentChatUser.id,
          from: userInfo.id,
        });
        // console.log(data);
        socket.current.emit("send-msg", {
          to: currentChatUser.id,
          from: userInfo.id,
          message: data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
            fromSelf: true,
          },
        });
        setMessage("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className=" box-shadow w-full bg-white  h-14 px-4 items-center gap-6 relative rounded-3xl flex mb-8">
      {!showVoiceRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-blueshade cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
            {emojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-24 left-16 z-40"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              className="text-panel-icon cursor-pointer text-xl"
              title="Attach file"
              onClick={() => setShowPhotoPicker(true)}
            />
          </div>
          <div className="w-full rounded-lg h-auto flex items-center">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type a message"
              autoFocus
              className=" text-sm focus:outline-none text-black h-10 rounded-lg px-5 py-4 w-full"
            />
          </div>
          <div className="flex  w-10 items-center justify-center">
            <button>
              {message?.length ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send Message"
                  onClick={sendMessage}
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-l"
                  title="Record"
                  onClick={() => setShowVoiceRecorder(true)}
                />
              )}
            </button>
          </div>
        </>
      )}
      {showPhotoPicker && <PhotoPicker onChange={photoPickerChange} />}
      {showVoiceRecorder && <CaptureAudio setShowVoiceRecorder={setShowVoiceRecorder} />}
    </div>
  );
}

export default MessageBar;
