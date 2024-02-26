import { useEffect, useRef } from "react";
function ContextMenu({ cord, options, ContextMenu, setContextMenu }) {
  const contextMenuRef = useRef(null);
  const handleClick = (e, callback) => {
    e.preventDefault();
    setContextMenu(false);
    callback();
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      e.preventDefault();
      if (e.target.id !== "context-menu") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(e.target)
        )
          setContextMenu(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      //removing handleOutsideClick event listener after element is unmounted
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`}
      ref={contextMenuRef}
      style={{ top: cord.y, left: cord.x }}
    >
      <ul>
        {options.map(({ name, callback }, i) => {
          return (
            <li
              onClick={(e) => handleClick(e, callback)}
              key={i}
              className="text-white cursor-pointer px-5 py-2 my-2 hover:bg-background-default-hover"
            >
              <span>{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ContextMenu;
