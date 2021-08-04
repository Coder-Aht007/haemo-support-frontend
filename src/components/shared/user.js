const UserUtils = (function () {
  let _service;

  const getName = function () {
    return localStorage.getItem("username");
  };

  const clearLocalStorage = function () {
    localStorage.clear();
  };

  const setName = function (name) {
    // Also set this in cookie/localStorage
    localStorage.setItem("username", name);
  };

  const setToken = function (accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const getAccessToken = function () {
    return localStorage.getItem("accessToken");
  };

  const getRefreshToken = function () {
    return localStorage.getItem("refreshToken");
  };

  const _getService = function() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }

 const isLogin = function() {
    if (getName() !== null && getName !== "") {
      return true;
    }
  }
  return {
    getService: _getService,
    isLogin: isLogin,
    getName: getName,
    setName: setName,
    clearLocalStorage: clearLocalStorage,
    setToken: setToken,
    getAccessToken: getAccessToken,
    getRefreshToken: getRefreshToken,
  };
})();

export default UserUtils;
