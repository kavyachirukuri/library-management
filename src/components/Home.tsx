import { useOutletContext } from "react-router-dom";
import Dashboard from "./Dashboard";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  penalty?: number;
  clearedAt?: string;
};

const Home = () => {
  const { user } = useOutletContext<{ user: User | null }>();

  return (
    <div>
      {user ? (
        <Dashboard />
      ) : (
        <div className="text-center mt-5">
          <h2>Please login to access the dashboard</h2>
        </div>
      )}
    </div>
  );
};

export default Home;
