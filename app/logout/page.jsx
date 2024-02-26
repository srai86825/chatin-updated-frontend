"use client";

import { useGlobalContext } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { fireBaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const {
    state: { userInfo, socket },
    dispatch,
  } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    socket.current.emit("signout", { id: userInfo.id });
    dispatch({ type: reducerCases.SET_USER_INFO, userInfo: undefined });
    signOut(fireBaseAuth);
    router.push("/login");
  }, [socket]);

  return (
    <div className=" bg-panel-header-background h-full w-full">
      Logging out...
    </div>
  );
};

export default Page;
