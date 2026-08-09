import { useSelector } from "react-redux";

const Home = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  return (
    <div>
      <h1>Home</h1>

      {isAuthenticated && <p>Welcome {user?.userName}</p>}
    </div>
  );
};

export default Home;
