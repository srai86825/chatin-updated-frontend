"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useGlobalContext } from "@/context/StateContext";
import { Avatar, Input } from "@/components/common";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";

const OnboardingPage = () => {
  const router = useRouter();
  const {
    state: { userInfo },
    dispatch,
  } = useGlobalContext();

  const [dName, setDName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(userInfo?.image || "/default_avatar.png");
  const [loading, setLoading] = useState(false);

  const onBoardUserHandler = async () => {
    setLoading(true);
    if (validateUserProfile() && userInfo) {
      const email = userInfo.email;
      try {
        const {
          data: { user, status },
        } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          about,
          name: dName,
          profilePicture: image,
        });
        if (status) {
          await dispatch({ type: reducerCases.SET_NEW_USER, isNewUser: false });
          await dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              email,
              name: user.name,
              image: user.profilePicture,
              about: user.about,
              id: user.id,
            },
          });
          if (userInfo?.id && userInfo?.email) router.push("/");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.log("Error onboarding the user: ", error);
        router.push("/login");
      }
    } else {
      console.log("invalid userInfo client: ", userInfo);
    }
  };

  const validateUserProfile = () => {
    if (dName.length > 0 && image) {
      return true;
    } else {
      console.log("Invalid profile name:", dName, ", img: ", image);
      return false;
    }
  };

  useEffect(() => {
    if (userInfo?.id && userInfo?.email) {
      router.push("/");
    }
    if (!userInfo?.email) {
      router.push("/login");
    }
  }, [router, userInfo]);

  return (
    <div className="bg-panel-header-background h-screen w-screen flex flex-col justify-center items-center">
      <div className="flex items-center justify-center gap-2">
        <Image
          priority={true}
          src="/whatsapp.gif"
          alt="InstaChat"
          width={300}
          height={300}
        />
        <span className="text-7xl text-white">InstaChat</span>
      </div>
      <h2 className="text-2xl text-white">Create Profile</h2>
      <div className="flex mt-6 gap-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-2">
          <Input name="Display Name" state={dName} setState={setDName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              className={`flex justify-center items-center bg-search-input-container-background text-white ${
                loading || !dName.length ? "opacity-40" : ""
              } gap-7 p-5 rounded-lg`}
              type="button"
              onClick={onBoardUserHandler}
              disabled={loading || !dName.length}
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar image={image} setImage={setImage} type="xl" />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
