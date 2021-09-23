import React from "react";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Main from "./components/MainComponent";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Main />
          <ToastContainer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
