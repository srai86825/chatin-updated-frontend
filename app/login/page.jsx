"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";

import { reducerCases } from "@/context/constants";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { fireBaseAuth } from "@/utils/FirebaseConfig";
import { useGlobalContext } from "@/context/StateContext";

const LoginPage = () => {
  const {
    dispatch,
    state: { userInfo, isNewUser },
  } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (!isNewUser && userInfo?.id && userInfo?.email) {
      router.push("/");
    }
  }, [userInfo, isNewUser]);

  onAuthStateChanged(fireBaseAuth, async (crrUser) => {
    if (!userInfo && crrUser?.email) {
      const {
        data: { data, status },
      } = await axios.post(CHECK_USER_ROUTE, {
        email: crrUser.email,
      });

      if (status) {
        await dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            about: data.about,
            id: data.id,
            email: data.email,
            name: data.name,
            image: data.profilePicture,
          },
        });
        router.push("/");
      }
    }
  });

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const {
        user: { displayName: name, email, photoURL },
      } = await signInWithPopup(fireBaseAuth, provider);

      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        // console.log(data);

        if (!data.status) {
          await dispatch({ type: reducerCases.SET_NEW_USER, isNewUser: true });
          await dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              email,
              name,
              image: "/default_avatar.jpeg",
            },
          });
          router.push("/onboarding");
        } else {
          console.log("user found");
          await dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              email: data.data.email,
              name: data.data.name,
              image: data.data.profilePicture,
              about: data.data.about,
              id: data.data.id,
            },
          });
          // console.log(
          //   "userInfo set at login",
          //   userInfo,
          //   "but data: ",
          //   data.data
          // );
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white h-screen w-screen flex-col gap-6">
    <div className="flex justify-center items-center gap-2 text-white overflow-hidden h-[196px] pt-14 mb-3" >
      <Image src="/logologin.gif" alt="instaChat" width={400} height={300} />
      {/* <span className="text-7xl">InstaChat</span> */}
    </div>
    <button
      onClick={handleLogin}
      className="flex  items-center shadow gap-5 transition-all bg-[#fff7fe] py-2 px-5 rounded-3xl border-2 border-purple-600"
    >
      <FcGoogle className="text-4xl" />
      <span className="text-chatpurple text-xl font-semibold">Continue with Google</span>
    </button>
  </div>
  
  
  
  );
};

export default LoginPage;
