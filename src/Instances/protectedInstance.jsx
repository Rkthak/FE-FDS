import axios from "axios";

const baseURL = "http://localhost:5000/api/v1";

const protectedInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  timeoutErrorMessage: "request time out passes, try again later",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default protectedInstance;
