export const UserUtils = {
  getName: () => {
    return localStorage.getItem("username");
  },
  isLogin: () => {
    if (UserUtils.getName() !== null && UserUtils.getName() !== "") {
      return true;
    }
  },
  setName: (name) => {
    localStorage.setItem("username", name);
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
  getUserPermission: () => {
    const value = localStorage.getItem("permission");
    let myBoolPerm = value === "true";
    return myBoolPerm;
  },
  setUserPermission: (value) => {
    localStorage.setItem("permission", value);
  },
};
