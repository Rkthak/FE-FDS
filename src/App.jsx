import { createBrowserRouter, RouterProvider } from "react-router";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./Redux/store";
import Home from "./Pages/Home";
import authInitLoader from "./Loaders/authInitLoader";
import MainLayout from "./Layout/MainLayout";

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
          autoClose={3000}
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
