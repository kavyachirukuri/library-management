import { useEffect, useState } from "react";
import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-bootstrap";
import StatusCode from "../utils/statusCode";
import { getBooks, markAsUnavailable } from "../store/booksSlice";
import { addFav } from "../store/wishListSlice";
import type { AppDispatch, RootState } from "../store";
import { addRentals } from "../store/myRentalsSlice";
import { useOutletContext } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  penalty?: number;
  clearedAt?: string;
};

const Books = () => {
  const { user } = useOutletContext<{ user: User | null }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data: books, status } = useSelector(
    (state: RootState) => state.books
  );

  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  useEffect(() => {
    if (books.length === 0) return;

    const storedRentals = JSON.parse(localStorage.getItem("rentals") || "[]");
    const now = new Date().toISOString();

    storedRentals.forEach((rental) => {
      if (rental.dueAt > now) {
        dispatch(markAsUnavailable(rental.id));
      }
    });
  }, [books, dispatch]);

  if (status === StatusCode.LOADING) {
    return "loading...";
  }

  if (status === StatusCode.ERROR) {
    return <Alert>Something went wrong</Alert>;
  }

  const addToFavorites = (book) => {
    dispatch(addFav(book));
  };

  const rentBook = (book) => {
    if (!user) return;

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userPenalty = storedUser?.penalty || 0;
    if (userPenalty > 50) {
      alert(
        "You have unpaid penalties over ₹50. Please clear them before renting more books."
      );
      return;
    }

    const existingRentals = JSON.parse(localStorage.getItem("rentals") || "[]");
    const isAlreadyRented = existingRentals.some(
      (rental) => rental.id === book.id && rental.rentedBy === user.name
    );

    if (isAlreadyRented) return;

    dispatch(addRentals(book));
    dispatch(markAsUnavailable(book.id));
  };

  const isRented = (bookId: string) => {
    const rentals = JSON.parse(localStorage.getItem("rentals") || "[]");
    return rentals.some(
      (rental) => rental.id === bookId && rental.rentedBy === user?.name
    );
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cards = filteredBooks.map((book) => (
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
          <Card.Body>{book.authors}</Card.Body>
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
        <Card.Footer
          style={{
            background: "white",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="info"
            onClick={() => addToFavorites(book)}
            disabled={!book.available}
          >
            {book.available ? "Add To Favorites" : "Add To Favorites"}
          </Button>
          <Button
            onClick={() => rentBook(book)}
            disabled={!book.available || isRented(book.id)}
          >
            {!book.available || isRented(book.id) ? "Unavailable" : "Rent Book"}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  ));

  return (
    <>
      <InputGroup className="mb-3 mt-3">
        <FormControl
          placeholder="Search books by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <div className="row">{cards}</div>
    </>
  );
};

export default Books;
