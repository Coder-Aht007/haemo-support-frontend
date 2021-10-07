export const BASE_URL = "http://127.0.0.1:8000";
// process.env.REACT_APP_BACKEND_BASE_URL !== null
//   ? process.env.REACT_APP_BACKEND_BASE_URL
//   : "http://127.0.0.1:8000";
export const REFRESH_TOKEN_URL = "/auth/refresh";
export const REGISTER_URL = "/auth/register";
export const LOGIN_URL = "/auth/login";
export const GET_HEALTH_PROFILE = "/profile/";
export const GET_USER_BASIC_DATA = "/auth/user";
export const EDIT_USER_DATA = "/auth/user/";
export const DELETE_ILLNESS = "/profile/illness/delete/";
export const EDIT_ILLNESS = "/profile/illness/edit/";
export const ADD_ILLNESS = "/profile/illness/add";
export const WEB_SOCKET_PATH = "ws://127.0.0.1:8000/ws/donations";
export const GET_OLD_DONATION_REQUESTS = "/donations/";
export const POST_DONATION_REQUEST = "/donations/";
export const GET_USER_DONATION_REQUESTS = "/donations/requests/";
export const DELETE_REQUEST = "/donations/";
export const EDIT_REQUEST = "/donations/";
export const UPLOAD_CSV = "/parse-csv/";
export const ADD_BULK_USERS = "/auth/bulk-create-users/";
export const SET_PASSWORD = "/auth/set-password/";
export const AWAITED_DONATION_REQUESTS = "/awaited-donations/";
export const PENDING_DUE_SOON_REQUESTS = "/due-soon-pending-donations/";
export const NOTIFY_PENDING_Due_SOON_REQUESTS =
  "/due-soon-pending-donations/notify_users/";
