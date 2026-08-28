import { redirect } from "react-router";
import { clearUser, setUser } from "../Redux/authSlice";
import store from "../Redux/store";
import { getMe } from "../Services/authService";

const authInitLoader = async () => {
  try {
    const response = await getMe();
    const user = response.user;

    store.dispatch(setUser(user));

    if (user.role === "admin") {
      return redirect("/admin/dashboard");
    }

    if (user.role === "restaurant") {
      return redirect("/restaurant/dashboard");
    }

    return null;
  } catch {
    store.dispatch(clearUser());

    // Guest ko public customer pages access karne dena hai
    return null;
  }
};

export default authInitLoader;
