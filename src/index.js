import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

import "./index.css";
import App from "./App";
import { UserUtils } from "./components/shared/user";
import { BASE_URL, LOGIN_URL, REFRESH_TOKEN_URL } from "./components/shared/axiosUrls";
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

function createAxiosResponseInterceptor() {
  const interceptor = axios.interceptors.response.use(
      response => response,
      async (err) => {
        const originalConfig = err.config;
        if(originalConfig)
        {
          if (originalConfig.url !== (BASE_URL + LOGIN_URL ) && err.response) {
            // Access Token was expired
  
            if (err.response.status === 401 && !originalConfig._retry) {
              axios.interceptors.response.eject(interceptor);
              originalConfig._retry = true;
  
              try {
                const rs = await axios
                .post(BASE_URL + REFRESH_TOKEN_URL, {
                  refresh: UserUtils.getRefreshToken(),
                })
                UserUtils.setAccessToken(rs.data.access)
  
                return axios(originalConfig);
              } catch (_error) {
                UserUtils.clearLocalStorage()
                const history = useHistory()
                //not working here 
                history.push('/login')
                return Promise.reject(_error);
              }
            }
          }
          return Promise.reject(err);
        }
        }

  );
}

const Index = () => {
  createAxiosResponseInterceptor()
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
