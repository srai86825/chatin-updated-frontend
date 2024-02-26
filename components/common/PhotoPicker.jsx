import React from "react";
import ReactDOM from "react-dom";

function PhotoPicker({onChange}) {
  const component = (
    <input type="file" hidden onChange={onChange} id="photo-picker" />
  );
  return ReactDOM.createPortal(
    component,
    document.getElementById("photo-picker-element")
  );
}

export default PhotoPicker;
