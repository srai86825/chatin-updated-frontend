import React from "react";
import { ContactsList } from ".";
const Searchoverlay = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <ContactsList/>
    </div>
  );
};

export default Searchoverlay;
