const UserUtils = (function () {

  var _service;

  var getName = function () {
    return localStorage.getItem("username");
  };

  var clearLocalStorage = function () {
    localStorage.clear();
  };

  var setName = function (name) {
    // Also set this in cookie/localStorage
    localStorage.setItem("username", name);
  };

  var setToken = function (accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  var getAccessToken = function () {
    return localStorage.getItem("accessToken");
  };

  var getRefreshToken = function () {
    return localStorage.getItem("refreshToken");
  };

  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }

  function isLogin() {
    if(getName()!==null&&getName!=="")
    {
      return true
    }
  }
  return {
    getService : _getService,
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
