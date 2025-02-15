"use client";
import baseUrl from "@/helper/baseUrl";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

type BookingModalProps = {
  roomId: number;
  roomName: string;
  onClose: () => void;
};

const BookingModal: React.FC<BookingModalProps> = ({ roomId, roomName, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useUser();
  console.log(user);
  

  const handleBooking = async () => {
    if (!title || !description || !startTime || !endTime) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          userId:user.user?.id, // Replace with actual logged-in user ID
          title,
          description,
          startTime,
          endTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      alert("Booking successful!");
      onClose();
    } catch (err) {
      setError("Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Book {roomName}</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-2">
          <label className="block text-gray-700 font-medium">Booking Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter booking title"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            className="w-full border p-2 rounded-md h-20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter booking description"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 font-medium">Start Time</label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded-md"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">End Time</label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded-md"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBooking}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Booking..." : "Confirm"}
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
