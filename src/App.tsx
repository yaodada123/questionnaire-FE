import React from "react";
import logo from "./logo.svg";
import "./App.css";
import List from "./pages/List";
import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
