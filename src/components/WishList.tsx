import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import { removeFav } from "../store/wishListSlice";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  penalty?: number;
  clearedAt?: string;
};

const WishList = () => {
  const { user } = useOutletContext<{ user: User | null }>();

  const books = useSelector((state: RootState) => state.wishList);
  console.log("books", books);
  const dispatch = useDispatch<AppDispatch>();
  const removeFromWishList = (id) => {
    dispatch(removeFav(id));
  };
  const cards = books.map((book) => (
    <div className="col-sm-4" style={{ marginBottom: "10px" }} key={book.id}>
      <Card className="h-100">
        <div className="text-center">
          <Card.Img
            variant="top"
            src={book.image}
            style={{ width: "100px", height: "130px" }}
          />
        </div>
        <Card.Body>
          <Card.Title>{book.title}</Card.Title>
          <Card.Body> {book.authors}</Card.Body>
          <div>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: book.available ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {book.available ? "Available" : "Rented"}
            </span>
          </div>
        </Card.Body>
        <Card.Footer style={{ background: "white" }}>
          <Button
            variant="primary"
            onClick={() => removeFromWishList(book.id)}
            disabled={!book.available}
          >
            {book.available ? "Remove from Favorites" : "Unavailable"}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  ));
  return (
    <>
      {user ? (
        <div className="row">{cards}</div>
      ) : (
        <div className="text-center mt-5">
          <h2>Please login to access the dashboard</h2>
        </div>
      )}
    </>
  );
};

export default WishList;
