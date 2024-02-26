import Image from "next/image";
import React from "react";

function Empty() {
  return (
    <div className="border-conversation-border border-l w-full bg-panel-header-background h-[100vh] border-b-8 border-b-icon-green flex flex-col justify-center items-center">
      <Image loading="eager" src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
    </div>
  );
}

export default Empty;
