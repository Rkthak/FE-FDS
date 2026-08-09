import { redirect } from "react-router";
import { clearUser, setUser } from "../Redux/authSlice";
import { getMe } from "../Services/authService";
import store from "../Redux/store";

export const userLoader = async () => {
  try {
    const response = await getMe();
    const user = response.user;

    store.dispatch(setUser(user));

    if (user.role !== "user") {
      if (user.role === "admin") {
        return redirect("/admin/dashboard");
      } else if (user.role === "restaurant") {
        return redirect("/restaurant/dashboard");
      }

      return redirect("/login");
    }

    return response;
  } catch (error) {
    console.error("User loader error:", error);
    store.dispatch(clearUser());
    return redirect("/login");
  }
};

export const adminLoader = async () => {
  try {
    const response = await getMe();
    const user = response.user;

    store.dispatch(setUser(user));

    if (user.role !== "admin") {
      if (user.role === "user") {
        return redirect("/dashboard");
      } else if (user.role === "restaurant") {
        return redirect("/restaurant/dashboard");
      }

      return redirect("/login");
    }

    return response;
  } catch (error) {
    console.error("Admin loader error:", error);
    store.dispatch(clearUser());
    return redirect("/login");
  }
};

export const restaurantrLoader = async () => {
  try {
    const response = await getMe();
    const user = response.user;

    store.dispatch(setUser(user));

    if (user.role !== "restaurant") {
      if (user.role === "user") {
        return redirect("/dashboard");
      } else if (user.role === "admin") {
        return redirect("/admin/dashboard");
      }

      return redirect("/login");
    }

    return response;
  } catch (error) {
    console.error("restaurant loader error:", error);
    store.dispatch(clearUser());
    return redirect("/login");
  }
};
