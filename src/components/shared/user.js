export const UserUtils = {
  getName: () => {
    console.log(localStorage.getItem("username"));
    return localStorage.getItem("username");
  },
  isLogin: () => {
    if (UserUtils.getName() !== null && UserUtils.getName() !== "") {
      return true;
    }
  },
  setName: (name ) => {
    localStorage.setItem("username", name);
  },
  clearLocalStorage: () => {
    localStorage.clear();
  },
  setToken: (accessToken, refreshToken ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },
  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },
};
