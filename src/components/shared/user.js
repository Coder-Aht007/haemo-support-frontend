export const UserUtils = {
  getUserName: () => {
    return localStorage.getItem("username");
  },
  isLogin: () => {
    if (
      UserUtils.getUserName() !== null &&
      UserUtils.getUserName() !== "" &&
      UserUtils.getAccessToken() !== null
    ) {
      return true;
    }
  },
  setUserName: (username) => {
    localStorage.setItem("username", username);
  },
  clearLocalStorage: () => {
    localStorage.clear();
  },
  setToken: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },
  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },
  isAdmin: () => {
    const value = localStorage.getItem("is_admin");
    let myBoolPerm = value === "true";
    return myBoolPerm;
  },
  setIsAdmin: (value) => {
    localStorage.setItem("is_admin", value);
  },
  setAccessToken: (value) => {
    localStorage.setItem("accessToken", value);
  },
};
