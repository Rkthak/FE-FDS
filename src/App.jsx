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
import MyOrders from "./Pages/Order";
import Checkout from "./Pages/CheckOut";
import OrderDetails from "./Pages/OrderDetails";
import PaymentHistory from "./Pages/PaymentHistory";
import MenuDetails from "./Pages/MenuDetails";
import RestaurantOrders from "./Pages/RestaurantOrder";
import RestaurantOrderDetails from "./Pages/RestuarantOrderByID";
import RestaurantEdit from "./Pages/RestaurantEdit";
import RestaurantMenu from "./Pages/RestaurantMenu";
import AddMenu from "./Pages/AddMenu";
import EditMenu from "./Pages/EditMenu";
import AdminRestaurantDetails from "./Pages/AdminRestaurantDetails";
import AdminRestaurants from "./Pages/AdminRestaurant";
import RestaurantRegister from "./Pages/RestaurantRegister";
import ReApplyRestaurant from "./Pages/ReApplyRestaurant";
import AllMenus from "./Pages/AllMenu";
import OrderSocket from "./Components/OrderSocket";
import VerifyEmail from "./Pages/VerifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    loader: authInitLoader,
    hydrateFallbackElement: <HydrateFallback />,
    children: [
      {
        index: true,
        element: <Home />,
        hydrateFallbackElement: <HydrateFallback />,
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
        path: "/orders",
        element: <MyOrders />,
        loader: authLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/order/:orderID",
        element: <OrderDetails />,
        loader: authLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
        loader: authLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/payment-history",
        element: <PaymentHistory />,
        loader: authLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
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
        path: "/admin/dashboard/restaurant",
        element: <AdminRestaurants />,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/admin/dashboard/restaurant/:restaurantID",
        element: <AdminRestaurantDetails />,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant/dashboard",
        element: <RestaurantDashboard />,
        loader: restaurantrLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant/dashboard/orders",
        element: <RestaurantOrders />,
        loader: restaurantrLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant/dashboard/orders/:orderID",
        element: <RestaurantOrderDetails />,
        loader: restaurantrLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant/dashboard/edit/:slugID",
        element: <RestaurantEdit />,
        loader: restaurantrLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant/dashboard/menu",
        element: <RestaurantMenu />,
        loader: restaurantrLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant/dashboard/menu/create",
        element: <AddMenu />,
        loader: restaurantrLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant/dashboard/menu/:menuID/edit",
        element: <EditMenu />,
        loader: restaurantrLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },

      {
        path: "/restaurants",
        element: <GetAllRestaurants />,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant/:slugID",
        element: <RestaurantDetails />,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/menu",
        element: <AllMenus />,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/menu/:menuID",
        element: <MenuDetails />,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant-register",
        element: <RestaurantRegister />,
        loader: authLoader,
        hydrateFallbackElement: <HydrateFallback />,
      },
      {
        path: "/restaurant-reapply",
        element: <ReApplyRestaurant />,
        loader: authLoader,
        hydrateFallbackElement: <HydrateFallback />,
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
        <OrderSocket />
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
