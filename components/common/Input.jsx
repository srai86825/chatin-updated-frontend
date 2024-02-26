import React from "react";

function Input({ name, state, setState, label = false }) {
  return (
    <div className="flex gap-1 flex-col">
      {label && (
        <label htmlFor={name} className="text-teal-light text-lg px-1">
          {name}
        </label>
      )}
      <div>
        <input
          type="text"
          className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
          name={name}
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Input;
