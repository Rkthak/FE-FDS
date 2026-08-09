import axios from "axios";

export const baseURL = "http://localhost:5000/api/v1";

const protectedInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  timeoutErrorMessage: "request time out passes, try again later",
  withCredentials: true,
});

export default protectedInstance;
