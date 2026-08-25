import { clearUser, setUser } from "../Redux/authSlice";
import store from "../Redux/store";
import { getMe } from "../Services/authService";

const authInitLoader = async () => {
  try {
    const response = await getMe();

    store.dispatch(setUser(response.user));

    return null;
  } catch {
    store.dispatch(clearUser());

    // ❗ Login par redirect nahi karna
    return null;
  }
};

export default authInitLoader;
