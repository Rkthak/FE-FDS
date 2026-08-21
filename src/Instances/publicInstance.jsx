import axios from "axios";

const baseURL = "http://localhost:5000/api/v1";

const publicInstance = axios.create({
  baseURL,
  timeout: 30000,
  timeoutErrorMessage: "Request timed out, try again later",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicInstance;
