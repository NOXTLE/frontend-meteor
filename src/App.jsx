import React from "react";
import { Link } from "react-router-dom";
import BG from "./assets/e5236015-1625-4afe-8b80-7796280c272b.jpg";
import { Container } from "@chakra-ui/react";
import "./App.css";
const App = () => {
  return (
    <div
      className="min-h-screen max-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${BG})` }}
    ></div>
  );
};

export default App;
