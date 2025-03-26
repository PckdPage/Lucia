import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import HomeLoggedIn from "../components/main/HomeLoggedIn";

const Home = () => {
  const navigate = useNavigate();
  const { isError, isLoading } = useQuery({
    queryKey: ["verify"],
    queryFn: async () => {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verify`, {
        withCredentials: true,
      });
      return true;
    },
    retry: false,
  });

  return (
    <>
      {!isLoading && isError ? (
        // <button
        //   onClick={handleLogin}
        //   className="border bg-amber-400 cursor-pointer"
        // >
        <button
          className="border-8 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      ) : (
        <HomeLoggedIn />
      )}
    </>
  );
};

export default Home;
