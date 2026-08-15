import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "../socket";

const OrderSocket = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();
    socket.emit("join:user", user._id);

    const handleStatusUpdate = (data) => {
      toast.info(`Order status: ${data.status.replaceAll("_", " ")}`);
    };

    socket.on("order:status:update", handleStatusUpdate);

    return () => {
      socket.off("order:status:update", handleStatusUpdate);
      socket.disconnect();
    };
  }, [user?._id]);

  return null;
};

export default OrderSocket;
