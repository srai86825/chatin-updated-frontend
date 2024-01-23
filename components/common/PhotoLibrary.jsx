import Image from "next/image";
import React from "react";
import { IoClose } from "react-icons/io5";

function PhotoLibrary({ setImage, photoLibraryVisiblity }) {
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];

  const handleImageChange = (imgSrc) => {
    setImage(imgSrc);
    photoLibraryVisiblity(false);
  };
  return (
    <div className="fixed top-0 left-0 max-h-[100vh] max-w-[100vw] h-full w-full flex justify-center items-center">
      <div className="bg-gray-900 flex flex-col">
        <div
          className="pt-2 pe-2 h-full w-full rounded-lg gap-6 p-4 text-white cursor-pointer flex justify-end items-end"
          onClick={() => photoLibraryVisiblity(false)}
        >
          <IoClose />
        </div>
        <div className="p-6  grid grid-cols-3 justify-center items-center gap-16">
          {images.map((image, i) => {
            return (
              <div
                className="h-20 w-24 cursor-pointer relative"
                onClick={() => handleImageChange(image)}
              >
                <Image src={image} key={i} fill alt={`avatar-${i}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;
