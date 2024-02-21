import React from "react";

const StoryModal = ({
  isModalOpen,
  setModalOpen,
  newStoryText,
  setNewStoryText,
  handleAddStory,
}) => {
  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay   z-10">
          <div className="modal-content min-h-30 flex flex-col  gap-4">
            <div class="webflow-style-input">
              <input
                class="min-h-[100px] outline-none text-start !bg-transparent text-blueshade"
                value={newStoryText}
                onChange={(e) => setNewStoryText(e.target.value)}
                placeholder="Write your story..."
              ></input>
            </div>
            <div className="flex flex-row justify-between ">
              
              <button onClick={handleAddStory} class="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95">
                <span class="w-full h-full flex items-center gap-2 px-4 py-1 bg-[#B931FC] font-semibold text-[#fcf6ff] rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]">
                  Submit 
                </span>
              </button>
              <button onClick={() => setModalOpen(false)} class="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px]  bg-gradient-to-t from-[#f5e2ff] to-[#fbf4ff] active:scale-95">
                <span class="w-full h-full flex items-center gap-2 px-4 py-1 bg-[#f9eeff] font-semibold text-chatpurple border-chatpurple border-[2px] border-opacity-30 rounded-[14px] bg-gradient-to-t from-[#fffafa] to-[#fbf2ff]">
                  Cancel
                </span>
              </button>

              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryModal;
