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
import { adminLoader, restaurantrLoader } from "./Loaders/roleLoader";
import AdminDashboard from "./Pages/AdminDashboard";
import RestaurantDashboard from "./Pages/RestaurantDashboard";
import RestaurantDetails from "./Pages/RestaurantDetails";
import GetAllRestaurants from "./Pages/GetAllRestaurant";
import ErrorPage from "./Pages/ErrorPage";
import Cart from "./Pages/Cart";
import Favorites from "./Pages/Favorites";
import HydrateFallback from "./Components/HydratedFallBack";

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
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/cart",
        element: <Cart />,
        loader: authLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
        loader: authLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
        loader: adminLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant/dashboard",
        element: <RestaurantDashboard />,
        loader: restaurantrLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurants",
        element: <GetAllRestaurants />,
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
  {
    path: "/404",
    element: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
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
