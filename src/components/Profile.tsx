import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect, useState } from "react";
import type { RootState } from "../store";
import { updateProfile } from "../store/userSlice";
import { calculatePenalty } from "../utils/penaltyUtils";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const myRentals = useSelector((state: RootState) => state.myRentals);

  const [penalties, setPenalties] = useState<
    { id: string; title: string; penalty: number }[]
  >([]);
  const [totalPenalty, setTotalPenalty] = useState(0);

  const [imagePreview, setImagePreview] = useState(user.avatar || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImagePreview(user.avatar || "");
  }, [user.avatar]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        dispatch(updateProfile({ avatar: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const totalBooksRented = myRentals.length;
  const currentActiveRentals = myRentals.filter(
    (r) => new Date(r.dueAt) > new Date()
  ).length;

  useEffect(() => {
    const now = new Date();

    const calculatedPenalties = myRentals
      .filter((rental) => new Date(rental.dueAt) < now)
      .map((rental) => ({
        id: rental.id,
        title: rental.title,
        penalty: calculatePenalty(rental.dueAt),
      }));

    setPenalties(calculatedPenalties);

    const total = calculatedPenalties.reduce(
      (acc, cur) => acc + cur.penalty,
      0
    );

    setTotalPenalty(total);
  }, [myRentals]);

  return (
    <div className="container mt-4">
      <h2>My Profile</h2>
      <div className="d-flex gap-4 mt-3">
        <div>
          <img
            src={imagePreview || "https://via.placeholder.com/150"}
            alt="profile"
            width={150}
            height={150}
            style={{ objectFit: "cover", borderRadius: "50%" }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <button
            className="btn btn-secondary mt-2 mr-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Profile Picture
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h4>Statistics</h4>
        <p>Total Books Rented: {totalBooksRented}</p>
        <p>Current Active Rentals: {currentActiveRentals}</p>
        <h3 className="mt-4">Penalty Details</h3>
        <p>
          Total Penalty:{" "}
          <span style={{ color: totalPenalty > 0 ? "red" : "green" }}>
            ₹{totalPenalty}
          </span>
        </p>

        {penalties.length > 0 ? (
          <ol>
            {penalties.map((book) => (
              <li key={book.id}>
                <strong>{book.title}</strong>: ₹{book.penalty}
              </li>
            ))}
          </ol>
        ) : (
          <p>No penalties currently</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
