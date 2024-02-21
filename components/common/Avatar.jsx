"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";

import { CapturePhoto, ContextMenu, PhotoLibrary, PhotoPicker } from ".";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCord, setContextMenuCord] = useState({ x: 0, y: 0 });
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [showCamera, setshowCamera] = useState(false);

  const contextMenuOptions = [
    {
      name: "Take Photo",
      callback: () => {
        setshowCamera(true);
        // console.log("Take Photo initiated");
      },
    },
    {
      name: "Change from Library",
      callback: () => {
        setShowPhotoLibrary(true);
        // console.log("Change from Library called");
      },
    },
    {
      name: "Upload Photo",
      callback: () => {
        setShowPhotoPicker(true);
        // console.log("Upload Photo called", showPhotoPicker);
      },
    },
    {
      name: "Remove Photo",
      callback: () => {
        setImage("/default_avatar.png");
      },
    },
  ];

  useEffect(() => {
    if (showPhotoPicker) {
      const fileInput = document.getElementById("photo-picker");
      fileInput.click();
      //added showPhotoPicker =false in onChangePhotoPicker
    }
  }, [showPhotoPicker]);

  const photoPickerChange = async (e) => {
    const file = await e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");

    reader.onload = (event) => {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    };

    reader.readAsDataURL(file);

    setTimeout(() => {
      setImage(data.src);
      setShowPhotoPicker(false);
    }, 100);
  };

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCord({ x: e.pageX, y: e.pageY });
  };

  return (
    <>
      <div className="flex justify-center items-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image | "/public/avatars/3.png"} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "lg" && (
             
          <div className="relative h-14 w-14">
            <Image
              src={image}
              alt="avatar"
              className="rounded-full"
              fill
            />
          </div>
        )}
        {type === "user" && (
          <div className="relative h-28 w-28">
    
            <Image
              src={image}
              alt="avatar"
              className="rounded-full"
              fill
            />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`z-10 text-white bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2
              ${hover ? "visible" : "hidden"}`}
              onClick={(e) => showContextMenu(e)}
            >
              <FaCamera className="text-2xl" id="context-opener" />
              <span className="text-sm">Change Profile Picture</span>
            </div>
            <div className="flex items-center justify-center h-60 w-60 relative">
              <Image
                src={image}
                alt="avatar"
                className="rounded-full"
                style={{ border: "1px solid white" }}
                fill
              />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          cord={contextMenuCord}
          options={contextMenuOptions}
          ContextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          photoLibraryVisiblity={setShowPhotoLibrary}
        />
      )}
      {showCamera && (
        <CapturePhoto setImage={setImage} cameraVisibility={setshowCamera} />
      )}
      {showPhotoPicker && <PhotoPicker onChange={photoPickerChange} />}
    </>
  );
}

export default Avatar;
