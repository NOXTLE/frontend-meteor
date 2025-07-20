import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";

const sign = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [pic, setpic] = useState();
  const [loading, setloading] = useState(false);
  const [submitting, issubmitting] = useState(false);

  //function to upload image to cloudinary

  const upload = async (img) => {
    setloading(true);
    const formData = new FormData();
    formData.append("file", img);
    formData.append("upload_preset", "Chat_MERN");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/doa4ffp1m/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("image url", data.secure_url);
      setpic(data.secure_url);
      setloading(false);
    } catch (err) {
      console.log("errro");
      alert("something went wrong");
    }
  };

  // Function to handle form submission

  const handleSubmit = async (e) => {
    issubmitting(true);
    console.log(name, email, password, confirmPassword, pic);

    if (password != confirmPassword) {
      alert("Password didnt matched");
      issubmitting(false);
      return;
    }
    const pwd = password;
    const data = await axios
      .post("http://localhost:8080/api/user", { name, email, pwd, pic })
      .then((res) => res.data);

    console.log("data received", data);
    localStorage.setItem("info", JSON.stringify(data));
    issubmitting(false);
    setTimeout(() => {
      navigate("/chat");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-[90%] ">
      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="Name">Name</Label>
        <Input
          id="Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full h-[50px] rounded-md placeholder:text-white-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          type="text"
          placeholder="name"
        />
      </div>

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

      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="password">Confirm Password</Label>

        <div className="flex items-center pr-2 w-full border-1 rounded-md">
          <Input
            id="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-[50px] rounded-md border-0 placeholder:text-white-100 shadow-none outline-0"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="password"
          ></Input>
          <div
            onClick={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
            className="cursor-pointer text-white-100"
          >
            {showConfirmPassword ? <FaRegEye /> : <FaEyeSlash />}
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="picture">Picture</Label>
        {loading ? (
          <div className="h-10 w-10 border-b-2 border-l-2 rounded-full justify-self-center animate-spin "></div>
        ) : pic ? (
          <img className="h-20 w-20" src={pic}></img>
        ) : (
          <Input
            onChange={async (e) => {
              if (!e.target.files[0]) {
                return;
              }
              const img = e.target.files[0];
              await upload(img);
            }}
            id="picture"
            className="h-[50px] flex flex-col items-center justify-center p-2"
            type="file"
          />
        )}
      </div>

      {submitting ? (
        <div className="h-10 w-10 rounded-full border-l-2 border-b-2 animate-spin"></div>
      ) : (
        <Button
          onClick={handleSubmit}
          variant="outline"
          className=" mt-7 w-[85%] text-black hover:bg-violet-600 hover:text-white cursor-pointer"
        >
          Join The Party !
        </Button>
      )}
    </div>
  );
};

export default sign;
