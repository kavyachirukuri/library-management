import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import WishList from "./components/WishList";
import Layout from "./components/Layout";
import MyRentals from "./components/MyRentals";
import Profile from "./components/Profile";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/wishlists" element={<WishList />} />
          <Route path="/myrentals" element={<MyRentals />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
