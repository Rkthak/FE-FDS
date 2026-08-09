import { createBrowserRouter, RouterProvider } from "react-router";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./Redux/store";
import Home from "./Pages/Home";
import authInitLoader from "./Loaders/authInitLoader";
import MainLayout from "./Layout/MainLayout";
import UserProfile from "./Pages/UserProfile";
import authLoader from "./Loaders/authLoader";
import UserDashboard from "./Pages/UserDashboard";
import {
  adminLoader,
  restaurantrLoader,
  userLoader,
} from "./Loaders/roleLoader";
import AdminDashboard from "./Pages/AdminDashboard";
import RestaurantDashboard from "./Pages/RestaurantDashboard";
import RestaurantDetails from "./Pages/RestaurantDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    loader: authInitLoader,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile",
        element: <UserProfile />,
        loader: authLoader,
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
        loader: userLoader,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
        loader: adminLoader,
      },
      {
        path: "/restaurant/dashboard",
        element: <RestaurantDashboard />,
        loader: restaurantrLoader,
      },
      {
        path: "/restaurant/:slugID",
        element: <RestaurantDetails />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <RouterProvider router={router} />{" "}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Provider>
    </div>
  );
};

export default App;
