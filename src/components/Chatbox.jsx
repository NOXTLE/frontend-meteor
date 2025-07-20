import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { FaEye } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ScrollableFeed from "react-scrollable-feed";
import io from "socket.io-client";

//modal import

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

const ENDPOINT = "https://backend-meteor.onrender.com";
var socket, selectedChatCompare;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [searchResult, setSearchResult] = useState();

  const [loading, setLoading] = useState();
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

  const [socketConnected, setSocketConnected] = useState(false);

  const [search, setSearch] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [typing, setTyping] = useState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => setTyping(true));
    socket.on("stop typing", () => setTyping(false));
  }, []);

  const handleDelete = (u) => {
    setSelectedUsers(selectedUsers.filter((usr) => usr._id !== u._id));
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendMessage = async (e) => {
    if (e.key == "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `https://backend-meteor.onrender.com/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        setNewMessage("");

        socket.emit("new message", data);
        setMessages([...messages, data]);

        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  //sameSender
  const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };

  //same sender
  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  //last message
  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };
  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      alert("user already added");
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  //rename function

  const handleRename = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `https://backend-meteor.onrender.com/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
    }
    setGroupChatName("");
  };

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
        `https://backend-meteor.onrender.com/api/user?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (e) {}
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `https://backend-meteor.onrender.com/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    setGroupChatName("");
  };

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const getEmail = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].email : users[0].email;
  };
  const getImage = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  };

  const [selectedUsers, setSelectedUsers] = useState([]);
  useEffect(() => {
    setSelectedUsers(selectedChat?.users);
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert("already a member");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("only admin can add");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `https://backend-meteor.onrender.com/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://backend-meteor.onrender.com/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {}
  };

  return (
    <div
      className={`${
        selectedChat ? "max-md:flex" : "max-md:hidden"
      } min-md:flex bg-white max-md:w-full min-md:w-[68%] rounded-md p-4 text-black flex items-center justify-center`}
    >
      {selectedChat ? (
        <div className="flex h-full w-full flex-col bg-white ">
          <div className="flex w-full justify-between text-black p-3 max-md:p-2">
            <div className="flex justify-between w-full">
              <button className="max-md:flex min-md:hidden">back</button>
              <h1 className=" text-lg max-md:text-md  ">
                {!selectedChat.isGroupChat ? (
                  <>{getSender(user, selectedChat.users)}</>
                ) : (
                  <>{selectedChat.chatName.toUpperCase()}</>
                )}
              </h1>
              {/* modal logic starts */}
              {selectedChat.isGroupChat ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="p-2 bg-gray-300 rounded-md">
                      <FaEye />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Group</DialogTitle>
                      <DialogDescription>
                        Add , remove or update Participants
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <div className=" flex-1 gap-2 flex flex-wrap ">
                        {selectedUsers?.map((u) => {
                          return (
                            <div
                              key={u._id}
                              className="flex px-2 py-1 bg-green-200 text-black rounded-lg items-center gap-2"
                            >
                              {u.name}
                              <button
                                className="hover:cursor-pointer text-red-700"
                                onClick={() => {
                                  handleRemove(u);
                                }}
                              >
                                x
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex">
                      <input
                        onChange={(e) => setGroupChatName(e.target.value)}
                        className="px-4 py-3 border-gray-300 outline-1 w-full"
                        placeholder="rename group"
                      ></input>

                      <button
                        onClick={handleRename}
                        className=" px-4 py-2 cursor-pointer  hover:bg-green-400 text-white bg-green-300"
                      >
                        Change
                      </button>
                    </div>
                    <input
                      onChange={(e) => {
                        handleSearch(e.target.value);
                      }}
                      className="px-4 py-3 border-gray-300 outline-1 w-full"
                      placeholder="Add Participants"
                    ></input>
                    {loading ? (
                      <h1>loading</h1>
                    ) : (
                      searchResult?.slice(0, 4).map((user) => {
                        return (
                          <div
                            onClick={() => {
                              handleAddUser(user);
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
                    <DialogFooter className="sm:justify-around">
                      <DialogClose asChild>
                        <Button
                          onClick={() => handleRemove(user)}
                          className="bg-red-700 text-white"
                          type="button"
                          variant="secondary"
                        >
                          Leave Group
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                //private

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="p-2 bg-gray-300 rounded-md">
                      <FaEye />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>User Info</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <div className=" flex-1 flex-col gap-2 flex flex-wrap ">
                        <img src={getImage(user, selectedChat.users)}></img>
                        <div className="text-2xl">
                          Name: {getSender(user, selectedChat.users)}
                        </div>
                        <div>Email: {getEmail(user, selectedChat.users)}</div>
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
              )}

              {/* modal logic ends */}
            </div>
          </div>
          {/* single chat */}
          <div
            style={{
              backgroundImage: `url("https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/Desktop.png")`,
              backgroundSize: "cover", // Optional, but common
              backgroundPosition: "center", // Optional
            }}
            className="min-h-[94%] bar flex flex-col w-full rounded-md   bg-gray-100 "
          >
            <div className=" bar flex-11/12 max-h-[100%] flex flex-col overflow-scroll  px-4 py-2 ">
              <ScrollableFeed className="bar">
                {messages &&
                  messages.map((m, i) => {
                    return (
                      <div key={m._id} className="flex items-center bar">
                        {(isSameSender(messages, m, i, user._id) ||
                          isLastMessage(messages, i, user._id)) && (
                          <div>
                            <img
                              className="h-10 w-10 rounded-full"
                              src={m.sender.pic}
                            ></img>
                          </div>
                        )}
                        <span
                          style={{
                            marginLeft: isSameSenderMargin(
                              messages,
                              m,
                              i,
                              user._id
                            ),
                            marginTop: isSameUser ? 3 : 10,
                          }}
                          className={`${
                            m.sender._id == user._id
                              ? `bg-green-900`
                              : `bg-teal-600`
                          }
                            px-4 py-2 rounded-xl text-white text-xl`}
                        >
                          {m.content}
                        </span>
                      </div>
                    );
                  })}
              </ScrollableFeed>
            </div>
            {/* messages  */}

            {typing ? (
              <img
                className=" h-10 w-10 ml-3 mb-2 rounded-full"
                src="https://assets-v2.lottiefiles.com/a/74354a62-117b-11ee-b7c7-83fee5c61559/0VxdZ2ens7.gif"
              ></img>
            ) : (
              <div></div>
            )}
            <input
              className="bg-white rounded-md border-2 border-gray-300 w-[95%] mb-4 self-center h-12 px-2"
              placeholder="Enter your message"
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={sendMessage}
            ></input>
          </div>
        </div>
      ) : (
        "Click on a user to Start the Chat :) "
      )}
    </div>
  );
};

export default Chatbox;
