import { io } from "socket.io-client";

const socket = io("https://be-fds.onrender.com/api/v1", {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
