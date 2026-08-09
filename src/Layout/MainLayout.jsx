import { Outlet } from "react-router";
import Navbar from "../Components/NavBar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
