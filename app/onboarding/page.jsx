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
  const [image, setImage] = useState(userInfo?.image || "/default_avatar.jpeg");
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
    // <div className="bg-panel-header-background h-screen w-screen flex flex-col justify-center items-center">
    //   <div className="flex items-center justify-center gap-2">
    //     <Image
    //       priority={true}
    //       src="/whatsapp.gif"
    //       alt="InstaChat"
    //       width={300}
    //       height={300}
    //     />
    //     <span className="text-7xl text-white">InstaChat</span>
    //   </div>
    //   <h2 className="text-2xl text-white">Create Profile</h2>
    //   <div className="flex mt-6 gap-6">
    //     <div className="flex flex-col items-center justify-center mt-5 gap-2">
    //       <Input name="Display Name" state={dName} setState={setDName} label />
    //       <Input name="About" state={about} setState={setAbout} label />
    //       <div className="flex items-center justify-center">
    //         <button
    //           className={`flex justify-center items-center bg-search-input-container-background text-white ${
    //             loading || !dName.length ? "opacity-40" : ""
    //           } gap-7 p-5 rounded-lg`}
    //           type="button"
    //           onClick={onBoardUserHandler}
    //           disabled={loading || !dName.length}
    //         >
    //           Create Profile
    //         </button>
    //       </div>
    //     </div>
    //     <div>
    //       <Avatar image={image} setImage={setImage} type="xl" />
    //     </div>
    //   </div>
    // </div>

    <section className="bg-white overflow-hidden h-screen">
      <div className="flex justify-between align-middle ">
        <div className="flex items-center justify-center m-auto   bg-white ">
          <div className="w-auto">
            <div className="flex flex-col">
            <div>
           <Avatar image={image} setImage={setImage} type="xl" />
        </div>
            <h2 className="text-5xl font-extrabold leading-tight text-blueshade ">
              Create your profile
            </h2>
            <p className="mt-2 text-base text-gray-600">
              Tell us a little about yourself{" "}
            
            </p>
            </div>
           

            <form action="#" method="POST" className="mt-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Display Name{" "}
                  </label>
                  <div className="mt-2.5 ">
                    
                    <Input
                      className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                      state={dName}
                      setState={setDName}
                      label
                    />
                    
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor=""
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Add Your Bio{" "}
                    </label>
                  </div>
                  <Input state={about} setState={setAbout}  label />
                 
                </div>

                <div>

                <button
              className={`flex justify-center items-center bg-chatpurple text-white ${
                loading || !dName.length ? "opacity-40" : ""
              } gap-7 px-8 py-3  rounded-2xl`}
              type="button"
              onClick={onBoardUserHandler}
              disabled={loading || !dName.length}
            >
              Create Profile
            </button>
                  
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-center    ">
          
            <img
              className="w-auto h-screen mx-auto"
              src="./3dillustration.jpg"
              alt="girl using lappy"
            />

          
        
        </div>
      </div>
    </section>
  );
};

export default OnboardingPage;
