"use client";
import React, { useRef, useEffect } from "react";
import ProfileCard from "./ProfileCard"; 

function ProfileOverlay({ user, showOverlay, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className={`${
        showOverlay
          ? "fixed inset-0 flex items-center justify-center"
          : "hidden"
      } bg-black bg-opacity-50 z-10`}
      onClick={onClose} // Close the overlay when clicked outside the ProfileCard
    >
      <div
        className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicked inside the ProfileCard
      >
        <ProfileCard user={user} /> {/* Render the ProfileCard component */}
      </div>
    </div>
  );
}

export default ProfileOverlay;
