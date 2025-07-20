import { createContext, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/home.jsx";
import Chat from "./pages/chat.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/chat", element: <Chat /> },
  { path: "/main", element: <App /> },
]);

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  return (
    <Context.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </Context.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <RouterProvider router={router}></RouterProvider>
  </ContextProvider>
);
