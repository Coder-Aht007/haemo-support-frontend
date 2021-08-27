import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

import "./index.css";
import App from "./App";
import { UserUtils } from "./components/shared/user";
import { BASE_URL, REFRESH_TOKEN_URL } from "./components/shared/axiosUrls";
import { useHistory } from "react-router-dom";
import "./assets/css/nucleo-icons.css";
import "./assets/css/black-dashboard-react.css";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = UserUtils.getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    const history = useHistory()
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return axios
        .post(BASE_URL + REFRESH_TOKEN_URL, {
          refresh: UserUtils.getRefreshToken(),
        })
        .then((res) => {
          // 1) put token to LocalStorage
          if (res.status === 200) {
            UserUtils.clearLocalStorage();
            UserUtils.setToken(res.data.access_token, res.data.refresh_token);

            // 2) Change Authorization header
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + UserUtils.getAccessToken();

            // 3) return originalRequest object with Axios.
            return axios(originalRequest);
          } else {
            history.push('/login')
          }
        })
        .catch((err) => {
          UserUtils.clearLocalStorage();
          history.push('/login')
        });
    } else {
      UserUtils.clearLocalStorage();
      history.push('/login')
    }
  }
);

const Index = () => {
  return <App />;
};

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
