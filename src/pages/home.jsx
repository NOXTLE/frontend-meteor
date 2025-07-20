import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BG from "../assets/e5236015-1625-4afe-8b80-7796280c272b.jpg";
import Login from "../components/auth/login";
import Sign from "../components/auth/sign";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("info"));

    if (userInfo) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <div className="bg-zinc-950" style={{ backgroundImage: `url(${BG})` }}>
      <div className="h-screen text-white px-4 py-8 container max-w-xl mx-auto gap-5 flex flex-col">
        <div className="p-3 bg-violet-600 text-white rounded-lg flex justify-center items-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            {" "}
            <h1 className="txt">Meteor</h1>
          </div>
        </div>
        <div className="bg-transparent box  rounded-lg border-2-zinc-800 p-4 flex justify-center justify-self-center  items-center">
          <Tabs
            defaultValue="login"
            className="w-[100%]  gap-8  flex justify-center items-center"
          >
            <TabsList className=" text-white w-[80%] bg-violet-600">
              <TabsTrigger
                className="cursor-pointer data-[state=inactive]:text-white"
                value="login"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer data-[state=inactive]:text-white"
                value="sign"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="w-full flex justify-center ">
              <Login></Login>
            </TabsContent>
            <TabsContent className="w-full flex justify-center " value="sign">
              <Sign></Sign>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default home;
