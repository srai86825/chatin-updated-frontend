import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";

function SearchBar({isContactPage=false}) {
  const {state:{},dispatch}=useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(()=>{
    if(isContactPage) {
      dispatch({type:reducerCases.SET_SEARCH_CONTACT_USERS,filterQuery:searchQuery});
    }
  },[searchQuery])

  return (
    <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
        </div>
        <div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search or start a new Chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
          />
        </div>
      </div>
      <div className="pr-5 pl-3">
        <BsFilter className="bg-transparent text-sm focus:outline-none text-white w-full" />
      </div>
    </div>
  );
}

export default SearchBar;
