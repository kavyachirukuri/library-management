import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button } from "react-bootstrap";
import type { AppDispatch, RootState } from "../store";
import { removeMultipleRentals, removeRentals } from "../store/myRentalsSlice";
import { useOutletContext } from "react-router-dom";
import { calculatePenalty } from "../utils/penaltyUtils";
import { setPenalty } from "../store/userSlice";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  penalty?: number;
  clearedAt?: string;
};

const MyRentals = () => {
  const { user } = useOutletContext<{ user: User | null }>();
  const dispatch = useDispatch<AppDispatch>();
  const rentals = useSelector((state: RootState) => state.myRentals);
  const penalty = useSelector(
    (state: RootState) => state.user.user?.penalty || 0
  );
  const [penaltyPaid, setPenaltyPaid] = useState(false);
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCountdowns: { [key: string]: string } = {};
      let total = 0;

      rentals?.forEach((book) => {
        const now = new Date();
        const due = new Date(book.dueAt);
        const diffMs = due.getTime() - now.getTime();

        if (diffMs <= 0) {
          updatedCountdowns[book.id] = "Expired";

          const bookRentedAt = new Date(book.rentedAt);
          const clearedAt = user?.clearedAt ? new Date(user.clearedAt) : null;

          const shouldCountPenalty = !clearedAt || bookRentedAt > clearedAt;

          if (shouldCountPenalty) {
            const bookPenalty = calculatePenalty(book.dueAt);
            total += bookPenalty;
          }
        } else {
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

          updatedCountdowns[book.id] = `${hours}h ${minutes}m ${seconds}s`;
        }
      });

      setCountdowns(updatedCountdowns);

      if (user?.penalty !== total) {
        dispatch(setPenalty(total));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [rentals, dispatch, penaltyPaid, user]);

  const handleReturn = (id: string) => {
    dispatch(removeRentals(id));
    setPenaltyPaid(false);
  };

  const handlePayPenalty = () => {
    const now = new Date().toISOString();

    const updatedUser = { ...user, penalty: 0, clearedAt: now };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    dispatch(setPenalty(0));

    const expiredRentalIds = rentals
      .filter((book) => new Date(book.dueAt) < new Date())
      .map((book) => book.id);

    if (expiredRentalIds.length > 0) {
      dispatch(removeMultipleRentals(expiredRentalIds));
    }

    setPenaltyPaid(true);
    alert("Penalty paid successfully!");
  };

  const cards = rentals.map((book) => (
    <div className="col-sm-4" key={book.id} style={{ marginBottom: "10px" }}>
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
          <Card.Text>
            <strong>Rental Start:</strong>{" "}
            {new Date(book.rentedAt).toLocaleString()}
          </Card.Text>
          <Card.Text>
            <strong>Due Date:</strong> {new Date(book.dueAt).toLocaleString()}
          </Card.Text>
          <Card.Text>
            <strong>Time Remaining:</strong>{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>
              {countdowns[book.id] || "Loading..."}
            </span>
          </Card.Text>
        </Card.Body>
        <Card.Footer
          style={{
            background: "white",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="danger" onClick={() => handleReturn(book.id)}>
            Return Book
          </Button>
        </Card.Footer>
      </Card>
    </div>
  ));

  return (
    <div className="row">
      {user ? (
        <>
          <div className="row">{cards}</div>

          <div className="text-center mt-4">
            <h5>
              Total Penalty:{" "}
              <span style={{ color: penalty > 0 ? "red" : "green" }}>
                ₹{penalty}
              </span>
            </h5>
            {penalty > 0 && (
              <Button
                variant="success"
                className="mt-2"
                onClick={handlePayPenalty}
              >
                Pay Penalty
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <h2>Please login to access the dashboard</h2>
        </div>
      )}
    </div>
  );
};

export default MyRentals;
