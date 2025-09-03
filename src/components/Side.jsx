import React, { useContext, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoChevronDownOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

import { IoClose } from "react-icons/io5";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Side = () => {
  const {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useContext(Context);
  const [visible, setVisible] = useState(false);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [position, setPosition] = React.useState("bottom");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("info");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      alert("Please enter something");
    } else {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://backend-meteor.onrender.com/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    }
  };

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const accessChat = async (userId) => {
    console.log(user.token);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "https://backend-meteor.onrender.com/api/chat",
        { userId },
        config
      );

      setOpen(false);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);

      console.log(chats);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-2.5 flex justify-between items-center ">
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="absolute bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl font-bold mb-4">My Profile</h2>
            <img
              src={user?.pic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mx-auto mb-4"
            />
            <div className="text-lg font-semibold text-black">
              Name: {user?.name}
            </div>
            <div className="text-gray-700 break-all">Email: {user?.email}</div>

            <button
              className="mt-6 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
              onClick={() => setVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div
        style={{ display: open == true ? "flex" : "none" }}
        className="w-[45%] min-xl:w-[25%] max-lg:w-[90vw]  absolute h-[90vh]  rounded-md bottom-10 max-md:bottom-5 flex flex-col bg-zinc-950/85 p-2 gap-2"
      >
        <div
          className="text-white self-end cursor-pointer animate-in"
          onClick={() => setOpen(false)}
        >
          <IoClose />
        </div>
        <input
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              setLoading(true);
              handleSearch();
            }
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="w-[80%] h-10 self-center bg-white  text-black px-2"
          placeholder="Search"
        ></input>
        <div className="mt-10 overflow-scroll bar flex flex-col gap-2  ">
          {!loading ? (
            searchResult.map((e) => {
              return (
                <div className=" rounded-md text-white flex items-center  h-18 p-3 justify-between self-center bg-zinc-900 w-[80%]">
                  <img className="w-10 h-10 rounded-full" src={e.pic}></img>
                  <div className="px-4 flex flex-col flex-1">
                    <h3>{e.name}</h3>
                    <h3 className="wrap-break-word ">{e.email}</h3>
                  </div>
                  <button
                    onClick={() => {
                      accessChat(e._id);
                    }}
                    className="px-2 bg-green-300 text-black w-[20%] rounded-md cursor-pointer"
                  >
                    Chat
                  </button>
                </div>
              );
            })
          ) : (
            <div className="h-20 w-20 border-l-2 border-t-2 border-white rounded-full animate-spin self-center justify-self-center "></div>
          )}
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger>
          <button
            className="flex items-center gap-2 bg-white text-black text-sm py-1 px-2 rounded-lg max-md:rounded-sm  cursor-pointer max-md:h-10"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <h3 className="max-md:hidden">Search</h3> <CiSearch />{" "}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Search People</p>
        </TooltipContent>
      </Tooltip>
      <div className="flex gap-2 items-center justify-center ">
        <h1>METEOR </h1>
        <img
          className="h-12 w-12"
          src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/294/636/datas/original.png"
        ></img>
      </div>{" "}
      <div className="flex items-center gap-2 ">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="relative">
              <FaBell className="text-white " />
              {notification.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
                  {notification.length}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Notifications </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {!notification.length ? (
              <DropdownMenuItem>No new Messages</DropdownMenuItem>
            ) : (
              notification.map((not, idx) => (
                <DropdownMenuItem
                  key={idx}
                  className="cursor-pointer whitespace-normal"
                  onClick={() => {
                    setSelectedChat(not.chat);
                    setNotification(notification.filter((e) => e !== not));
                  }}
                >
                  {not.chat.isGroupChat
                    ? `New message in ${not.chat.chatName}`
                    : `New message from ${getSender(user, not.chat.users)}`}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-white px-2 h-8 w-20 rounded-sm text-black flex  items-center">
              <img className="p-1 h-10" src={user.pic}></img>
              <IoChevronDownOutline />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setVisible(true)}
                      className="p-2 bg-gray-300 rounded-md"
                    >
                      Profile
                    </button>
                  </DialogTrigger>
                </Dialog>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem value="logout" onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-white px-2 h-8 w-20 rounded-sm text-black flex  items-center">
              <img className="p-1 h-10" src={user.pic}></img>
              <IoIosArrowDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 cursor-pointer">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="profile">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="p-2 bg-gray-300 rounded-md">
                      Profile
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>User Info</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <div className=" flex-1 flex-col gap-2 flex flex-wrap ">
                        <img src={user.pic}></img>
                        <div className="text-2xl">Name: {user.name}</div>
                        <div>Email: {user.email}</div>
                      </div>
                    </div>
                    <div className="flex"></div>

                    <DialogFooter className="sm:justify-around">
                      <DialogClose asChild>
                        <Button
                          className="bg-red-700 text-white"
                          type="button"
                          variant="secondary"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="logout" onClick={logout}>
                Logout
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
};

export default Side;
