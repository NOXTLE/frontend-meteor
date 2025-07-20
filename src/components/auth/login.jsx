import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import axios from "axios";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const pwd = password;
    setloading(true);
    try {
      const res = await axios
        .post("http://localhost:8080/api/user/login", {
          email,
          pwd,
        })
        .then((data) => {
          console.log(data.data);
          localStorage.setItem("info", JSON.stringify(data.data));
          navigate("/chat");
          setloading(false);
        });
    } catch (err) {
      console.log("error");
      setloading(false);
    }
  };
  return (
    <div className="gap-4 flex flex-col items-center justify-center w-[90%]">
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="Email">Email</Label>
        <Input
          id="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[50px] rounded-md placeholder:text-white-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          type="text"
          placeholder="email"
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="password">Password</Label>

        <div className="flex items-center pr-2 w-full border-1 rounded-md">
          <Input
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[50px] rounded-md border-0 placeholder:text-white-100 shadow-none outline-0"
            type={showPassword ? "text" : "password"}
            placeholder="password"
          ></Input>
          <div
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            className="cursor-pointer text-white-100"
          >
            {showPassword ? <FaRegEye /> : <FaEyeSlash />}
          </div>
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        variant="outline"
        className=" mt-7 w-[85%] text-black hover:bg-green-300 cursor-pointer"
      >
        {loading ? (
          <div className="h-5 w-5 rounded-full border-black border-t-2 border-l-2 animate-spin"></div>
        ) : (
          "login"
        )}
      </Button>
    </div>
  );
};

export default login;
