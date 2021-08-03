import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

import UserUtils from './components/shared/user'
import * as themes from "./theme/schema";
import { setToLS } from "./utils/storage";

const userService = UserUtils.getService();

// Add a request interceptor
axios.interceptors.request.use(
  config => {
      const token = UserUtils.getAccessToken();
      if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
      }
      // config.headers['Content-Type'] = 'application/json';
      return config;
  },
  error => {
      Promise.reject(error)
  });


  axios.interceptors.response.use((response) => {
    return response
 }, 
 function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
 
        originalRequest._retry = true;
        return axios.post('https://127.0.0.1:8000/auth/refresh',
            {
              "refresh_token": UserUtils.getRefreshToken()
            })
            .then(res => {
                if (res.status === 201) {
                    // 1) put token to LocalStorage
                    UserUtils.setToken(res.data.access_token,res.data.refresh_token);
 
                    // 2) Change Authorization header
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorageService.getAccessToken();
 
                    // 3) return originalRequest object with Axios.
                    return axios(originalRequest);
                }
            })
    }
 });

const Index = () => {
  setToLS("my-themes", themes.default
  );
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
