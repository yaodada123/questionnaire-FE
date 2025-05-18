import React, {Suspense} from "react";
import logo from "./logo.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";


function App() {
  // const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  // console.log('API URL:', apiUrl);
  return (
    <div className="App">
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
}

export default App;
