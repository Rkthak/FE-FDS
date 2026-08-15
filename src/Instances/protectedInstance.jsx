import axios from "axios";

export const baseURL = "https://be-fds.onrender.com/api/v1";

const protectedInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  timeoutErrorMessage: "request time out passes, try again later",
  withCredentials: true,
});

export default protectedInstance;
