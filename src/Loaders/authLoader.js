import { redirect } from "react-router";
import store from "../Redux/store";
import { clearUser, setUser } from "../Redux/authSlice";
import { getMe } from "../Services/authService";

const authLoader = async () => {
  try {
    const response = await getMe();
    store.dispatch(setUser(response.user));
    return response;
  } catch (error) {
    console.error("Auth loader error:", error);
    store.dispatch(clearUser());
    return redirect("/login");
  }
};

export default authLoader;
