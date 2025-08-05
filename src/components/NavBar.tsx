import { Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../store";

type NavBarProps = {
  user: { name: string } | null;
  handleLogout: () => void;
};

const NavBar = ({ user, handleLogout }: NavBarProps) => {
  const wishListBooks = useSelector((state: RootState) => state.wishList);
  const myRentals = useSelector((state: RootState) => state.myRentals);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          LIBRARY
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex justify-content-between w-100 align-items-center">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/wishlists">
                {user && <span>My WishList ({wishListBooks?.length})</span>}
              </Nav.Link>
              <Nav.Link as={Link} to="/myrentals">
                {user && (
                  <span>My Rentals ({user ? myRentals.length : 0})</span>
                )}
              </Nav.Link>
              {user && (
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
              )}
            </Nav>

            <div className="d-flex align-items-center gap-3">
              {user?.name && <div>{user.name}</div>}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="btn btn-outline-primary">
                  LOGIN
                </Link>
              )}
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
