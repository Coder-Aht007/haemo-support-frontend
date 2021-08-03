const UserProfile = (function () {

  var _service;

  var getName = function () {
    return localStorage.getItem("username");
  };

  var destroySession = function () {
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

  return {
    getService : _getService,
    getName: getName,
    setName: setName,
    destroySession: destroySession,
    setToken: setToken,
    getAccessToken: getAccessToken,
    getRefreshToken: getRefreshToken,
  };
})();

export default UserProfile;
