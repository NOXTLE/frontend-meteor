import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import Side from "../components/Side";
import Chats from "../components/Chats";
import Chatbox from "../components/Chatbox";

const Chat = () => {
  const { user, setUser } = useContext(Context);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("info"));
    setUser(usr);
  }, []);
  return (
    <div className="w-screen h-screen bg-zinc-900 p-2 text-white  flex  flex-col">
      <div>{user && <Side></Side>}</div>
      <div className="flex justify-between w-full h-[91.5vh]  p-2.5">
        {user && (
          <Chats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></Chats>
        )}
        {user && (
          <Chatbox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          ></Chatbox>
        )}
      </div>
    </div>
  );
};

export default Chat;
