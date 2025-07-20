import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Chats = ({ fetchAgain }) => {
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    useContext(Context);

  //States
  const [loggedUser, setLoggedUser] = useState();
  const [refresh, setRefresh] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();

  //function to search and show people who are being added to the group

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:8080/api/user?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (e) {}
  };

  const getSender = (loggedUser, users) => {
    if (!loggedUser || !users || users.length < 2) return "";
    return users[0]._id === loggedUser._id ? users[1]?.name : users[0]?.name;
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const getEmail = (loggedUser, users) => {
    if (!loggedUser || !users || users.length < 2) return "";
    return users[0]._id === loggedUser._id ? users[1]?.email : users[0]?.email;
    return users[0]._id === loggedUser._id ? users[1].email : users[0].email;
  };

  const getImage = (loggedUser, users) => {
    if (!loggedUser || !users || users.length < 2) return "";
    return users[0]._id === loggedUser._id ? users[1]?.pic : users[0]?.pic;

    return users[0]._id === loggedUser._id ? users[1]?.pic : users[0]?.pic;
  };
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:8080/api/chat",
        config
      );

      setChats(data);
      setRefresh(!refresh);
    } catch (err) {}
  };
  useEffect(() => {
    fetchChats();
    setLoggedUser(JSON.parse(localStorage.getItem("info")));
  }, [fetchAgain]);

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      alert("user already added");
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = (u) => {
    setSelectedUsers(selectedUsers.filter((usr) => usr._id !== u._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert("invalid operation");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:8080/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      alert("group chat created");
    } catch (error) {}
  };
  return (
    <div
      className={`${
        selectedChat ? "hidden" : "flex"
      } min-md:flex flex-col items-center max-md:w-full bg-white min-md:w-[30%] rounded-md`}
    >
      <div className="pb-3 pt-3 px-2 max-md:text-xl min-md:text-3xl flex w-full justify-between items-center text-black ">
        My Chats
        <Dialog>
          <DialogTrigger>
            <div className="flex text-md items-center-safe bg-black rounded-md text-white px-3 cursor-pointer hover:bg-green-400 hover:text-white py-2">
              <h3 className="text-sm">New Group Chat</h3>
              <IoMdAdd className="text-sm" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Hangout Zone</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col items-center gap-2">
                  <input
                    onChange={(e) => {
                      setGroupChatName(e.target.value);
                    }}
                    className="w-[80%] h-10 border-2 border-gray-300 placeholder:text-black rounded-md focus:border-blue-700 px-2"
                    placeholder="Name of the Group"
                  ></input>
                  <input
                    className="w-[80%] h-10 border-2  placeholder:text-black rounded-md border-gray-300 focus:border-blue-700 px-2"
                    placeholder="Add Participants"
                    onChange={(e) => {
                      handleSearch(e.target.value);
                    }}
                  ></input>
                  {loading ? (
                    <h1>loading</h1>
                  ) : (
                    searchResult?.slice(0, 4).map((user) => {
                      return (
                        <div
                          onClick={() => {
                            handleGroup(user);
                          }}
                          key={user._id}
                          className="flex px-4 py-2 rounded-md w-[90%] bg-gray-300 items-center gap-4 hover:bg-teal-400"
                        >
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user?.pic}
                          ></img>
                          <h2 className="flex-1 flex  text-black">
                            {user.name}
                          </h2>
                        </div>
                      );
                    })
                  )}
                  {/* {selected users} */}
                  {/* searched users */}
                  <div className="flex gap-2">
                    {" "}
                    {selectedUsers.map((u) => {
                      return (
                        <div
                          key={u._id}
                          className="flex px-2 py-1 bg-green-200 text-black rounded-lg items-center gap-2"
                        >
                          {u.name}
                          <button
                            className="hover:cursor-pointer text-red-700"
                            onClick={() => {
                              handleDelete(u);
                            }}
                          >
                            x
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-full flex items-center justify-center gap-4 mt-2">
                    <button
                      className="bg-green-600  w-[30%] px-4 py-2 hover:bg-green-700 cursor-pointer text-white rounded-md"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col p-3 bg-gray-200 w-full h-full rounded-lg overflow-hidden">
        {chats ? (
          <div className="overflow-scroll bar flex flex-col gap-2">
            {chats.map((e) => {
              return (
                <div
                  onClick={() => {
                    setSelectedChat(e);

                    setRefresh(!refresh);
                  }}
                  key={e._id}
                  className={` hover:bg-gray-300 cursor-pointer gap-2 text-black px-3 py-2 rounded-md h-15 flex items-center  border-2 border-gray-100
    ${selectedChat?._id === e._id ? "bg-teal-500 text-white" : "bg-white"}`}
                >
                  <img
                    className="h-10 w-10 rounded-full"
                    src={getImage(loggedUser, e.users)}
                  ></img>
                  <div>
                    <p className="text-gray-500">
                      {!e.isGroupChat
                        ? getSender(loggedUser, e.users)
                        : e.chatName}
                    </p>

                    {!e.isGroupChat ? (
                      <p>Email : {getEmail(loggedUser, e.users)}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          loading
        )}
      </div>
    </div>
  );
};

export default Chats;
