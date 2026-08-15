import axios from "axios";

const baseURL = "https://be-fds.onrender.com/api/v1";

const publicInstance = axios.create({
  baseURL,
  timeout: 10000,
  timeoutErrorMessage: "Request timed out, try again later",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicInstance;
