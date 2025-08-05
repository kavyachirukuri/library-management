import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { syncRentals } from "../store/myRentalsSlice";
import { logoutUser } from "../store/userSlice";

const Layout = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const hideNavbar = location.pathname === "/login";

  useEffect(() => {
    if (user) {
      dispatch(syncRentals());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      {!hideNavbar && <NavBar user={user} handleLogout={handleLogout} />}
      <Outlet context={{ user }} />
    </div>
  );
};

export default Layout;
